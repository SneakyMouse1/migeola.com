# Migeola - International Logistics & Equipment Sourcing

Migeola is a B2B landing page for an international logistics and equipment sourcing company based in Warsaw, Poland. It presents freight forwarding, project cargo, equipment sourcing, and customs clearance services in a clear, conversion-oriented format tailored for commercial clients.

## Key Features

- **Multilingual Experience (EN / PL)**
  Complete 1:1 symmetry between Polish and English versions with proper canonical links and `hreflang` tags.

- **AI & LLM-Ready (llms.txt & llms-full.txt)**
  Implements the [llmstxt.org](https://llmstxt.org/) standard with `/llms.txt` (concise index) and `/llms-full.txt` (exhaustive company dossier, service specifications, case studies, and agent guidance) for AI search engines and autonomous agents.

- **Interactive Project Portfolio with Live Filtering**
  Categorized track record across 4 continents with instant client-side filtering (`All Projects`, `Multimodal`, `Road & Heavy (OOG)`, `Ocean & Sea Freight`) and crisp SVG vector flag indicators via `flag-icons`.

- **Turnkey Sourcing Protocol**
  Structured 4-stage framework for international equipment procurement: Technical Audit & Inspection → Direct Commercial Contracting → Customs & Regulatory Clearance → Turnkey On-Site Delivery.

- **Conversion-Focused B2B Contact System**
  Inquiry form with dynamic service-type chips, email delivery via Nodemailer, and spam protection via Cloudflare Turnstile.

- **Industrial Dark & Light Theme System**
  Engineered with semantic CSS design tokens (`--color-bg-base`, `--color-bg-surface`, `--color-accent`, etc.) supporting instant theme switching with anti-flash inline script and theme-adaptive logos.

- **Comprehensive SEO & Structured Data**
  Includes OpenGraph image (1200×630), Twitter Cards, XML sitemap, and JSON-LD schemas (`Organization` and `FAQPage`).

---

## Tech Stack

- **Framework**: [Astro 5+](https://astro.build/) (SSR Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide Astro](https://lucide.dev/) & [flag-icons](https://flagicons.lipis.dev/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Security**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
- **AI Standard**: [llms.txt](https://llmstxt.org/) (`/llms.txt`, `/llms-full.txt`)
- **Runtime**: Node.js (Adapter: `@astrojs/node`)

---

## Project Structure

```text
/
├── public/
│   ├── cases/               # Real-world project delivery photographs
│   ├── llms.txt             # AI agent index (llmstxt.org standard)
│   ├── llms-full.txt        # Full AI master knowledge base & dossier
│   ├── og-image.jpg         # OpenGraph sharing banner (1200x630)
│   ├── robots.txt           # Crawler instructions and sitemap link
│   ├── site.webmanifest     # PWA / web application manifest
│   └── *.png, *.jpg         # Brand logos and hero imagery
├── src/
│   ├── components/
│   │   ├── sections/        # Page sections (Hero, Services, Equipment, Cases, Contact, etc.)
│   │   ├── ui/              # Reusable UI components (Button, Input, CaseCard, SectionHeader, etc.)
│   │   ├── Header.astro     # Sticky navigation with theme & language toggle
│   │   └── Footer.astro     # Theme-adaptive footer with directory & legal links
│   ├── i18n/
│   │   ├── cases.ts         # Project cases data & image mappings
│   │   └── translations.js  # Polish and English UI content dictionaries
│   ├── layouts/
│   │   └── Layout.astro     # Main HTML document layout with SEO & JSON-LD
│   ├── pages/
│   │   ├── api/contact.ts   # Server-side API endpoint for form processing
│   │   ├── en/              # English version pages (Home, Privacy, Terms, Cookies)
│   │   └── *.astro          # Polish version pages (Home, Privacy, Terms, Cookies)
│   └── styles/
│       └── global.css       # Tailwind v4 theme tokens, dark/light definitions
├── astro.config.mjs         # Astro configuration (SSR, Node adapter, Sitemap, Tailwind)
└── package.json             # Project dependencies and scripts
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: Version 22.12.0 or higher.
- **npm**: (Included with Node.js).

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/SneakyMouse1/migeola.com.git

# Navigate to project directory
cd migeola.com

# Install dependencies
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your credentials:
```env
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password_or_token
CONTACT_EMAIL=destination@example.com
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret
```

### 4. Development Server
```bash
npm run dev
```
Starts the local development server at `http://localhost:4321`.

### 5. Production Build
```bash
npm run build
```
Builds the standalone SSR server bundle into the `dist/` directory.

---

## 📄 License
All rights reserved. © 2026 Migeola.
