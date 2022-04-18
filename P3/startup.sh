#!/bin/bash
#!/usr/bin/env python 

# Run script for the server
A=$(pwd)
B="/venv/bin/activate"
FULL="${A}${B}"

virtualenv -p `which python3.10` venv
source $FULL
pip install -r back-end/requirements.txt
python3 back-end/manage.py migrate
npm --prefix front-end/ install