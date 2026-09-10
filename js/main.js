/**
 * LetNet Main Interactive JavaScript
 * - Preloader
 * - Theme Switcher (Dark/Light) with localStorage
 * - Sticky & Glassmorphic Navigation
 * - Accessible Mobile Drawer Menu
 * - Active Page Highlighting
 * - FAQ Accordion with Search
 * - Contact Form Validation & Feedback Toast
 * - Back-to-Top Floating Button
 * - Centralized Config Link Hydration
 */

(function () {
  'use strict';

  // 1. Immediate Theme Application (Prevents White Flash)
  const savedTheme = localStorage.getItem('letnet-theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Run on DOM Ready
  window.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initThemeToggle();
    initStickyHeader();
    initMobileNavigation();
    initActiveNavLinks();
    initBackToTop();
    initFaqAccordion();
    initContactForm();
    initDynamicConfig();
  });

  /* ========================================================
     1. PRELOADER
     ======================================================== */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Snappy loading experience
    const hidePreloader = () => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 400);
    };

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, 250);
    } else {
      window.addEventListener('load', () => setTimeout(hidePreloader, 250));
    }
  }

  /* ========================================================
     2. THEME TOGGLE
     ======================================================== */
  function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle');
    if (!toggleBtns.length) return;

    function updateIcons(theme) {
      toggleBtns.forEach(btn => {
        btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
        btn.setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      });
    }

    updateIcons(document.documentElement.getAttribute('data-theme'));

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('letnet-theme', newTheme);
        updateIcons(newTheme);

        // Notify other components like canvas if needed
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));
      });
    });
  }

  /* ========================================================
     3. STICKY HEADER & SCROLL DETECTION
     ======================================================== */
  function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ========================================================
     4. MOBILE NAVIGATION
     ======================================================== */
  function initMobileNavigation() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-links');
    if (!toggle || !menu) return;

    function openMenu() {
      toggle.classList.add('is-active');
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('is-open');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }

    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.contains('is-active');
      isOpen ? closeMenu() : openMenu();
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('is-open') && 
          !menu.contains(e.target) && 
          !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ========================================================
     5. ACTIVE NAV LINK HIGHLIGHT
     ======================================================== */
  function initActiveNavLinks() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const linkPath = href.split('/').pop();

      if (linkPath === currentPath || 
         (currentPath === '' && linkPath === 'index.html') ||
         (currentPath === 'index.html' && linkPath === './')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* ========================================================
     6. BACK TO TOP BUTTON
     ======================================================== */
  function initBackToTop() {
    const btt = document.getElementById('back-to-top');
    if (!btt) return;

    const toggleVisibility = () => {
      if (window.scrollY > 380) {
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btt.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ========================================================
     7. FAQ ACCORDION & SEARCH
     ======================================================== */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const header = item.querySelector('.faq-question');
      const body = item.querySelector('.faq-answer');
      if (!header || !body) return;

      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Optional: single open accordion (closes others for clean reading)
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        if (isOpen) {
          item.classList.remove('active');
          header.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          header.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Search filter if search input is present
    const searchInput = document.getElementById('faq-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        faqItems.forEach(item => {
          const text = item.textContent.toLowerCase();
          if (text.includes(query)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    }
  }

  /* ========================================================
     8. CONTACT FORM VALIDATION & FEEDBACK
     ======================================================== */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = form.querySelector('#name');
    const emailInput = form.querySelector('#email');
    const serviceSelect = form.querySelector('#service');
    const messageInput = form.querySelector('#message');
    const submitBtn = form.querySelector('button[type="submit"]');
    const formAlert = document.getElementById('form-feedback');

    function showError(input, message) {
      const formGroup = input.closest('.form-group');
      if (!formGroup) return;
      formGroup.classList.add('has-error');
      formGroup.classList.remove('is-valid');
      let errorEl = formGroup.querySelector('.error-msg');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'error-msg';
        formGroup.appendChild(errorEl);
      }
      errorEl.textContent = message;
    }

    function clearError(input) {
      const formGroup = input.closest('.form-group');
      if (!formGroup) return;
      formGroup.classList.remove('has-error');
      formGroup.classList.add('is-valid');
      const errorEl = formGroup.querySelector('.error-msg');
      if (errorEl) errorEl.textContent = '';
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Realtime listeners
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (nameInput.value.trim().length >= 2) clearError(nameInput);
      });
    }
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (validateEmail(emailInput.value.trim())) clearError(emailInput);
      });
    }
    if (serviceSelect) {
      serviceSelect.addEventListener('change', () => {
        if (serviceSelect.value) clearError(serviceSelect);
      });
    }
    if (messageInput) {
      messageInput.addEventListener('input', () => {
        if (messageInput.value.trim().length >= 10) clearError(messageInput);
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      let isValid = true;
      let firstInvalidInput = null;

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const companyVal = (form.querySelector('#company') && form.querySelector('#company').value.trim()) || 'Not specified';
      const serviceVal = serviceSelect ? serviceSelect.value : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      // Validate Name
      if (!nameVal || nameVal.length < 2) {
        showError(nameInput, 'Please enter your name.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        clearError(nameInput);
      }

      // Validate Email
      if (!emailVal || !validateEmail(emailVal)) {
        showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = emailInput;
      } else {
        clearError(emailInput);
      }

      // Validate Service
      if (!serviceVal) {
        showError(serviceSelect, 'Please select a service or topic.');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = serviceSelect;
      } else {
        clearError(serviceSelect);
      }

      // Validate Message
      if (!messageVal || messageVal.length < 10) {
        showError(messageInput, 'Please enter a message (at least 10 characters).');
        isValid = false;
        if (!firstInvalidInput) firstInvalidInput = messageInput;
      } else {
        clearError(messageInput);
      }

      if (!isValid) {
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      // Submission UI state
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
        </svg>
        <span>Sending...</span>
      `;

      if (formAlert) {
        formAlert.className = '';
        formAlert.innerHTML = '';
      }

      // Company email destination
      const recipientEmail = (typeof LETNET_CONFIG !== 'undefined' && LETNET_CONFIG.email) ? 
        LETNET_CONFIG.email : 'letnet.official@gmail.com';

      // Professional email body structure
      const formattedBody = `New enquiry received through the LetNet website.\n\n` +
        `Name: ${nameVal}\n` +
        `Email: ${emailVal}\n` +
        `Company/Organization: ${companyVal}\n` +
        `Service Interested In: ${serviceVal}\n` +
        `Message: ${messageVal}\n\n` +
        `------------------------------\n` +
        `Submitted through: LetNet Website`;

      const subjectLine = `New LetNet Website Enquiry — ${nameVal}`;

      // Config check for email service
      const formConfig = (typeof LETNET_CONFIG !== 'undefined' && LETNET_CONFIG.formEndpoint) ? 
        LETNET_CONFIG.formEndpoint : { service: 'web3forms', accessKey: '' };

      const accessKey = (formConfig.accessKey || '').trim();
      const isConfigured = accessKey && accessKey !== 'YOUR_WEB3FORMS_ACCESS_KEY';

      try {
        let isSuccess = false;

        if (formConfig.service === 'web3forms' && isConfigured) {
          // Web3Forms direct delivery to letnet.official@gmail.com
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: accessKey,
              subject: subjectLine,
              from_name: 'LetNet Website',
              name: nameVal,
              email: emailVal,
              company: companyVal,
              service: serviceVal,
              message: formattedBody,
              replyto: emailVal
            })
          });

          const result = await response.json();
          if (response.ok && result.success !== false) {
            isSuccess = true;
          } else {
            throw new Error(result.message || 'Service submission failed');
          }

        } else if (formConfig.service === 'formspree' && formConfig.formspreeId) {
          // Formspree direct delivery
          const response = await fetch(`https://formspree.io/f/${formConfig.formspreeId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: nameVal,
              email: emailVal,
              company: companyVal,
              service: serviceVal,
              message: formattedBody,
              _replyto: emailVal,
              _subject: subjectLine
            })
          });

          if (response.ok) {
            isSuccess = true;
          } else {
            throw new Error('Formspree submission failed');
          }

        } else if (formConfig.service === 'custom' && formConfig.customUrl) {
          // Custom backend endpoint
          const response = await fetch(formConfig.customUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              name: nameVal,
              email: emailVal,
              company: companyVal,
              service: serviceVal,
              message: formattedBody,
              subject: subjectLine
            })
          });

          if (response.ok) {
            isSuccess = true;
          } else {
            throw new Error('Custom API submission failed');
          }

        } else {
          // Key not yet configured - throw to trigger legitimate error handler (never fake success)
          throw new Error('FORM_ENDPOINT_NOT_CONFIGURED');
        }

        if (isSuccess) {
          // Successful delivery
          form.reset();
          form.querySelectorAll('.form-group').forEach(group => {
            group.classList.remove('is-valid');
            group.classList.remove('has-error');
          });

          if (formAlert) {
            formAlert.className = 'form-alert success';
            formAlert.innerHTML = `
              <div class="alert-icon">✓</div>
              <div class="alert-content">
                <strong>Message sent successfully!</strong>
                <p>Thank you for contacting LetNet. We'll get back to you soon.</p>
              </div>
            `;
            formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }

      } catch (err) {
        // Genuine error handling: DO NOT tell user message was sent.
        // Keep entered data so the user loses nothing.
        const mailtoSubject = encodeURIComponent(subjectLine);
        const mailtoBody = encodeURIComponent(formattedBody);
        const mailtoUrl = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

        if (formAlert) {
          formAlert.className = 'form-alert error';
          formAlert.innerHTML = `
            <div class="alert-icon">✕</div>
            <div class="alert-content">
              <strong>Something went wrong.</strong>
              <p>Your message couldn't be sent right now. Please try again or contact us directly at <a href="mailto:${recipientEmail}">${recipientEmail}</a>.</p>
              <a href="${mailtoUrl}" class="alert-fallback-btn" aria-label="Send this enquiry directly via your email client">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>Send Message via Email Client Now</span> &rarr;
              </a>
            </div>
          `;
          formAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  /* ========================================================
     9. DYNAMIC CONFIG HYDRATION
     ======================================================== */
  function initDynamicConfig() {
    const config = (typeof LETNET_CONFIG !== 'undefined') ? LETNET_CONFIG : null;
    const socials = (config && config.socialLinks) || (typeof SOCIAL_LINKS !== 'undefined' ? SOCIAL_LINKS : null);

    const platformNames = {
      instagram: "Instagram",
      linkedin: "LinkedIn",
      x: "X (Twitter)",
      telegram: "Telegram"
    };

    // Hydrate social links
    if (socials) {
      document.querySelectorAll('[data-social]').forEach(el => {
        const platform = el.getAttribute('data-social');
        if (socials[platform]) {
          el.setAttribute('href', socials[platform]);
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
          if (!el.getAttribute('aria-label')) {
            el.setAttribute('aria-label', `Visit LetNet on ${platformNames[platform] || platform} (opens in new tab)`);
          }
        }
      });
    }

    // Hydrate copyright year
    if (config && config.brand) {
      document.querySelectorAll('[data-current-year]').forEach(el => {
        el.textContent = config.brand.currentYear;
      });
    }

    // Hydrate contact emails
    if (config && config.contact) {
      document.querySelectorAll('[data-contact-email]').forEach(el => {
        el.setAttribute('href', `mailto:${config.contact.generalEmail}`);
        el.textContent = config.contact.generalEmail;
      });
    }
  }
})();
