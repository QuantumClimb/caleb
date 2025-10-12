#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to check for unconfigured image domains in our product data
 * Run with: node scripts/check-image-domains.js
 */

// Read Next.js config to get configured domains
function getConfiguredDomains() {
  try {
    const configPath = path.join(process.cwd(), 'next.config.ts');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Extract hostnames from the config (simple regex approach)
    const hostnameMatches = configContent.match(/hostname:\s*['"`]([^'"`]+)['"`]/g);
    if (!hostnameMatches) return [];
    
    return hostnameMatches.map(match => {
      const hostname = match.match(/hostname:\s*['"`]([^'"`]+)['"`]/)[1];
      return hostname;
    });
  } catch (error) {
    console.error('Error reading Next.js config:', error.message);
    return [];
  }
}

// Extract all image URLs from JSON files
function extractImageUrls() {
  const urls = new Set();
  
  try {
    // Check data directory for JSON files
    const dataDir = path.join(process.cwd(), 'data');
    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);
      
      files.forEach(file => {
        if (file.endsWith('.json')) {
          const filePath = path.join(dataDir, file);
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Find all HTTPS URLs that look like images
          const imageUrlRegex = /https:\/\/[^\s"',]+\.(?:jpg|jpeg|png|gif|svg|webp)/gi;
          const matches = content.match(imageUrlRegex);
          
          if (matches) {
            matches.forEach(url => urls.add(url));
          }
        }
      });
    }
    
    // Also check any other common locations
    const otherPaths = [
      'src/data',
      'public/data',
      'lib/data'
    ];
    
    otherPaths.forEach(dirPath => {
      const fullPath = path.join(process.cwd(), dirPath);
      if (fs.existsSync(fullPath)) {
        try {
          const files = fs.readdirSync(fullPath);
          files.forEach(file => {
            if (file.endsWith('.json')) {
              const filePath = path.join(fullPath, file);
              const content = fs.readFileSync(filePath, 'utf8');
              const imageUrlRegex = /https:\/\/[^\s"',]+\.(?:jpg|jpeg|png|gif|svg|webp)/gi;
              const matches = content.match(imageUrlRegex);
              if (matches) {
                matches.forEach(url => urls.add(url));
              }
            }
          });
        } catch (err) {
          // Directory exists but can't read it, skip
        }
      }
    });
    
  } catch (error) {
    console.error('Error extracting image URLs:', error.message);
  }
  
  return Array.from(urls);
}

// Extract hostname from URL
function getHostname(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

// Main function
function checkImageDomains() {
  console.log('🔍 Checking image domains...\n');
  
  const configuredDomains = getConfiguredDomains();
  const imageUrls = extractImageUrls();
  
  console.log(`📋 Found ${imageUrls.length} image URLs`);
  console.log(`⚙️  Found ${configuredDomains.length} configured domains\n`);
  
  if (imageUrls.length === 0) {
    console.log('ℹ️  No image URLs found in data files');
    return;
  }
  
  // Group URLs by domain
  const domainGroups = {};
  imageUrls.forEach(url => {
    const hostname = getHostname(url);
    if (hostname) {
      if (!domainGroups[hostname]) {
        domainGroups[hostname] = [];
      }
      domainGroups[hostname].push(url);
    }
  });
  
  const unconfiguredDomains = [];
  const configuredCount = {};
  
  // Check each domain
  Object.keys(domainGroups).forEach(domain => {
    const isConfigured = configuredDomains.includes(domain);
    
    if (isConfigured) {
      configuredCount[domain] = domainGroups[domain].length;
    } else {
      unconfiguredDomains.push({
        domain,
        urls: domainGroups[domain]
      });
    }
  });
  
  // Report results
  console.log('✅ Configured domains:');
  if (Object.keys(configuredCount).length === 0) {
    console.log('   None of the image domains are configured!');
  } else {
    Object.entries(configuredCount).forEach(([domain, count]) => {
      console.log(`   ${domain} (${count} images)`);
    });
  }
  
  if (unconfiguredDomains.length > 0) {
    console.log('\n❌ Unconfigured domains:');
    unconfiguredDomains.forEach(({ domain, urls }) => {
      console.log(`   ${domain} (${urls.length} images)`);
      if (urls.length <= 3) {
        urls.forEach(url => console.log(`     ${url}`));
      } else {
        urls.slice(0, 2).forEach(url => console.log(`     ${url}`));
        console.log(`     ... and ${urls.length - 2} more`);
      }
    });
    
    console.log('\n🔧 To fix, add these to your next.config.ts:');
    unconfiguredDomains.forEach(({ domain }) => {
      console.log(`{
  protocol: 'https',
  hostname: '${domain}',
  port: '',
  pathname: '/**',
},`);
    });
  } else {
    console.log('\n🎉 All image domains are properly configured!');
  }
  
  console.log('\n💡 Pro tip: Run this script whenever you add new product data');
}

// Run the check
checkImageDomains(); 