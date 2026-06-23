# Use a lightweight official Python runtime as a base
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Install system utilities needed for building packages if necessary
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy python dependencies file first to leverage Docker cache layers
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend files and the model artifact
COPY backend/ ./backend/

# Copy the frontend dashboard directory
COPY frontend/ ./frontend/

# Expose the API port
EXPOSE 8000

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Command to launch your FastAPI backend production server
CMD ["python", "backend/main.py"]