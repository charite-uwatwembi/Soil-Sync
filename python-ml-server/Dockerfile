FROM python:3.9-slim

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (entire directory to include rl_env)
COPY . .

# Create directory for ML models
RUN mkdir -p ML_Models

# Copy ML models
COPY ML_Models ./ML_Models

# Render sets the PORT env var dynamically (e.g., 10000). Use it, fallback to 8000 for local dev
ENV PORT 8000

# Expose default port for local dev (Render ignores EXPOSE)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/health || exit 1

# Run the application
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:$PORT --workers 4 --timeout 120 app:app"]