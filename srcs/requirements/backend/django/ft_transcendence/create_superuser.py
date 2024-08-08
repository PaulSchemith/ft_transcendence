# manage.py shell < create_superuser.py

import os
from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username=os.environ.get('DJANGO_SUPERUSER_USERNAME')).exists():
    User.objects.create_superuser(
        username=os.environ.get('DJANGO_SUPERUSER_USERNAME'),
        email=os.environ.get('DJANGO_SUPERUSER_EMAIL'),
        password=os.environ.get('DJANGO_SUPERUSER_PASSWORD'))
    print('Superuser created')
    
