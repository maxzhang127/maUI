#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Convert HTML templates to Jest mock files
 */

const COMPONENTS_DIR = 'src/components';
const MOCK_DIR = 'src/utils/__mocks__/htmlMock';

// Ensure mock directory exists
function ensureMockDir() {
  if (!fs.existsSync(MOCK_DIR)) {
    fs.mkdirSync(MOCK_DIR, { recursive: true });
    console.log(`✅ Created directory: ${MOCK_DIR}`);
  }
}

// Convert HTML content to TypeScript mock
function htmlToMock(htmlContent, componentName) {
  // Escape special characters
  const escapedHtml = htmlContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${');

  return `// Auto-generated mock for ${componentName} template
// Generated at: ${new Date().toISOString()}

const template = \`${escapedHtml}\`;

export default template;
`;
}

// Process a single component template file
function processComponent(componentPath) {
  const componentName = path.basename(componentPath);
  const templatePath = path.join(componentPath, 'template.html');
  const mockPath = path.join(MOCK_DIR, `${componentName}.ts`);

  if (!fs.existsSync(templatePath)) {
    console.log(`⚠️  Skip ${componentName}: no template.html file`);
    return null;
  }

  try {
    // Read HTML template
    const htmlContent = fs.readFileSync(templatePath, 'utf8');

    // Generate mock content
    const mockContent = htmlToMock(htmlContent, componentName);

    // Write mock file
    fs.writeFileSync(mockPath, mockContent, 'utf8');

    console.log(`✅ Generated mock: ${componentName}.ts`);

    return {
      name: componentName,
      templatePath,
      mockPath
    };
  } catch (error) {
    console.error(`❌ Error processing ${componentName}:`, error.message);
    return null;
  }
}

// Find all component directories
function findComponentDirectories() {
  const componentDirs = [];

  if (!fs.existsSync(COMPONENTS_DIR)) {
    return componentDirs;
  }

  const entries = fs.readdirSync(COMPONENTS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== 'index') {
      componentDirs.push(path.join(COMPONENTS_DIR, entry.name));
    }
  }

  return componentDirs;
}

// Main function
function main() {
  console.log('🚀 Starting HTML mock generation...\n');

  // Ensure directory exists
  ensureMockDir();

  // Find all component directories
  const componentDirs = findComponentDirectories();

  if (componentDirs.length === 0) {
    console.log('❌ No component directories found');
    return;
  }

  console.log(`📂 Found ${componentDirs.length} component directories:\n`);

  // Process each component
  const results = [];
  componentDirs.forEach(componentDir => {
    const result = processComponent(componentDir);
    if (result) {
      results.push(result);
    }
  });

  console.log(`\n🎉 HTML mock generation completed!`);
  console.log(`📁 Mock files location: ${MOCK_DIR}`);
  console.log(`📊 Generated ${results.length} mock files`);
}


// If running this script directly
if (require.main === module) {
  main();
}

module.exports = { main, htmlToMock, processComponent, ensureMockDir };