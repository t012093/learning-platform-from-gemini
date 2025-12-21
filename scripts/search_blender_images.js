import fs from 'node:fs/promises';
import path from 'node:path';

const INDEX_PATH = path.join(process.cwd(), 'data/curricula/blender/image_index.jsonl');

const tokenize = (text) =>
  text
    .toLowerCase()
    .split(/[\s、。,.!?:"'()\\/\[\]-]+/)
    .map((token) => token.trim())
    .filter(Boolean);

const scoreRecord = (record, queryTokens) => {
  const fields = [
    { text: record.caption || '', weight: 3 },
    { text: record.headingPath || '', weight: 2 },
    { text: record.pageTitle || '', weight: 1 },
    { text: record.alt || '', weight: 1 }
  ];

  let score = 0;
  for (const token of queryTokens) {
    for (const field of fields) {
      if (field.text.toLowerCase().includes(token)) {
        score += field.weight;
      }
    }
  }
  return score;
};

const main = async () => {
  const query = process.argv.slice(2).join(' ').trim();
  if (!query) {
    console.log('Usage: node scripts/search_blender_images.js <query>');
    process.exit(1);
  }

  const raw = await fs.readFile(INDEX_PATH, 'utf8');
  const records = raw
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const queryTokens = tokenize(query);
  if (!queryTokens.length) {
    console.log('No valid query tokens found.');
    process.exit(1);
  }

  const results = records
    .map((record) => ({ record, score: scoreRecord(record, queryTokens) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (!results.length) {
    console.log('No matches found.');
    return;
  }

  for (const { record, score } of results) {
    console.log(`\nScore: ${score}`);
    console.log(`Image: ${record.image}`);
    console.log(`File: ${record.file}`);
    console.log(`Heading: ${record.headingPath || '-'}`);
    console.log(`Caption: ${record.caption || '-'}`);
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
