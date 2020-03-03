# Getting Started

## Project structure

```
acidb-backend
├───manage.py
├───acidb
│        settings.py
│        urls.py
│        wsgi.py
│        __init__.py
├───config.json.template
└───requirements.txt
```

## Install requeriments

```
pip install requirements.txt
```

## Set configuration file

There is a template with the configuration file structure, you have to set de Data Base credentials, allowed hosts and secret key before running the application.

## Run development server

```
python manage.py runserver
```

# License
[MIT](https://choosealicense.com/licenses/mit/)
