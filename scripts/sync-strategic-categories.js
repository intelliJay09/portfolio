#!/usr/bin/env node

/**
 * Sync Strategic Categories from portfolio.json to content.json
 *
 * This script adds the detailed strategic categories from portfolio.json
 * to content.json as a new 'strategicCategory' field for display purposes,
 * while keeping the broad 'category' field for filtering.
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Syncing strategic categories from portfolio.json to content.json...\n');

// Read portfolio.json to get strategic categories
const portfolioPath = path.join(__dirname, '../portfolio.json');
const portfolioData = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));

// Create mapping of slug → strategic category
const strategicCategoryMap = {};
portfolioData.portfolio.forEach(project => {
  strategicCategoryMap[project.id] = project.category;
});

// Handle slug mismatches between content.json and portfolio.json
const slugAliases = {
  'optimum-property-solutions': 'optimum-property-ghana',
  'goa-conference': 'ghana-optometry-conference'
};

// Add aliases to the map
Object.entries(slugAliases).forEach(([contentSlug, portfolioId]) => {
  if (strategicCategoryMap[portfolioId]) {
    strategicCategoryMap[contentSlug] = strategicCategoryMap[portfolioId];
  }
});

console.log(`📊 Found ${Object.keys(strategicCategoryMap).length} strategic categories in portfolio.json\n`);

// Read content.json
const contentPath = path.join(__dirname, '../content.json');
const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

let updatedCount = 0;
let notFoundCount = 0;

// Add strategicCategory to each project in content.json
contentData.portfolio.projects.forEach(project => {
  if (strategicCategoryMap[project.slug]) {
    project.strategicCategory = strategicCategoryMap[project.slug];
    console.log(`✓ ${project.slug}: "${project.category}" (filter) + "${project.strategicCategory}" (display)`);
    updatedCount++;
  } else {
    console.log(`⚠ ${project.slug}: No strategic category found in portfolio.json`);
    notFoundCount++;
  }
});

// Write updated content.json
fs.writeFileSync(contentPath, JSON.stringify(contentData, null, 2));

console.log(`\n✅ Updated ${updatedCount} projects with strategic categories`);
if (notFoundCount > 0) {
  console.log(`⚠️  ${notFoundCount} projects not found in portfolio.json`);
}
console.log('\n🎯 content.json now has both filter categories and strategic display categories!\n');
