from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Meta:
        db_table = "auth_user"


class AnonymousSessionUser(models.Model):
    session_key = models.CharField(primary_key=True, max_length=255)
