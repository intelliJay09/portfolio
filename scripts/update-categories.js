#!/usr/bin/env node

/**
 * Update Portfolio Categories to Strategic Positioning
 */

const fs = require('fs');
const path = require('path');

// Strategic category updates
const strategicCategories = {
  'gwen-addo': 'Consulting & Personal Branding',
  'eleven-eleven-ghana': 'Luxury Hospitality & Resorts',
  'optimum-property-ghana': 'International Real Estate',
  'emmanuel-kotia': 'Academic Portfolio & Research',
  'imagebloom-by-saida': 'Beauty Services & E-commerce',
  'rosemond-prempeh': 'Faith-Based Ministry',
  'kline-designs': 'Architecture & Engineering',
  'royal-itech': 'Cybersecurity Services',
  'girl-code-africa': 'Tech Education & Empowerment',
  'ghana-optometry-conference': 'Professional Conference',
  'eden-heights': 'Luxury Residential Development',
  'landmark-homes': 'Real Estate Development',
  'ghana-optometric-association': 'Professional Association',
  'twist-nightclub': 'Nightlife & Entertainment',
  'command-space': 'Digital Agency Services',
  'qualivex-solutions': 'B2B Business Solutions',
  'anabs': 'Luxury High-Rise Development'
};

console.log('🚀 Updating portfolio categories to strategic positioning...\n');

const portfolioPath = path.join(__dirname, '../portfolio.json');
const portfolioData = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));

let updatedCount = 0;

portfolioData.portfolio.forEach(project => {
  if (strategicCategories[project.id]) {
    const oldCategory = project.category;
    project.category = strategicCategories[project.id];
    console.log(`✓ ${project.id}: "${oldCategory}" → "${project.category}"`);
    updatedCount++;
  }
});

fs.writeFileSync(portfolioPath, JSON.stringify(portfolioData, null, 2));

console.log(`\n✅ Updated ${updatedCount} categories to strategic positioning!`);
console.log('🎯 All categories now reflect specific industry positioning\n');
