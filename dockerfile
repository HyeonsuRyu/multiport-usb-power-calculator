FROM python:3.14.2:linux/arm64/v8

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=src
ENV APP_PATH=/multiport_calc

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "src:app"]