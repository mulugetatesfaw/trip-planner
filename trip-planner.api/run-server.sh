#!/bin/bash

# Navigate to the directory containing manage.py
cd ./eldLogger || {
  echo "Directory not found: ./eldLogger"
  exit 1
}

# Activate the virtual environment
if [ -f "../venv/bin/activate" ]; then
  source ../venv/bin/activate
  echo "Virtual environment activated."
else
  echo "Virtual environment not found. Make sure it is set up in ../venv."
  exit 1
fi

# Run the Django server
python3 manage.py runserver
