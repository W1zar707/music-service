#!/bin/sh

python manage.py migrate
python manage.py collectstatic --noinput
# gunicorn music_service.wsgi:application --bind 0.0.0.0:8000 --workers 16
python manage.py runserver 0.0.0.0:8000