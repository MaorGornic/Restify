#!/bin/sh
#!/usr/bin/env which python

# Run script for the server
python manage.py migrate
python manage.py makemigrations
python manage.py migrate

python manage.py runserver
