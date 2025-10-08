#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Updates version and touch date in all resume JSON files
 * Usage: node update-version.js [version] [date]
 * - version: defaults to version from package.json
 * - date: defaults to current date in YYYY-MM-DD format
 */

// Get version from package.json or command line
const packageJson = require('../package.json');
const version = process.argv[2] || packageJson.version;

// Get date from command line or use current date
const date = process.argv[3] || new Date().toISOString().split('T')[0];

// Resume directory
const resumeDir = path.join(__dirname, '../resume');

console.log(`Updating resume files with version: ${version}, date: ${date}`);

// Read all JSON files in resume directory
fs.readdir(resumeDir, (err, files) => {
  if (err) {
    console.error('Error reading resume directory:', err);
    process.exit(1);
  }

  // Filter for JSON files only
  const jsonFiles = files.filter(file => file.endsWith('.json'));

  if (jsonFiles.length === 0) {
    console.warn('No JSON files found in resume directory');
    process.exit(0);
  }

  console.log(`Found ${jsonFiles.length} resume file(s): ${jsonFiles.join(', ')}`);

  let updateCount = 0;
  let errorCount = 0;

  // Process each JSON file
  jsonFiles.forEach(file => {
    const filePath = path.join(resumeDir, file);
    
    try {
      // Read the JSON file
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      // Update meta section
      if (!data.meta) {
        data.meta = {};
      }

      data.meta.version = version;
      data.meta.touch = date;

      // Write back to file with pretty formatting
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      
      console.log(`✓ Updated ${file}`);
      updateCount++;
    } catch (error) {
      console.error(`✗ Error updating ${file}:`, error.message);
      errorCount++;
    }
  });

  console.log(`\nCompleted: ${updateCount} updated, ${errorCount} errors`);
  
  if (errorCount > 0) {
    process.exit(1);
  }
});

