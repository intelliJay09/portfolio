#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simplified Growth-Focused Filter Mapping
const strategicFilterMapping = {
  // Premium Brand Authority - Establishing market leadership, commanding premium positioning, and building engaged communities
  // Merges: Market Authority + Luxury Positioning + Community Engagement
  'anabs': 'Premium Brand Authority',
  'eleven-eleven-ghana': 'Premium Brand Authority',
  'eden-heights': 'Premium Brand Authority',
  'kline-designs': 'Premium Brand Authority',
  'royal-itech': 'Premium Brand Authority',
  'emmanuel-kotia': 'Premium Brand Authority',
  'command-space': 'Premium Brand Authority',
  'qualivex-solutions': 'Premium Brand Authority',
  'girl-code-africa': 'Premium Brand Authority',
  'rosemond-prempeh': 'Premium Brand Authority',
  'ghana-optometric-association': 'Premium Brand Authority',
  'goa-conference': 'Premium Brand Authority',
  'twist-nightclub': 'Premium Brand Authority',

  // Premium Lead Generation - Converting high-value prospects into qualified sales opportunities
  'gwen-addo': 'Premium Lead Generation',
  'optimum-property-solutions': 'Premium Lead Generation',
  'landmark-homes': 'Premium Lead Generation',

  // Revenue-Optimized Commerce - Maximizing e-commerce conversions and customer lifetime value
  'imagebloom-by-saida': 'Revenue-Optimized Commerce'
};

console.log('🔄 Adding strategic filters to content.json...\n');

const contentPath = path.join(__dirname, '../content.json');
const contentData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

let updatedCount = 0;

contentData.portfolio.projects.forEach(project => {
  if (strategicFilterMapping[project.slug]) {
    project.strategicFilter = strategicFilterMapping[project.slug];
    console.log(`✓ ${project.slug}: "${strategicFilterMapping[project.slug]}"`);
    updatedCount++;
  }
});

fs.writeFileSync(contentPath, JSON.stringify(contentData, null, 2));

console.log(`\n✅ Updated ${updatedCount} projects with strategic filters`);
console.log('🎯 Portfolio now uses simplified growth-focused filtering!\n');

console.log('📊 Filter Distribution:');
console.log(`  • Premium Brand Authority: ${contentData.portfolio.projects.filter(p => p.strategicFilter === 'Premium Brand Authority').length} projects`);
console.log(`  • Premium Lead Generation: ${contentData.portfolio.projects.filter(p => p.strategicFilter === 'Premium Lead Generation').length} projects`);
console.log(`  • Revenue-Optimized Commerce: ${contentData.portfolio.projects.filter(p => p.strategicFilter === 'Revenue-Optimized Commerce').length} projects`);
console.log(`  • Brand Identity: ${contentData.portfolio.projects.filter(p => p.category === 'Brand Identity').length} projects`);
console.log(`  • Total: ${contentData.portfolio.projects.length} projects\n`);
