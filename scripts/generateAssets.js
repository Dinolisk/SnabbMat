// Generates minimal valid PNG placeholder images for Expo build
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, r, g, b) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data: filter byte (0) + RGB * width, repeated height times
  const row = Buffer.alloc(1 + width * 3);
  row[0] = 0; // filter type None
  for (let x = 0; x < width; x++) {
    row[1 + x * 3] = r;
    row[2 + x * 3] = g;
    row[3 + x * 3] = b;
  }
  const rawData = Buffer.concat(Array(height).fill(row));
  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);

  // IEND chunk
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  const table = makeCrcTable();
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeCrcTable() {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuffer, data]);
  const crcValue = Buffer.alloc(4);
  crcValue.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuffer, data, crcValue]);
}

const assetsDir = path.join(__dirname, '..', 'assets');

// icon.png — 1024x1024 dark green
fs.writeFileSync(path.join(assetsDir, 'icon.png'), createPng(1024, 1024, 46, 125, 50));
console.log('✓ icon.png created (1024x1024)');

// adaptive-icon.png — 1024x1024 lighter green
fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), createPng(1024, 1024, 76, 175, 80));
console.log('✓ adaptive-icon.png created (1024x1024)');

// splash.png — 1284x2778 warm background
fs.writeFileSync(path.join(assetsDir, 'splash.png'), createPng(1284, 2778, 255, 244, 230));
console.log('✓ splash.png created (1284x2778)');

// favicon.png — 48x48
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), createPng(48, 48, 46, 125, 50));
console.log('✓ favicon.png created (48x48)');

console.log('\nAll placeholder assets generated successfully.');
