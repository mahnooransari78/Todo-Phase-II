# Multi-stage build for Python backend
# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies with pip wheel for faster builds
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Production runtime
FROM python:3.11-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python dependencies from builder stage
COPY --from=builder /root/.local /root/.local

# Make sure the local bin is in PATH
ENV PATH=/root/.local/bin:$PATH

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser

# Copy application code (excluding unnecessary files with .dockerignore)
COPY --chown=appuser:appuser . .

# Expose port (typically 8000 for FastAPI)
EXPOSE 8000

# Environment variables with defaults
ENV PORT=8000
ENV HOST=0.0.0.0
ENV WORKERS=4

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Run the application with uvicorn
CMD ["sh", "-c", "python -m uvicorn src.main:app --host ${HOST} --port ${PORT} --workers ${WORKERS}"]