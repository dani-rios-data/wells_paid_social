# 📊 Wells Fargo Social Insights Dashboard

> **A comprehensive banking social media investment analysis platform built with modern web technologies**

<div align="center">

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.11-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

## 🎯 Overview

Wells Fargo Social Insights Dashboard is an advanced analytics platform designed for strategic analysis of banking social media investments across multiple financial institutions. The application provides comprehensive year-over-year comparisons, platform breakdowns, and individual bank analysis with interactive visualizations and PowerPoint export capabilities.

## ✨ Key Features

### 📋 **Interactive Analytics**
- **Cover Page Dashboard** - Bank selection with dynamic date range information
- **Timeline Analysis** - Interactive trend visualization with dynamic insights
- **Year-over-Year Comparisons** - Multi-year performance analysis
- **WAVE Table Analysis** - Sortable data tables with color-coded performance indicators

### 🏦 **Banking Intelligence**
- **Individual Bank Analysis** - Dedicated analytical slides for each financial institution
- **Platform Investment Distribution** - Strategic insights across social media platforms
- **Investment Tracking** - Comprehensive spend analysis and trend monitoring
- **Performance Metrics** - KPI tracking and growth analysis

### 🎨 **User Experience**
- **Responsive Design** - Wells Fargo branded interface optimized for all devices
- **Interactive Navigation** - Keyboard shortcuts and intuitive controls
- **PowerPoint Export** - Professional presentation generation
- **Real-time Data Processing** - CSV data integration from Nielsen Ad Intel

## 🛠 Technology Stack

### **Frontend Framework**
- **React 18.3.1** - Modern component-based architecture
- **TypeScript 5.5.3** - Type-safe development environment
- **Vite 5.4.1** - Next-generation build tool for optimal performance

### **UI & Styling**
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **shadcn/ui** - Beautifully designed component library
- **Radix UI** - Low-level UI primitives for accessibility
- **Lucide React** - Modern icon library

### **Data Visualization**
- **Recharts 2.12.7** - Composable charting library
- **Date-fns 3.6.0** - Modern date utility library
- **HTML2Canvas 1.4.1** - Screenshot generation for exports

### **State Management & Routing**
- **TanStack Query 5.56.2** - Powerful data fetching and caching
- **React Router DOM 6.26.2** - Declarative routing for React
- **React Hook Form 7.53.0** - Performant forms with easy validation

### **Export & Integration**
- **PptxGenJS 4.0.1** - PowerPoint generation library
- **Zod 3.23.8** - TypeScript-first schema validation

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **TypeScript ESLint** - TypeScript-specific linting rules
- **PostCSS & Autoprefixer** - CSS processing and optimization

### **Analytics & Processing**
- **Python Scripts** - Data analysis and insights generation
- **Pandas & NumPy** - Advanced data manipulation and analysis
- **Custom CSV Parsing** - Nielsen Ad Intel data integration

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wells-fargo-social-insights-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:8080`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build production-ready application |
| `npm run build:dev` | Build with development optimizations |
| `npm run lint` | Run ESLint for code quality checks |
| `npm run preview` | Preview production build locally |

## 📊 Data Requirements

The dashboard processes CSV data with the following structure:

| Column | Description |
|--------|-------------|
| `Bank` | Financial institution name |
| `Year` | Investment year (2023, 2024, 2025) |
| `Month` | Investment month |
| `Media Category` | Type of media investment |
| `Media Type` | Specific media format |
| `Distributor` | Social media platform |
| `Media Digital Consolidated` | Consolidated digital media data |
| `dollars` | Investment amount in USD |

### Data Source
- **Nielsen Ad Intel** - Primary data provider for social media investment tracking
- **CSV Format** - Structured data file located at `/public/banking-social-data.csv`

## 🎮 Usage Guide

### Navigation
- **Arrow Keys** - Navigate between presentation slides
- **Mouse/Touch** - Interactive element selection and manipulation
- **Keyboard Shortcuts** - Efficient navigation controls

### Data Management
- **CSV Updates** - Replace data file in `/public/banking-social-data.csv` for new analysis
- **Real-time Processing** - Automatic data parsing and visualization updates
- **Export Options** - Generate PowerPoint presentations with current data

### Analytics Features
- **Filter Controls** - Bank and time period selection
- **Interactive Charts** - Click and hover for detailed insights
- **Responsive Design** - Optimal viewing on desktop, tablet, and mobile devices

## 📈 Analytics Capabilities

### Performance Metrics
- **Year-over-Year Growth** - Comparative analysis across multiple years
- **Platform Distribution** - Investment allocation across social media channels
- **Peak Performance Tracking** - Identification of highest-performing periods
- **Trend Analysis** - Long-term investment pattern recognition

### Insights Generation
- **Automated Analysis** - Python-powered data processing for strategic insights
- **Custom Reporting** - Tailored analytics for each financial institution
- **Competitive Analysis** - Cross-bank performance comparisons
- **Strategic Recommendations** - Data-driven investment guidance

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Vercel Deployment
The application is optimized for Vercel deployment:

1. **Connect Repository** - Link GitHub repository to Vercel
2. **Automatic Builds** - Triggered on main branch pushes
3. **Environment Variables** - Configure as needed in Vercel dashboard
4. **Custom Domain** - Optional custom domain configuration

### Build Configuration
- **Build Output** - Static files generated in `/dist` directory
- **Environment Support** - Development and production build modes
- **Asset Optimization** - Automatic code splitting and optimization

## 🔧 Configuration

### Development Environment
- **Port** - Default development server runs on port 8080
- **Host** - Configured for both IPv4 and IPv6 (`::`)
- **Path Aliases** - `@` alias configured for `/src` directory

### Styling Configuration
- **Tailwind Config** - Custom theme and component configurations
- **Typography Plugin** - Enhanced text styling capabilities
- **Animation Support** - Smooth transitions and interactive effects

## 🤝 Contributing

This project is maintained by the Wells Fargo Strategic Analytics team. For development contributions:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Standards
- **TypeScript** - Strict type checking enabled
- **ESLint Rules** - Enforced code quality standards
- **Component Architecture** - Modular and reusable component design
- **Accessibility** - WCAG 2.1 compliance with Radix UI primitives

## 📧 Support

For questions, issues, or feature requests related to the Wells Fargo Social Insights Dashboard, please contact the Wells Fargo Strategic Analytics team.

---

<div align="center">

**Built with ❤️ by Wells Fargo Strategic Analytics**

*Empowering data-driven social media investment decisions*

</div>