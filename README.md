# Analytical Storytelling Dashboard
<img width="707" alt="Screenshot 2025-06-24 at 11 39 50 AM" src="https://github.com/user-attachments/assets/68382bb8-629f-45de-b2f3-b060a4c1f8d4" />

A sophisticated web application that transforms raw community data into compelling insights using AI-powered analytics. Upload a CSV file and instantly get KPIs, narrative summaries, and intelligent chart suggestions.

## Features

- **Instant Analysis**: Upload CSV files and get immediate KPI calculations
- **AI-Powered Insights**: Generate narrative summaries using Google's Gemini AI
- **Smart Visualizations**: Get AI-suggested charts based on your data structure
- **Interactive Dashboard**: Add charts with one click to build your analytical dashboard
- **Professional Design**: Beautiful, responsive interface with Spontivly brand colors

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Python Flask + Google Gemini AI
- **Charts**: Recharts for interactive visualizations
- **Styling**: Tailwind CSS with custom color system

## Quick Start

### Prerequisites
- Node.js (v18 or later)
- Python (v3.9 or later)
- Google AI Studio API key

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your Gemini API key

# Run the Flask server
python app.py
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in and create an API key
3. Add it to `backend/.env` file

## Usage

1. Open the application in your browser
2. Upload a CSV file with community data
3. View instant KPIs and AI-generated insights
4. Click "Suggest Charts" for visualization recommendations
5. Add charts to build your analytical dashboard

## API Endpoints

- `POST /api/upload` - Process CSV files and calculate KPIs
- `POST /api/summarize` - Generate AI narrative summaries
- `POST /api/suggest` - Get AI chart suggestions
- `GET /health` - Health check

## Sample Data Format

Your CSV should include columns like:
- `join_date` - Member join dates
- `last_active` - Last activity dates
- `source_platform` - Acquisition sources
- `engagement_score` - Engagement metrics

## Development

The application is built with modern web technologies:
- React 18 with TypeScript for type safety
- Tailwind CSS for responsive design
- Flask backend with CORS support
- Google Gemini AI for intelligent insights

## Production Deployment

For production deployment:
1. Set up environment variables securely
2. Configure CORS for your domain
3. Set up proper error handling and logging
