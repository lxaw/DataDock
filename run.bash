#!/usr/bin/env bash

cd delta_web
cd delta
gunicorn --bind 0.0.0.0:8000 delta.wsgi
