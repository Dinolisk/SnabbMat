const fs = require('fs/promises');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'icaRecipeDatabase.json');
const MAX_RECIPES = Number(process.env.MAX_RECIPES || 250);
const TAKE = Number(process.env.ICA_TAKE || 23);
const MAX_PAGES_PER_CATEGORY = Number(process.env.MAX_PAGES_PER_CATEGORY || 20);
const ICA_TOKEN = process.env.ICA_BEARER_TOKEN || '';
const ICA_API_BASE = 'https://apimgw-pub.ica.se/sverige/digx/mdsarecipesearch/v1/page-and-filters';
const ICA_INDEXPAGE_URL = 'https://apimgw-pub.ica.se/sverige/digx/mdsarecipesearch/v1/indexpage';
const SEARCH_URLS = (process.env.ICA_SEARCH_URLS || '/lax/,/pizza/,/kyckling/,/pasta/,/middag/,/vegetarisk/')
  .split(',')
  .map((x) => x.trim())
  .filter(Boolean);

const safeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const BLOCKED_PATHS = new Set([
  '/',
  '/kategorier/',
  '/ingrediens/',
  '/typ-av-recept/',
  '/specialkost/',
  '/maltid/',
  '/tillfalle/',
  '/varldens-kok/',
  '/tillagningssatt/',
]);

const toMinutes = (text) => {
  const lower = safeText(text).toLowerCase();
  if (!lower) return 0;
  if (lower.includes('under 30')) return 30;
  if (lower.includes('under 45')) return 45;
  if (lower.includes('under 60')) return 60;
  if (lower.includes('over 60') || lower.includes('över 60')) return 75;
  const match = lower.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

const toDifficulty = (value) => {
  const lower = safeText(value).toLowerCase();
  if (lower.includes('enkel') || lower.includes('latt') || lower.includes('lätt')) return 'Lätt';
  if (lower.includes('medel')) return 'Medel';
  if (lower.includes('svar') || lower.includes('svår')) return 'Svår';
  return 'Lätt';
};

const parseYield = (value) => {
  const match = safeText(value).match(/\d+/);
  return match ? Number(match[0]) : 4;
};

const parseIngredientLine = (line) => {
  const text = safeText(line);
  if (!text) return { name: '', amount: '', unit: '' };
  const match = text.match(/^(\d+(?:[.,]\d+)?(?:\s*\/\s*\d+)?(?:\s+\d+\/\d+)?)\s*([A-Za-zÅÄÖåäö.%]+)?\s+(.*)$/);
  if (!match) {
    const startsUppercase = /^[A-ZÅÄÖ]/.test(text);
    const containsCommonSectionWord = /(sås|servering|fyllning|deg|marinad|sallad|topping)/i.test(text);
    const isLikelySection = startsUppercase || containsCommonSectionWord;
    return { name: text, amount: '', unit: '', isSection: isLikelySection };
  }
  return {
    amount: safeText(match[1] || ''),
    unit: safeText(match[2] || ''),
    name: safeText(match[3] || text),
    isSection: false,
  };
};

const categoryFromPath = (pathUrl) => {
  const parts = safeText(pathUrl)
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/-/g, ' '));
  if (parts.length === 0) return 'ICA';
  const raw = parts[parts.length - 1];
  return raw.charAt(0).toUpperCase() + raw.slice(1);
};

const extractImageUrl = (card, details, ogImage) => {
  if (typeof ogImage === 'string' && ogImage.trim()) {
    return ogImage;
  }

  if (typeof card?.imageUrl === 'string' && card.imageUrl.trim()) {
    return card.imageUrl;
  }

  const detailsImage = details?.image;
  if (typeof detailsImage === 'string') {
    return detailsImage;
  }
  if (Array.isArray(detailsImage) && detailsImage.length > 0) {
    const first = detailsImage[0];
    if (typeof first === 'string') return first;
    if (first && typeof first.url === 'string') return first.url;
  }
  if (detailsImage && typeof detailsImage.url === 'string') {
    return detailsImage.url;
  }
  return '';
};

const normalizeImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) {
    return imagePath.replace('https://www.ica.se/imagevaultfiles/', 'https://assets.icanet.se/imagevaultfiles/');
  }
  if (imagePath.startsWith('imagevaultfiles/')) {
    return `https://assets.icanet.se/${imagePath}`;
  }
  return `https://www.ica.se/${imagePath.replace(/^\/+/, '')}`;
};

const fetchJson = async (url, headers = {}) => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'SnabbMatLocalSync/1.0',
      ...headers,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed ${response.status} for ${url}: ${body.slice(0, 200)}`);
  }
  return response.json();
};

const fetchText = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'SnabbMatLocalSync/1.0',
      Accept: 'text/html',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed ${response.status} for ${url}`);
  }
  return response.text();
};

const extractJsonLdRecipe = (html) => {
  const scriptRegex = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let match = scriptRegex.exec(html);
  while (match) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items) {
        const t = item?.['@type'];
        if (t === 'Recipe' || (Array.isArray(t) && t.includes('Recipe'))) {
          return item;
        }
      }
    } catch {
      // continue
    }
    match = scriptRegex.exec(html);
  }
  return null;
};

const extractOgImage = (html) => {
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  if (ogMatch?.[1]) return safeText(ogMatch[1]);
  const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  if (twitterMatch?.[1]) return safeText(twitterMatch[1]);
  return '';
};

const getAuthHeaders = () => ({ Authorization: `Bearer ${ICA_TOKEN}` });

const fetchCardsForPath = async (pathUrl, page = 1) => {
  const url = `${ICA_API_BASE}?url=${encodeURIComponent(pathUrl)}&take=${TAKE}&page=${page}&onlyEnabled=true`;
  const payload = await fetchJson(url, { Authorization: `Bearer ${ICA_TOKEN}` });
  return payload?.pageDto?.recipeCards || [];
};

const collectPathsFromObject = (value, outputSet) => {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((item) => collectPathsFromObject(item, outputSet));
    return;
  }
  if (typeof value !== 'object') return;

  const potentialKeys = ['url', 'generatedUrl', 'absoluteUrl', 'linkUrl'];
  for (const key of potentialKeys) {
    const candidate = value[key];
    if (
      typeof candidate === 'string' &&
      candidate.startsWith('/') &&
      !candidate.includes('/recept/') &&
      !BLOCKED_PATHS.has(candidate)
    ) {
      outputSet.add(candidate);
    }
  }

  Object.values(value).forEach((nested) => collectPathsFromObject(nested, outputSet));
};

const fetchCategoryPaths = async () => {
  const url = `${ICA_INDEXPAGE_URL}?url=${encodeURIComponent('/kategorier/')}`;
  const payload = await fetchJson(url, getAuthHeaders());
  const paths = new Set();
  collectPathsFromObject(payload, paths);
  return [...paths];
};

const mapRecipe = (card, details, index, ogImage) => {
  const imagePath = safeText(extractImageUrl(card, details, ogImage));
  const imageUrl = imagePath ? normalizeImageUrl(imagePath) : '🍽️';

  const inferredCategory = card?.__sourcePath ? categoryFromPath(card.__sourcePath) : 'ICA';

  const ingredients = Array.isArray(details?.recipeIngredient)
    ? details.recipeIngredient.map((item) => parseIngredientLine(item))
    : [];

  const instructions = Array.isArray(details?.recipeInstructions)
    ? details.recipeInstructions
        .map((step) => (typeof step === 'string' ? step : step?.text))
        .map((step) => safeText(step))
        .filter(Boolean)
    : [];

  return {
    id: `ica_${card?.id || details?.identifier || index}`,
    title: safeText(card?.title || details?.name) || `ICA recept ${index + 1}`,
    description: safeText(details?.description) || 'ICA recept',
    prepTime: toMinutes(card?.cookingTime || details?.totalTime || details?.cookTime || details?.prepTime),
    cookTime: 0,
    servings: parseYield(details?.recipeYield),
    difficulty: toDifficulty(card?.difficulty || details?.difficulty),
    category: inferredCategory,
    image: imageUrl,
    ingredients,
    instructions,
    tags: ['ICA', 'recept', inferredCategory.toLowerCase()],
    icaAverageRating: card?.rating?.averageRating ? String(card.rating.averageRating) : undefined,
    icaIngredientCount: card?.numberOfIngredients,
    sourceUrl: card?.absoluteUrl,
  };
};

const run = async () => {
  if (!ICA_TOKEN) {
    throw new Error('ICA_BEARER_TOKEN saknas i miljo. Satt den i backend/.env innan sync.');
  }

  let categoryPaths = [];
  try {
    categoryPaths = await fetchCategoryPaths();
    console.log(`Discovered ${categoryPaths.length} category paths from indexpage.`);
  } catch (error) {
    console.warn(`Could not load category index, using fallback paths. ${error.message}`);
  }

  const searchPaths = [...new Set([...categoryPaths, ...SEARCH_URLS])];
  console.log(`Loading cards from ${searchPaths.length} search pages...`);
  const cardsByUrl = new Map();
  for (const searchPath of searchPaths) {
    try {
      let totalForPath = 0;
      for (let page = 1; page <= MAX_PAGES_PER_CATEGORY; page += 1) {
        const cards = await fetchCardsForPath(searchPath, page);
        for (const card of cards) {
          if (card?.absoluteUrl && !cardsByUrl.has(card.absoluteUrl)) {
            cardsByUrl.set(card.absoluteUrl, {
              ...card,
              __sourcePath: searchPath,
            });
          }
        }
        totalForPath += cards.length;
        if (cards.length < TAKE || cardsByUrl.size >= MAX_RECIPES) break;
      }
      if (cardsByUrl.size >= MAX_RECIPES) {
        console.log(`Reached MAX_RECIPES (${MAX_RECIPES}), stopping card collection.`);
        break;
      }
      console.log(`Collected ${totalForPath} cards from ${searchPath}`);
    } catch (error) {
      console.warn(`Could not load cards for ${searchPath}: ${error.message}`);
    }
  }

  const cardEntries = [...cardsByUrl.values()].slice(0, MAX_RECIPES);
  if (cardEntries.length === 0) {
    throw new Error(
      'Inga receptkort kunde hamtas. ICA-token ar sannolikt utgangen (900901). Hamt en ny token och kor sync igen.'
    );
  }
  console.log(`Fetching details for ${cardEntries.length} unique recipes...`);

  const out = [];
  for (let i = 0; i < cardEntries.length; i += 1) {
    const card = cardEntries[i];
    try {
      const html = await fetchText(card.absoluteUrl);
      const details = extractJsonLdRecipe(html);
      const ogImage = extractOgImage(html);
      out.push(mapRecipe(card, details, i, ogImage));
    } catch (error) {
      console.warn(`Skipping ${card.absoluteUrl}: ${error.message}`);
      out.push(mapRecipe(card, null, i, ''));
    }
    if ((i + 1) % 20 === 0) {
      console.log(`Progress: ${i + 1}/${cardEntries.length}`);
    }
  }

  if (out.length === 0) {
    throw new Error('Sync gav 0 recept efter detaljhamtning, avbryter for att undvika att skriva tom databas.');
  }

  await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  console.log(`Saved ${out.length} recipes to ${OUTPUT_FILE}`);
};

run().catch((error) => {
  console.error('Sync failed:', error);
  process.exitCode = 1;
});
