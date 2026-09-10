/**
 * LetNet Website Configuration
 * Centralized configuration object for social links, company email, and form endpoints.
 * All public configuration is centralized here for easy maintenance.
 */

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/letnet._?stkn=ZDNlZDc0MzIxNw==",
  linkedin: "https://www.linkedin.com/company/letnet/",
  x: "https://x.com/prajwa7s",
  telegram: "https://t.me/+8_AASg77ezoyMjU1"
};

const LETNET_CONFIG = {
  // Official Company Email (Public)
  email: "letnet.official@gmail.com",

  brand: {
    name: "LetNet",
    tagline: "Where smart tech meets stylish living",
    headline: "Build. Connect. Grow.",
    mission: "LetNet connects people, technology and opportunities to build the future.",
    coreFormula: "People + Technology + Ideas + Opportunities",
    currentYear: new Date().getFullYear(),
    status: "Building the Future Network"
  },

  /* 
   * SOCIAL MEDIA CONFIGURATION
   * Official verified community & social media channels.
   */
  socialLinks: SOCIAL_LINKS,

  /* 
   * CONTACT & SUPPORT CHANNELS
   */
  contact: {
    generalEmail: "letnet.official@gmail.com",
    communityEmail: "letnet.official@gmail.com",
    partnershipsEmail: "letnet.official@gmail.com"
  },

  /* 
   * FORM EMAIL DELIVERY CONFIGURATION
   * Powered by Web3Forms (or Formspree / Custom API) - 100% secure, zero private credentials exposed.
   *
   * SETUP INSTRUCTIONS (Takes ~15 seconds):
   * 1. Go to https://web3forms.com
   * 2. Enter letnet.official@gmail.com to receive your free public Access Key
   * 3. Paste the Access Key below into `accessKey`:
   */
  formEndpoint: {
    service: "web3forms", // "web3forms" | "formspree" | "custom"
    accessKey: "YOUR_WEB3FORMS_ACCESS_KEY", // <-- Paste your free Web3Forms Access Key here
    formspreeId: "", // Optional: If you prefer Formspree, enter form ID here
    customUrl: "" // Optional: If you have a custom backend endpoint, enter URL here
  },

  /* 
   * CONCEPT METRICS (Grounded in genuine network values)
   */
  metrics: [
    { label: "People Connected", value: 1250, suffix: "+", description: "Creators, thinkers & founders in the network" },
    { label: "Ideas Shared", value: 480, suffix: "+", description: "Tech insights, design trends & discussions" },
    { label: "Projects Building", value: 12, suffix: " Active", description: "Digital experiences in active development" },
    { label: "Opportunities Ahead", value: 100, suffix: "%", description: "Dedicated to continuous forward growth" }
  ]
};

// Expose globally
if (typeof window !== "undefined") {
  window.LETNET_CONFIG = LETNET_CONFIG;
  window.SOCIAL_LINKS = SOCIAL_LINKS;
}
