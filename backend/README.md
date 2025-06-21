# Backend Setup Instructions

## Prerequisites
- Python 3.9 or later
- Google AI Studio API key for Gemini

## Setup Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate
   
   # On Windows:
   python -m venv venv
   .\venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your Gemini API key:
   # GEMINI_API_KEY=your_actual_api_key_here
   ```

5. **Run the server**
   ```bash
   python app.py
   ```

The backend will be available at `http://localhost:5001`

## API Endpoints

- `POST /api/upload` - Upload CSV file and get parsed data with KPIs
- `POST /api/summarize` - Generate AI narrative summary
- `POST /api/suggest` - Get AI chart suggestions
- `GET /health` - Health check endpoint

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file