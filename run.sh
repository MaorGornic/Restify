#!/bin/bash

# Determining how to run the backend based on OS
if [ "$(expr substr $(uname -s) 1 10)" == "MINGW32_NT" ] || [ "$(expr substr $(uname -s) 1 10)" == "MINGW64_NT" ]; then
	    python back-end/manage.py runserver &
else 
	    python3 back-end/manage.py runserver &
fi

npm --prefix front-end/ start
