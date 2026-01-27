// Brand and theme constants for Old Dog Systems / 9Count Systems umbrella site.
// Change BRAND_NAME to rebrand globally.
// 
// Brand Story:
// - Old Dog Systems: "You can't teach an old dog new tricks" — but here we are, learning coding and apps at 60.
// - 9Count Systems: Boxing analogy — down on the canvas at 9-count, everyone thinks it's over. But we get up, dust off, wash the blood away, and come back swinging.

export const BRAND_NAME = 'Old Dog Systems';
export const ALT_BRAND_NAME = '9Count Systems'; // Alternative brand name for future rebrand

export const THEME = {
  primary: '#38bdf8', // sky-400
  accent: '#a855f7', // purple-500
  background: '#020617', // slate-950
  surface: 'rgba(15,23,42,0.85)', // slate-900 with glassmorphism
  border: 'rgba(148,163,184,0.45)', // slate-400
};

// Utility to inject brand name into any element with [data-brand] attribute.
export function applyBranding() {
  const nodes = document.querySelectorAll('[data-brand]');
  nodes.forEach((node) => {
    node.textContent = BRAND_NAME;
  });
}

// Product Catalog - Expandable for future items
// Structure: { id, name, category, price, stripePriceId, description, features, status, media, etc }
export const PRODUCTS = {
  // Rough Diamond Studio - Core Product (Alpha)
  'rough-diamond-studio-alpha': {
    id: 'rough-diamond-studio-alpha',
    name: 'Rough Diamond Studio — Alpha Access',
    category: 'software',
    subcategory: 'studio',
    price: 9900, // in cents for Stripe
    displayPrice: '$99.00',
    stripePriceId: null, // Will be set from Stripe
    description: 'Alpha access to the flagship audio podcasting and content creation system. Perfect for operators who ship weekly.',
    longDescription: 'Rough Diamond Studio is a composable, enterprise-grade audio pipeline for podcasting and content creation. This alpha version includes: Audio pipeline for recording, editing, and publishing; Editorial ops dashboard for episode management; Asset generation for social and distribution; Team collaboration features; Integration ready for RSS, hosting, and monetization platforms.',
    features: [
      'Professional Audio Pipeline',
      'Editorial Operations Dashboard',
      'Automated Asset Generation',
      'Team Collaboration Tools',
      'Weekly Shipping Support',
      'Alpha Community Access'
    ],
    status: 'alpha',
    icon: 'α',
    media: {
      podcast: 'business-on-purpose'
    }
  },
  
  // Business on Purpose - Podcast Companion Products
  'bop-journal-founders': {
    id: 'bop-journal-founders',
    name: 'Business on Purpose — Founder\'s Journal',
    category: 'media',
    subcategory: 'business-on-purpose',
    price: 2900,
    displayPrice: '$29.00',
    stripePriceId: null,
    description: 'Structured journal for business operators building durable systems.',
    longDescription: 'A guided journal designed for founders and operators implementing the systems discussed on Business on Purpose. Includes weekly reflection prompts, operational checklists, and a framework for sustainable business building.',
    features: [
      '52-week guided prompts',
      'Operational checklists',
      'System-building framework',
      'Digital PDF + printable'
    ],
    status: 'active',
    media: {
      podcast: 'business-on-purpose'
    }
  },

  'bop-playbook-systems': {
    id: 'bop-playbook-systems',
    name: 'Business on Purpose — Systems Playbook',
    category: 'media',
    subcategory: 'business-on-purpose',
    price: 3900,
    displayPrice: '$39.00',
    stripePriceId: null,
    description: 'Templates and frameworks for building operational systems.',
    longDescription: 'Ready-to-use templates and implementation guides for the core business systems discussed in the podcast. Includes org charts, financial tracking, hiring frameworks, and process documentation.',
    features: [
      '15+ customizable templates',
      'Implementation guides',
      'Process frameworks',
      'Google Sheets versions'
    ],
    status: 'active',
    media: {
      podcast: 'business-on-purpose'
    }
  },

  'bop-course-module': {
    id: 'bop-course-module',
    name: 'Business on Purpose — Building Systems Course',
    category: 'media',
    subcategory: 'business-on-purpose',
    price: 14900,
    displayPrice: '$149.00',
    stripePriceId: null,
    description: 'Comprehensive 6-week course on building sustainable business systems.',
    longDescription: 'A structured, 6-week course covering the frameworks shared on Business on Purpose. Includes video lessons, downloadable resources, community forum access, and 30-minute implementation consulting call.',
    features: [
      '6 video modules',
      'Weekly assignments',
      'Community forum',
      'Consulting call included',
      'Lifetime access',
      'Certificate of completion'
    ],
    status: 'coming-soon',
    media: {
      podcast: 'business-on-purpose'
    }
  },

  // When Life Bites - Podcast Companion Products
  'wlb-resilience-journal': {
    id: 'wlb-resilience-journal',
    name: 'When Life Bites — Resilience Journal',
    category: 'media',
    subcategory: 'when-life-bites',
    price: 2900,
    displayPrice: '$29.00',
    stripePriceId: null,
    description: 'Guided journal for navigating grief, pressure, and high-stakes seasons.',
    longDescription: 'A companion journal to the When Life Bites podcast. Designed for founders and humans going through difficult seasons. Includes reflection prompts, coping strategies, and a framework for resilience building.',
    features: [
      '50+ reflection prompts',
      'Coping strategy toolkit',
      'Resilience frameworks',
      'Digital + printable PDF'
    ],
    status: 'active',
    media: {
      podcast: 'when-life-bites'
    }
  },

  'wlb-companion-guide': {
    id: 'wlb-companion-guide',
    name: 'When Life Bites — Companion Guide',
    category: 'media',
    subcategory: 'when-life-bites',
    price: 1900,
    displayPrice: '$19.00',
    stripePriceId: null,
    description: 'Episode reference guide with resources and deep dives.',
    longDescription: 'A comprehensive guide to episodes of When Life Bites, with linked resources, book recommendations, further reading, and expert contact information mentioned in the podcast.',
    features: [
      'All episodes indexed',
      'Resource links',
      'Book recommendations',
      'Expert directory',
      'Updated quarterly'
    ],
    status: 'active',
    media: {
      podcast: 'when-life-bites'
    }
  },

  'wlb-retreat-companion': {
    id: 'wlb-retreat-companion',
    name: 'When Life Bites — Retreat Program',
    category: 'media',
    subcategory: 'when-life-bites',
    price: 79900,
    displayPrice: '$799.00',
    stripePriceId: null,
    description: 'Exclusive retreat experience for community members.',
    longDescription: 'A 3-day in-person retreat (RSA-based, expandable to other regions) for listeners going through challenging seasons. Includes expert facilitation, peer cohorts, workshops, and community building. Limited to 20 participants.',
    features: [
      '3-day retreat experience',
      'Expert facilitation',
      'Peer cohort groups',
      'Meals and accommodation',
      'Follow-up community access',
      'Certification of completion'
    ],
    status: 'coming-soon',
    media: {
      podcast: 'when-life-bites'
    }
  },

  // Future products (coming soon)
  'future-modular-system-1': {
    id: 'future-modular-system-1',
    name: 'Future Modular System (Coming Soon)',
    category: 'software',
    subcategory: 'studio',
    price: null,
    displayPrice: 'Coming Soon',
    stripePriceId: null,
    description: 'Additional modular business systems in development.',
    longDescription: 'We\'re building modular systems for other sectors. Watch this space.',
    features: ['Placeholder for future products'],
    status: 'coming-soon',
    media: {}
  }
};

// Helper functions for product management
export function getProductsByCategory(category) {
  return Object.values(PRODUCTS).filter(p => p.category === category);
}

export function getProductsByPodcast(podcastId) {
  return Object.values(PRODUCTS).filter(p => p.media?.podcast === podcastId);
}

export function getProductById(id) {
  return PRODUCTS[id];
}

export function getActiveProducts() {
  return Object.values(PRODUCTS).filter(p => p.status === 'active');
}

export function getProductsByStatus(status) {
  return Object.values(PRODUCTS).filter(p => p.status === status);
}

// Optionally expose on window for inline script usage without bundling.
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-undef
  window.ODS_CONSTANTS = { 
    BRAND_NAME, 
    THEME, 
    applyBranding, 
    PRODUCTS,
    getProductsByCategory,
    getProductsByPodcast,
    getProductById,
    getActiveProducts,
    getProductsByStatus
  };
}

