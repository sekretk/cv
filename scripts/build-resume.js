#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Mustache = require('mustache');

/**
 * Builds resume JSON by applying mustache templating with i18n data
 * and embeds the full i18n dictionary into meta.i18n for theme access
 * 
 * Usage: node build-resume.js <lang>
 * Example: node build-resume.js eng
 *          node build-resume.js rus
 * 
 * Or build all languages:
 *          node build-resume.js all
 */

const projectRoot = path.join(__dirname, '..');
const i18nDir = path.join(projectRoot, 'i18n');
const outDir = path.join(projectRoot, 'out');
const cvJsonPath = path.join(projectRoot, 'cv.json');
const defaultLang = 'eng';

/**
 * Load i18n data with fallback to English for missing keys
 */
function loadI18nWithFallback(lang) {
  const i18nPath = path.join(i18nDir, `${lang}.json`);
  const defaultI18nPath = path.join(i18nDir, `${defaultLang}.json`);

  // Always load English as the base/fallback
  if (!fs.existsSync(defaultI18nPath)) {
    throw new Error(`Default i18n file (${defaultLang}) not found: ${defaultI18nPath}`);
  }
  const defaultI18n = JSON.parse(fs.readFileSync(defaultI18nPath, 'utf8'));

  // If requesting English, just return it
  if (lang === defaultLang) {
    return defaultI18n;
  }

  // Validate target i18n file exists
  if (!fs.existsSync(i18nPath)) {
    throw new Error(`i18n file not found: ${i18nPath}`);
  }

  // Load target language and merge with English fallback
  const langI18n = JSON.parse(fs.readFileSync(i18nPath, 'utf8'));
  
  // Merge: English as base, target language overrides
  const merged = { ...defaultI18n, ...langI18n };
  
  // Log any keys that fell back to English
  const fallbackKeys = Object.keys(defaultI18n).filter(key => !(key in langI18n));
  if (fallbackKeys.length > 0) {
    console.log(`   ⚠️  Using English fallback for: ${fallbackKeys.join(', ')}`);
  }

  return merged;
}

/**
 * Build resume for a specific language
 */
function buildResume(lang) {
  const outPath = path.join(outDir, `${lang}.json`);

  // Validate cv.json exists
  if (!fs.existsSync(cvJsonPath)) {
    throw new Error(`cv.json not found: ${cvJsonPath}`);
  }

  console.log(`📝 Building resume for: ${lang}`);

  // Read files - i18n with English fallback for missing keys
  const i18nData = loadI18nWithFallback(lang);
  const cvTemplate = fs.readFileSync(cvJsonPath, 'utf8');

  // Apply mustache templating
  const renderedJson = Mustache.render(cvTemplate, i18nData);
  const resumeData = JSON.parse(renderedJson);

  // Ensure meta section exists
  if (!resumeData.meta) {
    resumeData.meta = {};
  }

  // Add i18n data to meta section
  resumeData.meta.i18n = i18nData;

  // Ensure output directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Write output file
  const outputContent = JSON.stringify(resumeData, null, 2) + '\n';
  fs.writeFileSync(outPath, outputContent, 'utf8');

  console.log(`✅ Built: ${outPath}`);
  console.log(`   i18n keys available: ${Object.keys(i18nData).join(', ')}`);
}

/**
 * Get all available languages from i18n directory
 */
function getAvailableLanguages() {
  return fs.readdirSync(i18nDir)
    .filter(file => file.endsWith('.json'))
    .map(file => path.basename(file, '.json'));
}

/**
 * Build all languages
 */
function buildAll() {
  const languages = getAvailableLanguages();
  console.log(`🌍 Building all languages: ${languages.join(', ')}\n`);
  
  for (const lang of languages) {
    buildResume(lang);
    console.log('');
  }
  
  console.log(`✅ All ${languages.length} language(s) built successfully!`);
}

// Main execution
const lang = process.argv[2];

if (!lang) {
  console.error('❌ Error: Missing language argument');
  console.error('Usage: node build-resume.js <lang>');
  console.error('       node build-resume.js all');
  console.error('');
  console.error('Available languages:', getAvailableLanguages().join(', '));
  process.exit(1);
}

try {
  if (lang === 'all') {
    buildAll();
  } else {
    buildResume(lang);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

