import os
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Gemini AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

def calculate_kpis(data):
    """Calculate key performance indicators from the data"""
    df = pd.DataFrame(data)
    
    total_members = len(df)
    
    # Calculate active members (active in last 30 days)
    active_members = 0
    if 'last_active' in df.columns:
        thirty_days_ago = datetime.now() - timedelta(days=30)
        df['last_active_date'] = pd.to_datetime(df['last_active'], errors='coerce')
        active_members = len(df[df['last_active_date'] >= thirty_days_ago])
    
    # Calculate new members (joined in last 30 days)
    new_members = 0
    if 'join_date' in df.columns:
        thirty_days_ago = datetime.now() - timedelta(days=30)
        df['join_date_parsed'] = pd.to_datetime(df['join_date'], errors='coerce')
        new_members = len(df[df['join_date_parsed'] >= thirty_days_ago])
    
    # Find top acquisition source
    top_source = 'Unknown'
    if 'source_platform' in df.columns:
        source_counts = df['source_platform'].value_counts()
        if not source_counts.empty:
            top_source = source_counts.index[0]
    
    return {
        'totalMembers': total_members,
        'activeMembers': active_members,
        'newMembers': new_members,
        'topAcquisitionSource': top_source
    }

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle CSV file upload and return parsed data with KPIs"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'File must be a CSV'}), 400
        
        # Read CSV file
        df = pd.read_csv(file)
        data = df.to_dict('records')
        
        # Calculate KPIs
        kpis = calculate_kpis(data)
        
        # Prepare data summary for AI
        data_summary = f"""
        Dataset Overview:
        - Total records: {len(data)}
        - Columns: {', '.join(df.columns.tolist())}
        - Sample data: {json.dumps(data[:3], default=str)}
        """
        
        return jsonify({
            'success': True,
            'data': data,
            'kpis': kpis,
            'dataSummary': data_summary,
            'columns': df.columns.tolist()
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/api/summarize', methods=['POST'])
def generate_summary():
    """Generate AI narrative summary from data"""
    try:
        request_data = request.get_json()
        data_summary = request_data.get('dataSummary', '')
        kpis = request_data.get('kpis', {})
        
        prompt = f"""
        You are a community analytics expert. Based on the following community data, provide a comprehensive narrative summary that tells the story of this community's health and performance.

        Data Overview:
        {data_summary}

        Key Metrics:
        - Total Members: {kpis.get('totalMembers', 0)}
        - Active Members: {kpis.get('activeMembers', 0)}
        - New Members (last 30 days): {kpis.get('newMembers', 0)}
        - Top Acquisition Source: {kpis.get('topAcquisitionSource', 'Unknown')}

        Please provide:
        1. A brief overview of community health
        2. Key insights about growth and engagement
        3. Notable patterns or trends
        4. Strategic recommendations

        Format your response with:
        - Use **bold text** for key metrics and important points
        - Use bullet points (•) for lists
        - Keep paragraphs concise and actionable
        - Focus on business insights, not technical details
        """
        
        response = model.generate_content(prompt)
        summary = response.text
        
        return jsonify({
            'success': True,
            'summary': summary
        })
        
    except Exception as e:
        return jsonify({'error': f'Error generating summary: {str(e)}'}), 500

@app.route('/api/suggest', methods=['POST'])
def suggest_charts():
    """Generate AI chart suggestions based on data structure"""
    try:
        request_data = request.get_json()
        columns = request_data.get('columns', [])
        sample_data = request_data.get('sampleData', [])
        
        prompt = f"""
        You are a data visualization expert. Based on the following CSV columns and sample data, suggest 3-4 meaningful charts that would provide valuable insights for community analytics.

        Available Columns: {', '.join(columns)}
        Sample Data: {json.dumps(sample_data[:2], default=str)}

        For each suggestion, provide:
        1. A descriptive title
        2. Chart type (bar, line, pie, or area)
        3. Brief description of insights it would reveal
        4. Relevant data fields to use

        Focus on charts that would be most valuable for:
        - Understanding member acquisition patterns
        - Tracking growth trends over time
        - Analyzing engagement patterns
        - Identifying key demographics or sources

        Return your response as a JSON array with this exact structure:
        [
          {{
            "id": "unique-id",
            "title": "Chart Title",
            "type": "bar|line|pie|area",
            "description": "What insights this chart reveals",
            "dataKey": "relevant_column_name"
          }}
        ]

        Only return the JSON array, no additional text.
        """
        
        response = model.generate_content(prompt)
        
        # Parse the AI response as JSON
        try:
            suggestions = json.loads(response.text)
        except json.JSONDecodeError:
            # Fallback suggestions if AI response isn't valid JSON
            suggestions = [
                {
                    "id": "source-breakdown",
                    "title": "Member Acquisition Sources",
                    "type": "pie",
                    "description": "Shows distribution of where your members are coming from",
                    "dataKey": "source_platform"
                },
                {
                    "id": "growth-trend",
                    "title": "Monthly Growth Trend",
                    "type": "bar",
                    "description": "Visualizes member join patterns over time",
                    "dataKey": "join_date"
                },
                {
                    "id": "activity-timeline",
                    "title": "Community Activity Over Time",
                    "type": "line",
                    "description": "Tracks member activity patterns and engagement trends",
                    "dataKey": "last_active"
                }
            ]
        
        return jsonify({
            'success': True,
            'suggestions': suggestions
        })
        
    except Exception as e:
        return jsonify({'error': f'Error generating suggestions: {str(e)}'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Backend is running'})

if __name__ == '__main__':
    # Check if API key is configured
    if not os.getenv('GEMINI_API_KEY'):
        print("WARNING: GEMINI_API_KEY not found in environment variables")
        print("Please create a .env file with your Gemini API key")
    
    app.run(debug=True, host='0.0.0.0', port=5001)