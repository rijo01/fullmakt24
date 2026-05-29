#!/usr/bin/env node
/*
 * Merge bespoke SEO content into existing mall JSON files.
 * Usage: node scripts/merge-seo-content.cjs /tmp/batchN.js
 * The batch module exports { slug: { introduction, legalValidity, howToGuide, commonMistakes, faq:[{question,answer}] } }
 * Only those five content fields (+ lastUpdated) are replaced; seo/schema/internalLinks/slug are preserved.
 */
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'content', 'mallar');
const LAST_UPDATED = '2026-05-29';
// Catch FALSE marketing claims, not the mere word "BankID" (truthful warnings
// that BankID/e-legitimation is personal and may not be shared are required).
const FORBIDDEN = [
  /juridiskt granskad/i,
  /accepteras av alla/i,
  /garanterat/i,
  /helt juridiskt bindande/i,
  /(signera|signering|underteckna|logga in|inloggning|legitimera dig)\s+(med\s+)?(mobilt\s+)?bankid/i,
  /bankid[- ]?(inloggning|signering|verifiering)/i,
];

const batchPath = process.argv[2];
if (!batchPath) { console.error('Provide batch file path'); process.exit(1); }
const batch = require(batchPath);

const slugs = Object.keys(batch);
let errors = [];
for (const slug of slugs) {
  const file = path.join(DIR, slug + '.json');
  if (!fs.existsSync(file)) { errors.push(`${slug}: file missing`); continue; }
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  const c = batch[slug];
  for (const f of ['introduction', 'legalValidity', 'howToGuide', 'commonMistakes', 'faq']) {
    if (!c[f]) errors.push(`${slug}: missing field ${f}`);
  }
  if (c.faq && c.faq.length !== 5) errors.push(`${slug}: faq has ${c.faq.length} items (need 5)`);
  // forbidden-phrase scan across all new text
  const blob = [c.introduction, c.legalValidity, c.howToGuide, c.commonMistakes, ...(c.faq || []).flatMap(q => [q.question, q.answer])].join('\n');
  for (const re of FORBIDDEN) if (re.test(blob)) errors.push(`${slug}: forbidden phrase ${re}`);

  d.content = d.content || {};
  d.content.introduction = c.introduction;
  d.content.legalValidity = c.legalValidity;
  d.content.howToGuide = c.howToGuide;
  d.content.commonMistakes = c.commonMistakes;
  d.content.faq = c.faq;
  d.lastUpdated = LAST_UPDATED;
  if (!errors.some(e => e.startsWith(slug + ':'))) {
    fs.writeFileSync(file, JSON.stringify(d, null, 2) + '\n');
  }
}

if (errors.length) { console.error('VALIDATION ERRORS:\n' + errors.join('\n')); process.exit(1); }
console.log(`Merged ${slugs.length} files OK.`);

// global uniqueness check across the whole corpus
const all = fs.readdirSync(DIR).filter(f => f.endsWith('.json'));
const howMap = {}, misMap = {}, faqMap = {}, legalMap = {};
for (const f of all) {
  let j; try { j = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')); } catch { continue; }
  const c = j.content || {};
  if (c.howToGuide) (howMap[c.howToGuide] = howMap[c.howToGuide] || []).push(f);
  if (c.commonMistakes) (misMap[c.commonMistakes] = misMap[c.commonMistakes] || []).push(f);
  if (c.faq) (faqMap[JSON.stringify(c.faq)] = faqMap[JSON.stringify(c.faq)] || []).push(f);
  if (c.legalValidity) (legalMap[c.legalValidity] = legalMap[c.legalValidity] || []).push(f);
}
const dup = (m) => Object.values(m).filter(v => v.length > 1);
console.log(`Corpus dup groups -> howTo:${dup(howMap).length} mistakes:${dup(misMap).length} faq:${dup(faqMap).length} legal:${dup(legalMap).length}`);
// report dup groups that include any batch slug
const batchSet = new Set(slugs.map(s => s + '.json'));
for (const [label, m] of [['howTo', howMap], ['mistakes', misMap], ['faq', faqMap], ['legal', legalMap]]) {
  for (const g of dup(m)) if (g.some(f => batchSet.has(f))) console.log(`  ${label} DUP incl batch: ${g.join(', ')}`);
}
