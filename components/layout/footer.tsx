import React from 'react';
import Link from 'next/link';
import { Github, Twitter, MessageCircle, Mail } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    company: {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Contact', href: '/contact' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
      ],
    },
    support: {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'How to Buy', href: '/how-to-buy' },
        { name: 'Payment Methods', href: '/payment-methods' },
        { name: 'Refund Policy', href: '/refund-policy' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR', href: '/gdpr' },
      ],
    },
    community: {
      title: 'Community',
      links: [
        { name: 'Discord Server', href: 'https://discord.gg/caleb' },
        { name: 'Reddit', href: 'https://reddit.com/r/caleb' },
        { name: 'Twitter', href: 'https://twitter.com/caleb' },
        { name: 'Blog', href: '/blog' },
      ],
    },
  };

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: 'https://github.com/Onomatix/caleb' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/caleb' },
    { name: 'Discord', icon: MessageCircle, href: 'https://discord.gg/caleb' },
    { name: 'Email', icon: Mail, href: 'mailto:juncando@gmail.com' },
  ];

  return (
    <footer className="border-t bg-background">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                C
              </div>
              <span className="font-bold text-xl">CALEB</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your ultimate gaming marketplace for digital products, game keys, and gift cards.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 CALEB Gaming Marketplace. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">
              Built with ❤️ for the gaming community
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
} 