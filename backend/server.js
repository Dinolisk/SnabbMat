const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 8787;
const ICA_GATEWAY_BASE_URL = 'https://apimgw-pub.ica.se/sverige/digx/mdsarecipesearch/v1';
const ICA_BEARER_TOKEN = process.env.ICA_BEARER_TOKEN;

const writeJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  const incomingUrl = new URL(req.url, `http://${req.headers.host}`);

  if (incomingUrl.pathname === '/health') {
    writeJson(res, 200, { ok: true });
    return;
  }

  if (incomingUrl.pathname !== '/api/recipes/page-and-filters') {
    writeJson(res, 404, { error: 'Not found' });
    return;
  }

  if (!ICA_BEARER_TOKEN) {
    writeJson(res, 500, {
      error: 'Missing ICA_BEARER_TOKEN in backend environment',
    });
    return;
  }

  const urlParam = incomingUrl.searchParams.get('url') || '/lax/';
  const takeParam = incomingUrl.searchParams.get('take') || '23';
  const onlyEnabledParam = incomingUrl.searchParams.get('onlyEnabled') || 'true';

  const upstreamUrl = `${ICA_GATEWAY_BASE_URL}/page-and-filters?url=${encodeURIComponent(
    urlParam
  )}&take=${encodeURIComponent(takeParam)}&onlyEnabled=${encodeURIComponent(onlyEnabledParam)}`;

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${ICA_BEARER_TOKEN}`,
      },
    });

    const bodyText = await upstreamResponse.text();
    const contentType = upstreamResponse.headers.get('content-type') || 'application/json; charset=utf-8';

    res.writeHead(upstreamResponse.status, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(bodyText);
  } catch (error) {
    writeJson(res, 502, {
      error: 'Failed to reach ICA gateway',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Recipe proxy listening on http://localhost:${PORT}`);
});
