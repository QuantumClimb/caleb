# 🎮 CALEB - Gaming Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

A modern, accessible gaming marketplace for digital products, game keys, gift cards, and in-game currency. Built with Next.js 14 and designed with gamers in mind.

## 🌟 Features

### 🎯 Core Functionality
- **🔍 Advanced Search** - Smart search with autocomplete, filters, and typo tolerance
- **🎮 Gaming-Focused** - Specialized categories for games, gift cards, and in-game currency
- **💰 Price Comparison** - Multiple seller offers with best price highlighting
- **🛒 Smart Shopping Cart** - Persistent cart with quick checkout
- **🎟️ Coupon System** - Discount codes with various promotion types
- **💳 Multiple Payment Options** - Stripe, PayPal, and digital wallet support

### 🚀 Advanced Features
- **📱 Mobile-First Design** - Responsive and touch-optimized interface
- **♿ Accessibility** - WCAG 2.1 AA compliant with keyboard navigation
- **🌙 Dark Theme** - Gaming-optimized dark interface with light mode toggle
- **🔔 Price Alerts** - Get notified when your desired games go on sale
- **❤️ Wishlist** - Save and track your favorite products
- **📊 Analytics** - Track product views, searches, and conversions

### 🛡️ Security & Performance
- **🔒 Secure Payments** - PCI-compliant payment processing
- **⚡ Optimized Performance** - Image optimization, caching, and lazy loading
- **🎯 SEO Optimized** - Server-side rendering with proper meta tags
- **📈 Real-time Data** - Live product availability and pricing

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) + [React Query](https://tanstack.com/query)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Search**: [Fuse.js](https://fusejs.io/) for fuzzy search

### Backend & Services
- **API**: Next.js API Routes
- **Database**: JSON data (transitioning to PostgreSQL)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Payments**: [Stripe](https://stripe.com/) + [PayPal](https://www.paypal.com/)
- **Image Optimization**: [Next.js Image](https://nextjs.org/docs/basic-features/image-optimization)
- **Analytics**: [Google Analytics 4](https://analytics.google.com/)

## 📦 Product Categories

Based on the comprehensive data analysis, CALEB supports:

### 🎮 Digital Games
- **PC Games**: Steam, Epic Games, Origin keys
- **Console Games**: PlayStation, Xbox, Nintendo digital codes
- **Mobile Games**: iOS and Android game currencies

### 🎁 Gift Cards
- **Gaming**: Razer Gold, Steam Wallet, PlayStation Network
- **Entertainment**: Netflix, Spotify, Disney+, YouTube Premium
- **Retail**: Amazon, Google Play, Apple iTunes
- **Services**: Uber, Uber Eats, Airbnb, Discord Nitro

### 💎 In-Game Currency
- **Popular Games**: PUBG UC, Robux, Mobile Legends Diamonds
- **Live Streaming**: Bigo Live Diamonds, Poppo Live Coins
- **New Releases**: Marvel Rivals Lattices, Age of Empires Mobile Coins

### 📊 Pricing Data
- **Price Range**: $0.22 - $471.47 USD
- **Multiple Sellers**: Compare prices from different vendors
- **Real-time Updates**: Live pricing from JSON data source
- **Deal Alerts**: Track price drops and special offers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or pnpm
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Onomatix/caleb.git
cd caleb
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="your_database_url"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# Payment Gateways
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_secret"

# Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
```

4. **Start the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
caleb/
├── app/                     # Next.js 14 App Router
│   ├── (root)/             # Main application routes
│   │   ├── page.tsx        # Homepage
│   │   ├── search/         # Search results
│   │   ├── category/       # Category pages
│   │   ├── product/        # Product details
│   │   ├── cart/           # Shopping cart
│   │   ├── checkout/       # Checkout process
│   │   └── account/        # User dashboard
│   ├── api/                # API routes
│   │   ├── products/       # Product endpoints
│   │   ├── search/         # Search endpoints
│   │   ├── payment/        # Payment processing
│   │   └── auth/           # Authentication
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                 # Base UI components
│   ├── layout/             # Layout components
│   ├── product/            # Product-related components
│   ├── search/             # Search components
│   ├── cart/               # Cart components
│   └── checkout/           # Checkout components
├── lib/                    # Utility functions
│   ├── data-processor.ts   # JSON data handling
│   ├── search.ts           # Search functionality
│   ├── payment.ts          # Payment utilities
│   └── utils.ts            # General utilities
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
├── docs/                   # Documentation
├── data.json              # Product data source
└── README.md              # This file
```

## 🔍 Search & Filtering

CALEB features a powerful search system with:

### Search Capabilities
- **Full-text search** across product names and descriptions
- **Autocomplete suggestions** with real-time results
- **Typo tolerance** using fuzzy matching algorithms
- **Voice search** (planned feature)

### Filter Options
- **Categories**: Games, Gift Cards, Currency, Subscriptions
- **Platforms**: PC/Steam, PlayStation, Xbox, Nintendo, Mobile
- **Price Range**: $0.22 - $471.47 with custom slider
- **Regions**: Global, United States, Europe, Asia-Pacific
- **Availability**: In Stock, Pre-order, Coming Soon
- **Deals**: On Sale, New Releases, Trending, Price Drops

### Advanced Features
- **Saved Searches**: Keep track of your frequent searches
- **Search Analytics**: Popular searches and trending terms
- **Personalized Results**: Based on browsing and purchase history

## 💳 Payment System

### Supported Payment Methods

#### Primary (Stripe)
- 💳 Credit/Debit Cards (Visa, Mastercard, Amex)
- 📱 Digital Wallets (Apple Pay, Google Pay)
- 🏦 Bank Transfers and ACH
- 💰 Buy Now, Pay Later (Klarna, Afterpay)

#### Secondary (PayPal)
- 🟦 PayPal Account
- 💳 PayPal Credit
- 📱 Venmo (US only)

#### Future Integrations
- ₿ Cryptocurrency (Bitcoin, Ethereum, USDC)
- 🏪 Gift Card Payments
- 💰 Store Credit System

### Coupon System
```typescript
// Example coupon codes
GAMER10     // 10% off all games
NEWUSER20   // $20 off first order $100+
FREESHIP    // Free shipping on any order
FLASH50     // 50% off featured items (limited time)
BUNDLE15    // 15% off when buying 3+ items
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Database
npm run db:generate  # Generate database schema
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data

# Utilities
npm run format       # Format code with Prettier
npm run analyze      # Analyze bundle size
npm run clean        # Clean build artifacts
```

### Code Style & Conventions

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for code quality
- **Conventional Commits**: Standardized commit messages
- **TypeScript**: Strict mode enabled for type safety

### Component Guidelines

```typescript
// Example component structure
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onWishlist
}) => {
  // Component implementation
};
```

## 📊 Analytics & Monitoring

### Implemented Analytics
- **Google Analytics 4**: Page views, user behavior, conversions
- **Product Analytics**: Most viewed, best selling, price tracking
- **Search Analytics**: Popular queries, zero-result searches
- **User Journey**: Funnel analysis from browse to purchase
- **Performance Monitoring**: Core Web Vitals, loading times

### Key Metrics Tracked
- 👥 **User Engagement**: Session duration, page views, bounce rate
- 🛒 **E-commerce**: Conversion rate, cart abandonment, average order value
- 🔍 **Search Performance**: Search success rate, popular terms
- 💰 **Revenue**: Sales by category, top-performing products
- 📱 **Technical**: Page load speed, error rates, uptime

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for user workflows
- **Visual Regression**: Chromatic for UI consistency
- **Accessibility**: axe-core for WCAG compliance

### Test Coverage Goals
- Minimum 80% code coverage
- 100% coverage for payment flows
- Critical user paths fully tested
- Accessibility standards verified

## 🚀 Deployment

### Production Deployment

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

#### Docker Deployment
```bash
# Build Docker image
docker build -t caleb-marketplace .

# Run container
docker run -p 3000:3000 caleb-marketplace
```

#### Environment Setup
- **Database**: PostgreSQL on Railway/Supabase
- **CDN**: Vercel Edge Network or Cloudflare
- **Monitoring**: Vercel Analytics + Sentry
- **Email**: SendGrid or AWS SES

### Performance Optimizations
- **Image Optimization**: Next.js Image with WebP
- **Code Splitting**: Dynamic imports for heavy components
- **Caching**: React Query + Redis for API responses
- **CDN**: Static asset delivery optimization
- **Bundle Analysis**: Regular bundle size monitoring

## 🔒 Security

### Security Measures Implemented
- **Input Validation**: Zod schemas for all user inputs
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Built-in Next.js CSRF tokens
- **Rate Limiting**: API endpoint protection
- **Secure Headers**: Helmet.js security headers
- **Payment Security**: PCI DSS compliant processing

### Security Best Practices
- Environment variables for sensitive data
- Regular dependency updates and vulnerability scans
- HTTPS enforcement in production
- Secure authentication with NextAuth.js
- Input sanitization and output encoding

## 📈 Roadmap

### Phase 1: MVP (Current)
- [x] Basic product listing and search
- [x] Shopping cart and checkout
- [x] Payment integration (Stripe)
- [x] User authentication
- [x] Responsive design

### Phase 2: Enhanced Features
- [ ] Advanced filtering and sorting
- [ ] Wishlist and favorites
- [ ] User reviews and ratings
- [ ] Price alerts and notifications
- [ ] Coupon system implementation

### Phase 3: Advanced Platform
- [ ] Seller dashboard and management
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] API for third-party integrations
- [ ] Multi-language support

### Phase 4: Scale & Optimize
- [ ] Microservices architecture
- [ ] Advanced caching strategies
- [ ] AI-powered recommendations
- [ ] Blockchain integration for digital ownership
- [ ] Global marketplace expansion

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting PRs.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention
```
feat: add new product filtering system
fix: resolve payment gateway timeout issue
docs: update API documentation
style: format code with prettier
refactor: optimize search performance
test: add unit tests for cart functionality
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Eneba Data**: Original marketplace data structure and inspiration
- **Next.js Team**: Amazing framework and documentation
- **Vercel**: Hosting and deployment platform
- **Open Source Community**: All the fantastic libraries and tools

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/Onomatix/caleb/issues)
- **Email**: juncando@gmail.com
- **Documentation**: [Visit our docs](./docs/README.md)
- **Discussions**: [Community discussions](https://github.com/Onomatix/caleb/discussions)

---

**Built with ❤️ for the gaming community**

*CALEB - Where gamers find their next adventure* 