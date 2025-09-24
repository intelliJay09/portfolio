# Jacqueline Amoako Portfolio

An elegant, immersive portfolio website showcasing web development expertise, built with Next.js 15, TypeScript, Tailwind CSS, and GSAP animations.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS
- **Smooth Animations**: GSAP with ScrollTrigger and Lenis smooth scrolling
- **Responsive Design**: Mobile-first approach with elegant desktop experience
- **Dynamic Content**: Project case studies and service descriptions
- **Contact Form**: Integrated Nodemailer for email submissions
- **Performance Optimized**: Fast loading with Next.js Image optimization

## 📋 Prerequisites

- Node.js 18+ and npm
- Gmail account with App Password for contact form (optional)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Add your Gmail credentials for the contact form

4. Download and add the Satoshi font:
   - Download Satoshi-Variable.woff2 from [Fontshare](https://www.fontshare.com/fonts/satoshi)
   - Place it in `public/fonts/Satoshi-Variable.woff2`

## 🚀 Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📦 Building for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

The site is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── api/               # API routes
│   ├── contact/           # Contact page
│   ├── portfolio/         # Portfolio pages
│   ├── services/          # Services page
│   └── layout.tsx         # Root layout
├── components/            # React components
├── public/               # Static assets
├── content.json          # Site content
└── globals.css           # Global styles
```

## 📝 Content Management

All website content is stored in `content.json` for easy updates without touching the code.

## 🔧 Technologies Used

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: GSAP, Lenis
- **Icons**: Lucide React
- **Email**: Nodemailer
- **Fonts**: Satoshi, Inter

## 📧 Contact Form Setup

To enable the contact form:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Add credentials to `.env.local`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

## 🎨 Design System

The project uses a sophisticated design system with:
- Primary color: #1A1A1A (Charcoal)
- Secondary color: #F5F5F5 (Off-white)
- Accent color: #E2725B (Terracotta)
- Typography: Satoshi for headings, Inter for body text

## 📄 License

This project is private and proprietary. All rights reserved.