# Wells Fargo Social Insights Dashboard

A comprehensive banking social media investment analysis dashboard built for Wells Fargo Strategic Analytics.

## Overview

This dashboard provides detailed analysis of banking social media investment across multiple institutions, featuring year-over-year comparisons, platform breakdowns, and individual bank analysis.

## Features

- **Interactive Cover Page** with bank selection and date range information
- **Timeline Analysis** with dynamic insights and trend visualization
- **Year-over-Year Comparison** slides with multiple year pairs
- **WAVE Table Analysis** with sorting and color-coded performance indicators
- **Individual Bank Analysis** with dedicated slides for each institution
- **Platform Investment Distribution** with strategic insights
- **Responsive Design** with Wells Fargo branding
- **CSV Data Integration** from Nielsen Ad Intel
- **Interactive Navigation** with arrow keys
- **PowerPoint Export** functionality

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Data Processing**: Custom CSV parsing
- **Export**: PowerPoint generation

## Installation

1. Clone the repository:
```bash
git clone https://github.com/dani-rios-data/wells_paid_social.git
cd wells_paid_social
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

1. **Navigation**: Use arrow keys to navigate between slides
2. **Data Source**: Update the CSV file in `/public/banking-social-data.csv` for new data
3. **Export**: Click the download button to generate a PowerPoint presentation
4. **Responsive**: The dashboard adapts to different screen sizes

## Data Structure

The dashboard expects CSV data with the following columns:
- Bank
- Year
- Month
- Media Category
- Media Type
- Distributor
- Media Digital Consolidated
- dollars

## Deployment

This project is configured for deployment on Vercel:

1. Push changes to the main branch
2. Connect the repository to Vercel
3. The build process will automatically run

## Contributing

This project is maintained by Wells Fargo Strategic Analytics. For questions or contributions, please contact the team.

## License

© 2025 Wells Fargo. All rights reserved. This software is proprietary and confidential.