# Fokus İstatistik Data Analysis Platform

A professional, web-based data analysis dashboard for Fokus İstatistik, powered by FastAPI and Next.js.

## Features
- **Dashboard**: System health and library status monitoring.
- **JSON Analyzer**: Statistical summary for raw JSON data.
- **Excel/CSV Uploader**: Drag-and-drop file analysis with visualizations.
- **Visualizations**: Interactive charts using Recharts/Plotly.

## Tech Stack
- **Backend**: Python 3.9, FastAPI, Pandas, Numpy, Scikit-learn
- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **Infrastructure**: Docker Compose, Nginx

## Getting Started

### Prerequisites
- Docker & Docker Compose

### Running Locally
1. Clone the repository.
2. Run `docker-compose up --build`.
3. Open `http://localhost:3000` (or `http://localhost` if using Nginx mapping).

### Development
- **Backend**: `cd app` -> `pip install -r requirements.txt` -> `uvicorn main:app --reload`
- **Frontend**: `cd frontend` -> `npm install` -> `npm run dev`

## Deployment
Automated deployment via GitHub Actions to `145.223.85.215`.
Changes to `main` branch trigger a deploy.

## License
Proprietary - Fokus İstatistik
