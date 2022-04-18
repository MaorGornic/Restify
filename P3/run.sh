#!/bin/bash
#!/usr/bin/env python 
python3 back-end/manage.py runserver &
npm --prefix front-end/ start &