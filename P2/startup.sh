#!/bin/sh
#!/usr/bin/env which python

# Run script to set up
virtualenv -p 'which python' venv
pip install requirements.txt

python manage.py migrate
python manage.py makemigrations
python manage.py migrate
