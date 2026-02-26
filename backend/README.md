# Gistly Backend API

This is a FastAPI-based backend that uses Google Gemini 1.5 Pro to summarize text.

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configuration**:
   - Create a `.env` file in the root directory.
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

3. **Run the Server**:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

## API Endpoints

### POST `/summarize`
Summarizes the provided text.

**Request Body**:
```json
{
  "text": "The text you want to summarize...",
  "max_length": 500
}
```

**Response**:
```json
{
  "summary": "The summarized text..."
}
```

## Documentation
Once the server is running, you can access the interactive API docs at:
- Swagger UI: `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`
