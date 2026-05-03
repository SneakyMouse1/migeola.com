# Migeola - International Logistics & Equipment Sourcing

Migeola is a high-conversion B2B landing page designed to generate qualified leads for an international logistics company. It presents complex services (freight forwarding, project cargo, equipment sourcing) in a clear, trust-building format tailored for global clients.

## Key Features

- **Multilingual experience (EN/PL)**
  Enables communication with both local and international clients, improving accessibility and SEO visibility.

- **Clear service presentation**
  Structured sections for Freight Forwarding, Project Cargo, and Equipment Sourcing simplify complex logistics offerings.

- **Conversion-focused contact system**
  Fast and reliable inquiry flow with email delivery via Nodemailer, protected by Cloudflare Turnstile to prevent spam.

- **Performance-first frontend**
  Built with Astro for fast loading, minimal JavaScript, and improved search engine indexing.

- **Responsive and modern UI**
  Clean, adaptable interface with dark/light mode and subtle animations to enhance user experience without distraction.

- **SEO-ready architecture**
  Semantic HTML, sitemap generation, metadata, clear page structure, and proper heading hierarchy.

## Tech Stack

- **Framework**: [Astro 6+](https://astro.build/) (SSR Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide Astro](https://lucide.dev/)
- **Email**: [Nodemailer](https://nodemailer.com/)
- **Security**: [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/)
- **Runtime**: Node.js (Adapter: `@astrojs/node`)

## Project Structure

```text
/
├── public/          # Static assets (images, favicons, robots.txt)
├── src/
│   ├── components/  # Astro & UI components (Sections, Buttons, Inputs)
│   ├── i18n/        # Translation files (PL/EN)
│   ├── layouts/     # Main page layouts
│   ├── pages/       # Route components (including API routes)
│   ├── scripts/     # Client-side JavaScript (animations, logic)
│   └── styles/      # Global CSS and Tailwind configuration
├── astro.config.mjs # Astro configuration (SSR, Adapters, Plugins)
└── package.json     # Project dependencies and scripts
```

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

### 4. Development
```bash
npm run dev
```
Starts the local development server at `http://localhost:4321`.

### 5. Production Build
```bash
npm run build
```
Builds the production-ready application. Since it uses SSR, it will generate a server entry point in the `dist/` folder.

## 📄 License
All rights reserved. © 2026 Migeola.
