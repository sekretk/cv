#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Updates version and touch date in cv.json
 * 
 * Usage: node update-version.js <version> <date>
 * Example: node update-version.js 1.0.0 2025-11-28
 */

// Get arguments
const version = process.argv[2];
const date = process.argv[3];

if (!version || !date) {
  console.error('❌ Error: Missing required arguments');
  console.error('Usage: node update-version.js <version> <date>');
  console.error('Example: node update-version.js 1.0.0 2025-11-28');
  process.exit(1);
}

// Validate version format (semantic versioning)
const versionRegex = /^\d+\.\d+\.\d+$/;
if (!versionRegex.test(version)) {
  console.error(`❌ Error: Invalid version format: ${version}`);
  console.error('Expected format: X.Y.Z (e.g., 1.0.0)');
  process.exit(1);
}

// Validate date format (YYYY-MM-DD)
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (!dateRegex.test(date)) {
  console.error(`❌ Error: Invalid date format: ${date}`);
  console.error('Expected format: YYYY-MM-DD (e.g., 2025-11-28)');
  process.exit(1);
}

// Path to cv.json
const cvJsonPath = path.join(__dirname, '..', 'cv.json');

try {
  console.log('📝 Updating cv.json...');
  console.log(`   Version: ${version}`);
  console.log(`   Date: ${date}`);
  
  // Read cv.json
  if (!fs.existsSync(cvJsonPath)) {
    throw new Error(`cv.json not found at: ${cvJsonPath}`);
  }
  
  const cvJsonContent = fs.readFileSync(cvJsonPath, 'utf8');
  const cvData = JSON.parse(cvJsonContent);
  
  // Ensure meta section exists
  if (!cvData.meta) {
    cvData.meta = {};
  }
  
  // Update version and date
  cvData.meta.version = version;
  cvData.meta.touch = date;
  
  // Write back to file with pretty formatting
  const updatedContent = JSON.stringify(cvData, null, 2) + '\n';
  fs.writeFileSync(cvJsonPath, updatedContent, 'utf8');
  
  console.log('✅ Successfully updated cv.json');
  console.log(`   meta.version: ${cvData.meta.version}`);
  console.log(`   meta.touch: ${cvData.meta.touch}`);
  
} catch (error) {
  console.error('❌ Error updating cv.json:', error.message);
  process.exit(1);
}

