import os
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime, timedelta
import re # Import the regular expression module

# --- Setup ---
load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# --- AI Prompt Engineering ---

# FIX: The prompt now explicitly asks for HTML tags for reliability.
SUMMARY_PROMPT = """
You are a data storyteller for a community manager. Analyze the provided Key Metrics and Data Snapshot.
Your task is to provide a 3-bullet point summary that is quick to read and insightful.

**Key Metrics:**
- Total Members: {totalMembers}
- Active Members (last 30 days): {activeMembers}
- New Members (last 30 days): {newMembers}
- Top Acquisition Source: '{topAcquisitionSource}'

**Instructions:**
1.  Write exactly **three** bullet points using `<li>` HTML tags.
2.  Inside each `<li>` tag, start with a keyword wrapped in `<strong>` tags (e.g., <strong>Growth Engine:</strong>).
3.  Be concise and use numbers to support your points.
4.  **DO NOT** give strategic recommendations. Stick to the facts.
5.  Return ONLY the `<li>` tags, without the surrounding `<ul>` tags.

**Data Snapshot:**
{data_snapshot}
"""

SUGGESTION_PROMPT = """
You are a data visualization expert creating chart suggestions for a community dashboard.
Based on the available columns: {columns}

Suggest the top 3 most impactful charts. Focus on member growth, engagement sources, and activity levels.

For each suggestion, provide:
1. A descriptive `title`.
2. A `chart` type from this list: 'bar', 'line', 'pie'.
3. The column name for the `x` axis.
4. The column name for the `y` axis.

Return your response ONLY as a valid JSON array of objects.
Example format:
[
    {{"title": "Member Growth by Join Date", "chart": "line", "x": "join_date", "y": "member_id"}},
    {{"title": "Acquisition by Source", "chart": "pie", "x": "source_platform", "y": "source_platform"}},
    {{"title": "Top 10 Most Active Members", "chart": "bar", "x": "member_name", "y": "messages_sent"}}
]
"""

# --- AI Configuration ---
try:
    gemini_api_key = os.getenv('GEMINI_API_KEY')
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in .env file.")
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
except Exception as e:
    print(f"🔴 FATAL ERROR configuring AI: {e}")
    exit()

# --- Helper Functions ---
def calculate_kpis(df):
    df_copy = df.copy()
    thirty_days_ago = datetime.now() - timedelta(days=30)
    df_copy['join_date_dt'] = pd.to_datetime(df_copy['join_date'], errors='coerce')
    df_copy['last_active_date_dt'] = pd.to_datetime(df_copy['last_active_date'], errors='coerce')
    return {
        'totalMembers': len(df_copy),
        'activeMembers': len(df_copy[df_copy['last_active_date_dt'] >= thirty_days_ago]),
        'newMembers': len(df_copy[df_copy['join_date_dt'] >= thirty_days_ago]),
        'topAcquisitionSource': df_copy['source_platform'].mode()[0] if not df_copy['source_platform'].empty else 'N/A'
    }

def get_ai_summary(kpis, df_snapshot):
    prompt = SUMMARY_PROMPT.format(
        totalMembers=kpis['totalMembers'],
        activeMembers=kpis['activeMembers'],
        newMembers=kpis['newMembers'],
        topAcquisitionSource=kpis['topAcquisitionSource'],
        data_snapshot=df_snapshot.to_string()
    )
    response = model.generate_content(prompt)
    
    # FIX: More robustly convert markdown to HTML as a fallback.
    # This handles both * and • for bullets, and **text** for bold.
    text = response.text.strip()
    text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'^\s*[\*•]\s*', '<li>', text, flags=re.MULTILINE)
    text = re.sub(r'</li>\s*', '</li>', text) # Clean up newlines after list items
    
    # Ensure it's wrapped in <ul> tags for proper rendering
    if text.startswith('<li>'):
        return f"<ul>{text}</ul>"
    return f"<ul><li>{text}</li></ul>" # Wrap even single lines

# --- API Endpoints ---
@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files: return jsonify({'error': 'No file part in request'}), 400
    file = request.files['file']
    if not file or not file.filename.lower().endswith('.csv'): return jsonify({'error': 'Please upload a valid CSV file.'}), 400

    try:
        df = pd.read_csv(file.stream, encoding='utf-8-sig', sep=',', engine='python')
        df.columns = df.columns.str.strip()
        
        required_columns = ['join_date', 'last_active_date', 'source_platform']
        for col in required_columns:
            if col not in df.columns: return jsonify({'error': f"CSV missing required column: '{col}'"}), 400

        kpis = calculate_kpis(df)
        ai_summary = get_ai_summary(kpis, df.head(10))

        return jsonify({"columns": df.columns.tolist(), "rows": df.to_dict('records'), "kpis": kpis, "summary": ai_summary})
    except Exception as e:
        print(f"Upload error: {e}")
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/api/suggest', methods=['POST'])
def suggest_charts():
    req_data = request.get_json()
    if not req_data or 'columns' not in req_data: return jsonify({"error": "Missing columns in request"}), 400
        
    try:
        prompt = SUGGESTION_PROMPT.format(columns=req_data.get('columns', []))
        response = model.generate_content(prompt)
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        json.loads(cleaned_response)
        return cleaned_response, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        print(f"Suggest charts error: {e}")
        return jsonify({"error": "Failed to get valid chart suggestions from AI."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)

