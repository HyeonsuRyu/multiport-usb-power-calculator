FROM python:3.14.2-slim@sha256:1a3c6dbfd2173971abba880c3cc2ec4643690901f6ad6742d0827bae6cefc925

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=src
ENV APP_PATH=/multiport_calc

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "src:app"]