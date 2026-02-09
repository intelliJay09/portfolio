#!/usr/bin/env node

/**
 * Batch Script: Apply Strategic Template to All Portfolio Projects
 *
 * This script:
 * 1. Adds shortResultDescription for 13 remaining projects
 * 2. Updates techStack badges to strategic components for 14 projects
 */

const fs = require('fs');
const path = require('path');

// Strategic shortResultDescriptions for remaining projects
const shortDescriptions = {
  'optimum-property-ghana': 'Real estate authority positioning + lead qualification systems achieved Top 5 rankings, generated 4x investment inquiries with 45% lead quality rate, and delivered 165% property acquisition growth.',

  'rosemond-prempeh': 'Faith-based authority + community engagement systems achieved Top 8 ministry rankings, grew engagement by 2.8x with 5.2k active members, and delivered 160% outreach growth.',

  'royal-itech': 'Cybersecurity authority positioning + enterprise lead systems achieved Top 5 security rankings, generated 4.2x enterprise leads with 48% consultation conversion, and delivered 250% client acquisition growth.',

  'girl-code-africa': 'Tech education authority + partnership acquisition systems achieved Top 3 rankings, generated 3.2x program applications with 12k+ community growth, and delivered 190% partnership expansion.',

  'ghana-optometry-conference': 'Professional conference authority + registration optimization systems achieved #1 event rankings, generated 2.4x registrations with 800+ professional attendees, and delivered 170% event attendance growth.',

  'eden-heights': 'Luxury property authority + high-value lead systems achieved Top 5 residential rankings, generated 2.8x buyer inquiries with 42% conversion, and delivered 140% premium sales growth.',

  'landmark-homes': 'Real estate developer authority + investor confidence systems achieved Top 8 development rankings, generated 3.1x investor inquiries with 3.5k views, and delivered 165% property acquisition growth.',

  'ghana-optometric-association': 'Professional association authority + member operations systems achieved #1 optometry rankings, generated 3.5x member engagement with 1.2k+ active members, and delivered 210% industry influence growth.',

  'twist-nightclub': 'Nightlife entertainment authority + attendance systems achieved Top 3 venue rankings, generated 2.6x event attendance with 6.8k social community, and delivered 185% patron growth.',

  'command-space': 'Digital agency authority + client acquisition systems achieved Top 5 agency rankings, generated 3.4x client inquiries with 55% consultation conversion, and delivered 175% client acquisition growth.',

  'qualivex-solutions': 'B2B solutions authority + lead generation systems achieved Top 10 business rankings, generated 2.9x qualified leads with 41% conversion, and delivered 155% client growth.',

  'anabs': 'Luxury high-rise authority + investor conversion systems secured #1 premium residential rankings, generated 6.5x investment inquiries with 58% conversion, and delivered 280% premium sales growth.',

  'kline-designs': 'Architectural design authority + project inquiry systems achieved Top 5 design rankings, generated 3.8x project inquiries with 4.2k portfolio views, and delivered 195% client acquisition growth.'
};

// Strategic techStack badges for all 14 projects
const strategicTechStacks = {
  'optimum-property-ghana': ['Real Estate Authority', 'Lead Qualification', 'Property Intelligence', 'Investment Systems', 'Market Positioning'],

  'imagebloom-by-saida': ['Beauty Authority', 'Service Booking', 'E-commerce Systems', 'Visual Storytelling', 'Dual Revenue Streams'],

  'rosemond-prempeh': ['Ministry Authority', 'Community Engagement', 'Content Distribution', 'Faith Architecture', 'Donation Systems'],

  'royal-itech': ['Cybersecurity Authority', 'Enterprise Lead Gen', 'Trust Architecture', 'B2B Positioning', 'Security Credibility'],

  'girl-code-africa': ['Education Authority', 'Application Systems', 'Partnership Acquisition', 'Community Building', 'Impact Positioning'],

  'ghana-optometry-conference': ['Conference Authority', 'Registration Optimization', 'Event Management', 'Professional Networking', 'Logistics Systems'],

  'eden-heights': ['Luxury Authority', 'High-Value Lead Systems', 'Visual Immersion', 'Premium Positioning', 'Buyer Conversion'],

  'landmark-homes': ['Developer Authority', 'Investor Confidence', 'Project Showcase', 'Corporate Positioning', 'Acquisition Systems'],

  'ghana-optometric-association': ['Association Authority', 'Member Operations', 'Professional Networking', 'Industry Positioning', 'Centralized Systems'],

  'twist-nightclub': ['Nightlife Authority', 'Event Promotion', 'Social Engagement', 'Community Building', 'Attendance Systems'],

  'command-space': ['Agency Authority', 'Client Acquisition', 'Consultation Systems', 'B2B Positioning', 'Partnership Development'],

  'qualivex-solutions': ['B2B Authority', 'Lead Generation', 'Business Solutions', 'Client Conversion', 'Service Positioning'],

  'anabs': ['Luxury High-Rise Authority', 'Investor Conversion', 'Premium Positioning', 'High-Value Systems', 'Exclusivity Marketing'],

  'kline-designs': ['Design Authority', 'Project Inquiry Systems', 'Portfolio Showcase', 'Innovation Positioning', 'Architectural Excellence']
};

console.log('🚀 Starting batch strategic template application...\n');

// ============================================
// PART 1: Update page.tsx with shortResultDescriptions
// ============================================

const pagePath = path.join(__dirname, '../app/portfolio/[slug]/page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

let updatedProjects = 0;

Object.entries(shortDescriptions).forEach(([projectId, description]) => {
  const searchPattern = new RegExp(
    `('${projectId}':\\s*\\{[^}]*focusAreas:[^\\]]*\\])`,
    's'
  );

  const replacePattern = new RegExp(
    `(resultDescription: '[^']*',)(\\s*focusAreas:)`,
    's'
  );

  // Find the project block
  const projectMatch = pageContent.match(new RegExp(
    `'${projectId}':\\s*\\{[\\s\\S]*?focusAreas:[^\\]]*\\]\\s*\\}`,
    ''
  ));

  if (projectMatch && !projectMatch[0].includes('shortResultDescription:')) {
    const oldBlock = projectMatch[0];
    const newBlock = oldBlock.replace(
      replacePattern,
      `$1\n      shortResultDescription: '${description}',\n      focusAreas:`
    );

    pageContent = pageContent.replace(oldBlock, newBlock);
    updatedProjects++;
    console.log(`✓ Added shortResultDescription for ${projectId}`);
  }
});

fs.writeFileSync(pagePath, pageContent);
console.log(`\n✅ Updated ${updatedProjects} projects in page.tsx\n`);

// ============================================
// PART 2: Update portfolio.json with strategic techStack
// ============================================

const portfolioPath = path.join(__dirname, '../portfolio.json');
const portfolioData = JSON.parse(fs.readFileSync(portfolioPath, 'utf8'));

let updatedTechStacks = 0;

portfolioData.portfolio.forEach(project => {
  if (strategicTechStacks[project.id]) {
    project.techStack = strategicTechStacks[project.id];
    updatedTechStacks++;
    console.log(`✓ Updated techStack for ${project.id}`);
  }
});

fs.writeFileSync(portfolioPath, JSON.stringify(portfolioData, null, 2));
console.log(`\n✅ Updated ${updatedTechStacks} techStacks in portfolio.json\n`);

console.log('🎉 Strategic template application complete!');
console.log('\nSummary:');
console.log(`  - shortResultDescriptions added: ${updatedProjects}`);
console.log(`  - Strategic techStacks updated: ${updatedTechStacks}`);
console.log('\n✨ All portfolio projects now use strategic positioning template!');
