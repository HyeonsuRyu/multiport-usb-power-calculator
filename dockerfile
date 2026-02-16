FROM python:3.14.2-slim@6e92f7404b4a14aeed4f6c1fdba21b2de0014c62465c7bdf93e6a7e94d58460e

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=src
ENV APP_PATH=/multiport_calc

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "src:app"]