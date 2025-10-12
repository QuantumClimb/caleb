#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to extract game data from the large data.json file
 * and organize it into structured JSON files
 */

// Parse the text to extract game information
function parseGameText(text) {
  const games = [];
  const giftCards = [];
  const topUps = [];
  
  // Extract game titles and prices from the text
  const gamePatterns = [
    // Pattern for games with prices
    /([A-Za-z0-9\s:''™®©\-&\+\(\)\.]+?)\s+(Steam|Xbox Live|PSN|Windows Store|Epic Games|Ubisoft|Origin|Battle\.net|Roblox|Official Website)\s+Key\s+(GLOBAL|UNITED STATES|Rest of the World|[A-Z\s]+)\s*.*?From\s*\$?(\d+\.?\d*)-?\d*%?\s*\$(\d+\.?\d*)/gi,
    // Pattern for games without "From" pricing
    /([A-Za-z0-9\s:''™®©\-&\+\(\)\.]+?)\s+(Steam|Xbox Live|PSN|Windows Store|Epic Games|Ubisoft|Origin|Battle\.net|Roblox|Official Website)\s+Key\s+(GLOBAL|UNITED STATES|Rest of the World|[A-Z\s]+)\s*.*?\$(\d+\.?\d*)/gi
  ];
  
  gamePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const title = match[1].trim();
      const platform = match[2];
      const region = match[3];
      const price = parseFloat(match[4] || match[5] || match[4]);
      
      if (title && platform && !title.includes('Gift Card') && !title.includes('Top Up')) {
        games.push({
          title,
          platform,
          region,
          price: price || 19.99
        });
      }
    }
  });
  
  // Extract gift cards
  const giftCardPattern = /([A-Za-z0-9\s]+?)\s+Gift Card\s+(\d+)\s+(USD|EUR|GBP)\s+.*?\$(\d+\.?\d*)/gi;
  let giftMatch;
  while ((giftMatch = giftCardPattern.exec(text)) !== null) {
    giftCards.push({
      title: `${giftMatch[1].trim()} Gift Card ${giftMatch[2]} ${giftMatch[3]}`,
      platform: giftMatch[1].trim(),
      value: parseInt(giftMatch[2]),
      currency: giftMatch[3],
      price: parseFloat(giftMatch[4])
    });
  }
  
  // Extract top-ups
  const topUpPattern = /Top Up\s+([A-Za-z0-9\s]+?)\s+(Coins|V-Bucks|Credits|Points)/gi;
  let topUpMatch;
  while ((topUpMatch = topUpPattern.exec(text)) !== null) {
    topUps.push({
      title: `${topUpMatch[1].trim()} ${topUpMatch[2]}`,
      game: topUpMatch[1].trim(),
      currency: topUpMatch[2],
      price: 9.99 // Default price
    });
  }
  
  return { games, giftCards, topUps };
}

// Generate realistic game data with proper images
function generateGameData(extractedGames) {
  const gameImages = {
    'Call of Duty': 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/blog/hero/mw-wz/WZ-Season-Three-Announce-TOUT.jpg',
    'Minecraft': 'https://www.minecraft.net/content/dam/games/minecraft/screenshots/Java-Edition-header.jpg',
    'Fortnite': 'https://cdn2.unrealengine.com/fortnite-chapter-4-season-4-battle-pass-1920x1080-d35912f16c8e.jpg',
    'Dead by Daylight': 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/header.jpg',
    'Roblox': 'https://images.contentstack.io/v3/assets/blt187521ff0727be24/blt0789cf2b37dc3d6d/60ee0d5bb60a6b4a1d3b3c3d/lol-logo.jpg',
    'Destiny': 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1085660/header.jpg',
    'Tony Hawk': 'https://compass-ssl.xbox.com/assets/fb/73/fb73d5bb-6778-4aa6-8e77-7c784c366e33.jpg',
    'Rainbow Six': 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/359550/header.jpg'
  };
  
  const platformLogos = {
    'Steam': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg',
    'Xbox Live': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/XBOX_logo_2012.svg',
    'PSN': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Playstation_logo_colour.svg',
    'Windows Store': 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    'Epic Games': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg',
    'Roblox': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Roblox_Logo.svg'
  };
  
  return extractedGames.map((game, index) => {
    const gameKey = Object.keys(gameImages).find(key => 
      game.title.toLowerCase().includes(key.toLowerCase())
    );
    
    return {
      id: `game-${index + 1}`,
      title: game.title,
      description: `Experience the ultimate gaming adventure with ${game.title}. Available now on ${game.platform}.`,
      price: game.price,
      originalPrice: game.price * 1.2,
      discount: Math.floor(Math.random() * 30) + 10,
      category: 'games',
      platform: game.platform,
      region: game.region || 'GLOBAL',
      digital: true,
      inStock: true,
      stockCount: Math.floor(Math.random() * 1000) + 100,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 10000) + 500,
      images: [
        gameKey ? gameImages[gameKey] : 'https://via.placeholder.com/460x215/1a1a2e/ffffff?text=Game+Image',
        'https://via.placeholder.com/460x215/16213e/ffffff?text=Screenshot+1',
        'https://via.placeholder.com/460x215/0f3460/ffffff?text=Screenshot+2'
      ],
      logo: platformLogos[game.platform] || 'https://via.placeholder.com/100x100/333/fff?text=Logo',
      tags: ['action', 'adventure', 'multiplayer'],
      seller: {
        name: 'CALEB Gaming',
        rating: 4.8,
        verified: true
      },
      systemRequirements: {
        minimum: {
          os: 'Windows 10',
          processor: 'Intel Core i3-6100',
          memory: '8 GB RAM',
          graphics: 'NVIDIA GTX 960',
          storage: '50 GB'
        }
      },
      deliveryTime: 'Instant',
      languages: ['English', 'Spanish', 'French', 'German'],
      releaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      features: ['Single Player', 'Multiplayer', 'Achievements']
    };
  });
}

async function extractAndOrganizeData() {
  try {
    console.log('🔍 Reading data.json file...');
    const dataPath = path.join(process.cwd(), 'data', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    
    console.log('📋 Parsing JSON data...');
    const jsonData = JSON.parse(rawData);
    
    // Extract text content from the parsed data
    let textContent = '';
    if (Array.isArray(jsonData)) {
      jsonData.forEach(item => {
        if (item.text) textContent += item.text + ' ';
        if (item.content) textContent += item.content + ' ';
        if (item.description) textContent += item.description + ' ';
      });
    }
    
    console.log('🎮 Extracting game data...');
    const { games, giftCards, topUps } = parseGameText(textContent);
    
    console.log(`Found ${games.length} games, ${giftCards.length} gift cards, ${topUps.length} top-ups`);
    
    // Remove duplicates and limit to reasonable numbers
    const uniqueGames = games.filter((game, index, self) => 
      index === self.findIndex(g => g.title === game.title)
    ).slice(0, 50); // Limit to 50 games
    
    const uniqueGiftCards = giftCards.filter((card, index, self) => 
      index === self.findIndex(c => c.title === card.title)
    ).slice(0, 20);
    
    const uniqueTopUps = topUps.filter((topUp, index, self) => 
      index === self.findIndex(t => t.title === topUp.title)
    ).slice(0, 15);
    
    console.log('📝 Generating structured data...');
    const structuredGames = generateGameData(uniqueGames);
    
    // Create directories if they don't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write games data
    console.log('💾 Writing games.json...');
    fs.writeFileSync(
      path.join(dataDir, 'games-extracted.json'),
      JSON.stringify(structuredGames, null, 2)
    );
    
    // Write gift cards data (basic structure)
    console.log('💾 Writing gift-cards-extracted.json...');
    const structuredGiftCards = uniqueGiftCards.map((card, index) => ({
      id: `gift-${index + 1}`,
      title: card.title,
      platform: card.platform,
      value: card.value,
      currency: card.currency,
      price: card.price,
      category: 'gift-cards',
      digital: true,
      inStock: true,
      images: ['https://via.placeholder.com/460x215/4CAF50/ffffff?text=Gift+Card'],
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg'
    }));
    
    fs.writeFileSync(
      path.join(dataDir, 'gift-cards-extracted.json'),
      JSON.stringify(structuredGiftCards, null, 2)
    );
    
    // Write top-ups data
    console.log('💾 Writing top-ups-extracted.json...');
    const structuredTopUps = uniqueTopUps.map((topUp, index) => ({
      id: `topup-${index + 1}`,
      title: topUp.title,
      game: topUp.game,
      currency: topUp.currency,
      price: topUp.price,
      category: 'top-ups',
      digital: true,
      inStock: true,
      images: ['https://via.placeholder.com/460x215/FF9800/ffffff?text=Top+Up'],
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Roblox_Logo.svg'
    }));
    
    fs.writeFileSync(
      path.join(dataDir, 'top-ups-extracted.json'),
      JSON.stringify(structuredTopUps, null, 2)
    );
    
    console.log('✅ Data extraction completed!');
    console.log(`📊 Extracted:`);
    console.log(`   - ${structuredGames.length} games`);
    console.log(`   - ${structuredGiftCards.length} gift cards`);
    console.log(`   - ${structuredTopUps.length} top-ups`);
    
  } catch (error) {
    console.error('❌ Error extracting data:', error.message);
  }
}

// Run the extraction
extractAndOrganizeData(); 