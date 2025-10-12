# 🖼️ Image Management Guide

This guide explains how to effectively manage image domains in the CALEB gaming marketplace.

## 🎯 Overview

Next.js requires all external image domains to be explicitly configured for security reasons. This prevents malicious image injection and ensures optimal performance through Next.js Image optimization.

## 🔧 Current Configuration

Our `next.config.ts` includes these pre-configured domains:

### Gaming & Entertainment
- `images.igdb.com` - Internet Game Database (primary game images)
- `cdn2.unrealengine.com` / `cdn1.unrealengine.com` - Epic Games images
- `cdn.cloudflare.steamstatic.com` - Steam CDN
- `steamcdn-a.akamaihd.net` - Steam assets
- `store.steampowered.com` - Steam store images
- `shared.akamai.steamstatic.com` - Steam shared assets

### Platform Images
- `image.api.playstation.com` - PlayStation official images
- `compass-ssl.xbox.com` - Xbox images
- `assets.nintendo.com` - Nintendo assets

### General Sources
- `upload.wikimedia.org` - Wikipedia/Commons images (logos)
- `via.placeholder.com` / `placehold.co` - Placeholder images
- `cdn.discordapp.com` / `media.discordapp.net` - Discord CDN

## 🛠️ Adding New Domains

### Manual Method
1. Open `next.config.ts`
2. Add new domain to the `remotePatterns` array:

```typescript
{
  protocol: 'https',
  hostname: 'new-domain.com',
  port: '',
  pathname: '/**',
}
```

3. Restart the development server

### Automated Detection
We've created a script to automatically detect unconfigured domains:

```bash
# Run the image domain checker
npm run check-images

# Or directly
node scripts/check-image-domains.js
```

This script will:
- ✅ Scan all JSON files for image URLs
- ✅ Check which domains are configured
- ❌ List unconfigured domains with examples
- 🔧 Provide copy-paste configuration snippets

## 📋 Workflow for New Images

### When Adding Product Data
1. **Add your image URLs** to the product data
2. **Run the checker**: `npm run check-images`
3. **Update config** if needed: Add any unconfigured domains
4. **Restart server** to apply changes
5. **Test** that images load correctly

### Example Output
```
🔍 Checking image domains...

📋 Found 12 image URLs
⚙️  Found 15 configured domains

✅ Configured domains:
   images.igdb.com (8 images)
   cdn2.unrealengine.com (2 images)

❌ Unconfigured domains:
   new-gaming-site.com (2 images)
     https://new-gaming-site.com/game1.jpg
     https://new-gaming-site.com/game2.jpg

🔧 To fix, add these to your next.config.ts:
{
  protocol: 'https',
  hostname: 'new-gaming-site.com',
  port: '',
  pathname: '/**',
}
```

## 🎨 Image Best Practices

### Performance
- **Use WebP format** when possible for better compression
- **Optimize image sizes** - don't use 4K images for thumbnails
- **Lazy load** - Next.js Image component handles this automatically
- **Responsive images** - provide multiple sizes when possible

### Security
- **Only add trusted domains** - don't blindly allow any domain
- **Use HTTPS only** - all our patterns require HTTPS protocol
- **Validate image URLs** before adding to product data

### Fallbacks
```typescript
// Example with fallback handling
<Image
  src={product.image}
  alt={product.name}
  width={300}
  height={400}
  onError={(e) => {
    e.currentTarget.src = '/fallback-game-image.jpg';
  }}
/>
```

## 🚨 Common Issues

### 1. "hostname not configured" Error
**Problem**: New image domain not in config
**Solution**: Run `npm run check-images` and add missing domains

### 2. Images Not Loading
**Checklist**:
- ✅ Domain configured in `next.config.ts`?
- ✅ Development server restarted after config change?
- ✅ Image URL is valid and accessible?
- ✅ Using HTTPS (not HTTP)?

### 3. Slow Image Loading
**Solutions**:
- Use Next.js Image component (not regular `<img>`)
- Optimize image sizes at source
- Consider using a CDN for your own images

## 📁 File Locations

```
project/
├── next.config.ts          # Main image domain configuration
├── scripts/
│   └── check-image-domains.js  # Domain checker script
├── data/
│   └── products.json       # Product data with image URLs
└── docs/
    └── IMAGE_MANAGEMENT.md # This file
```

## 🔄 Regular Maintenance

### Weekly
- [ ] Run `npm run check-images` when adding new products
- [ ] Check for broken image links in production

### Monthly
- [ ] Review image loading performance
- [ ] Clean up unused domains from config
- [ ] Update image optimization settings if needed

### Before Deployment
- [ ] Ensure all images load correctly
- [ ] Run full image domain check
- [ ] Test image loading on production build

## 🎯 Future Improvements

### Planned Features
- [ ] Automatic fallback image system
- [ ] Image URL validation in product data
- [ ] Performance monitoring for image loading
- [ ] CDN integration for self-hosted images

### Automation Ideas
- [ ] Pre-commit hook to check image domains
- [ ] CI/CD integration for image validation
- [ ] Automatic domain detection and PR creation

---

## 🆘 Need Help?

If you encounter image-related issues:

1. **Check the console** for specific error messages
2. **Run the domain checker**: `npm run check-images`
3. **Verify the image URL** works in a browser
4. **Check Next.js docs**: [Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)

Remember: When in doubt, use the automated checker script! 🎮 