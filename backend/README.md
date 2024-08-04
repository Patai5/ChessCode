# Installation

1. Set up a virtual environment

```bash
python3 -m venv env
source env/bin/activate
```

2. Install the dependencies

```bash
pip install .
```

3. Run Django migrations

```bash
python manage.py migrate --run-syncdb
```

4. Run the server

```bash
python manage.py runserver
```
