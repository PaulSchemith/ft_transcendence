FROM python:3.9.18-bullseye

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# COPY certificate.crt /app
# COPY private.key /app

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]