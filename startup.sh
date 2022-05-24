#!/bin/bash

# Run script for the server
A=$(pwd)

# Determining how to activate virtualenv based on OS
if [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ] || [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
    echo "Preparing installation for Windows..."
    B="/venv/Scripts/activate"
    python -m virtualenv -p python3 venv
    FULL="${A}${B}"
    source "$FULL"
    pip install -r back-end/requirements.txt
    python back-end/manage.py migrate
else 
    echo "Preparing installation..."
    B="/venv/bin/activate"
    python3 -m virtualenv -p python3 venv
    FULL="${A}${B}"
    source "$FULL"
    pip install -r back-end/requirements.txt
    python3 back-end/manage.py migrate
fi

cd front-end/
npm install
cd ../