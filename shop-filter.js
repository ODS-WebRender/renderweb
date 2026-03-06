// Shop filtering and podcast selection functionality for Old Dog Systems Media House

(function () {
  'use strict';

  // Filter states
  const FILTERS = {
    ALL: 'all',
    BUSINESS_ON_PURPOSE: 'business-on-purpose',
    WHEN_LIFE_BITES: 'when-life-bites',
  };

  let currentFilter = FILTERS.ALL;

  // Product details for quick view
  const PRODUCT_DETAILS = {
    'back-office-management': {
      title: 'Back Office Management Systems',
      description: 'Practical tools and frameworks for managing back office operations — built from real experience. This comprehensive package includes templates for financial tracking, HR processes, and operational workflows that scale with your business.',
      features: ['Financial Templates', 'HR Process Guides', 'Operational Workflows', 'Implementation Checklist'],
      price: '$49',
      format: 'Digital Templates & Guides'
    },
    'policies-procedures': {
      title: 'Policies & Procedures Library',
      description: 'Ready-to-adapt policy templates and procedure frameworks that help you build systems that scale. Professional-grade documentation that ensures consistency and compliance across your organization.',
      features: ['Policy Templates', 'Procedure Frameworks', 'Compliance Checklists', 'Customization Guides'],
      price: '$39',
      format: 'Digital Templates'
    }
  };

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    initShopFilter();
    initPodcastSelection();
    initQuickView();
    initEmptyState();
  });

  /**
   * Initialize shop filtering functionality
   */
  function initShopFilter() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const productCards = document.querySelectorAll('[data-product]');

    if (!filterButtons.length || !productCards.length) return;

    // Add click handlers to filter buttons
    filterButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');
        setFilter(filter);
      });
    });

    // Set initial filter state
    setFilter(FILTERS.ALL);
  }

  /**
   * Set the active filter and update UI
   */
  function setFilter(filter) {
    currentFilter = filter;
    const filterButtons = document.querySelectorAll('[data-filter]');
    const productCards = document.querySelectorAll('[data-product]');

    // Update button states
    filterButtons.forEach((button) => {
      const buttonFilter = button.getAttribute('data-filter');
      if (buttonFilter === filter) {
        button.classList.add(
          'bg-sky-500/10',
          'text-sky-300',
          'ring-1',
          'ring-sky-500/50'
        );
        button.classList.remove('text-slate-300');
      } else {
        button.classList.remove(
          'bg-sky-500/10',
          'text-sky-300',
          'ring-1',
          'ring-sky-500/50'
        );
        button.classList.add('text-slate-300');
      }
    });

    // Filter and show/hide products with smooth transition
    productCards.forEach((card) => {
      const productFilters = card.getAttribute('data-product').split(' ');
      const shouldShow =
        filter === FILTERS.ALL || productFilters.includes(filter);

      if (shouldShow) {
        // Show with fade-in
        card.style.display = '';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
          card.style.transition =
            'opacity 0.3s ease-out, transform 0.3s ease-out';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        // Hide with fade-out
        card.style.transition =
          'opacity 0.2s ease-out, transform 0.2s ease-out';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 200);
      }
    });

    // Update URL hash for deep linking
    if (filter !== FILTERS.ALL) {
      window.history.replaceState(
        null,
        '',
        `#shop-${filter}`
      );
    } else {
      window.history.replaceState(null, '', '#shop');
    }
  }

  /**
   * Initialize podcast selection functionality
   * Allows clicking on podcast sections to filter the shop
   */
  function initPodcastSelection() {
    const podcastSections = document.querySelectorAll(
      '[data-podcast-section]'
    );
    const shopSection = document.getElementById('shop');

    if (!podcastSections.length || !shopSection) return;

    podcastSections.forEach((section) => {
      const podcastFilter = section.getAttribute('data-podcast-section');
      const filterButton = section.querySelector(
        '[data-podcast-filter-button]'
      );

      if (filterButton) {
        filterButton.addEventListener('click', function (e) {
          e.preventDefault();
          scrollToShop();
          setTimeout(() => {
            setFilter(podcastFilter);
          }, 300);
        });
      }
    });

    // Handle hash-based filtering on page load
    const hash = window.location.hash;
    if (hash.startsWith('#shop-')) {
      const filter = hash.replace('#shop-', '');
      if (
        filter === FILTERS.BUSINESS_ON_PURPOSE ||
        filter === FILTERS.WHEN_LIFE_BITES
      ) {
        setTimeout(() => {
          scrollToShop();
          setFilter(filter);
        }, 100);
      }
    }
  }

  /**
   * Initialize quick view modal functionality
   */
  function initQuickView() {
    const quickViewButtons = document.querySelectorAll('[data-quick-view]');
    const modal = document.getElementById('quick-view-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');
    const modalPrimary = document.getElementById('modal-primary');
    const modalSecondary = document.getElementById('modal-secondary');

    if (!quickViewButtons.length || !modal) return;

    quickViewButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const productId = this.getAttribute('data-quick-view');
        const product = PRODUCT_DETAILS[productId];
        if (product) {
          showModal(product);
        }
      });
    });

    // Close modal events
    modalClose.addEventListener('click', hideModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) hideModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        hideModal();
      }
    });

    function showModal(product) {
      modalTitle.textContent = product.title;
      modalContent.innerHTML = `
        <p class="text-slate-300 mb-4">${product.description}</p>
        <div class="mb-4">
          <h4 class="text-sm font-medium text-slate-50 mb-2">What's Included:</h4>
          <ul class="text-xs text-slate-400 space-y-1">
            ${product.features.map(feature => `<li>• ${feature}</li>`).join('')}
          </ul>
        </div>
        <div class="flex items-center justify-between text-xs">
          <span class="text-slate-400">${product.format}</span>
          <span class="text-lg font-semibold text-sky-300">${product.price}</span>
        </div>
      `;
      modalPrimary.textContent = `Purchase for ${product.price}`;
      modalSecondary.textContent = 'Add to Cart';
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }

    function hideModal() {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  /**
   * Initialize empty state functionality
   */
  function initEmptyState() {
    // Check for empty state after filtering
    const emptyState = document.getElementById('empty-state');
    if (!emptyState) return;

    // Override setFilter to check for visible products
    const originalSetFilter = window.ODSShopFilter.setFilter;
    window.ODSShopFilter.setFilter = function (filter) {
      originalSetFilter.call(this, filter);
      setTimeout(checkEmptyState, 250); // Wait for transitions
    };

    function checkEmptyState() {
      const productCards = document.querySelectorAll('[data-product]');
      let visibleCount = 0;
      productCards.forEach((card) => {
        if (card.style.display !== 'none') visibleCount++;
      });
      if (visibleCount === 0) {
        emptyState.classList.remove('hidden');
      } else {
        emptyState.classList.add('hidden');
      }
    }
  }

  // Expose filter function globally for external use
  window.ODSShopFilter = {
    setFilter: setFilter,
    scrollToShop: scrollToShop,
    FILTERS: FILTERS,
  };
})();

