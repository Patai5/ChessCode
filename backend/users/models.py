from typing import cast

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Meta:
        db_table = "auth_user"


class AnonymousSessionUser(models.Model):
    id = cast(int, models.AutoField(primary_key=True))
    session_key = models.CharField(max_length=255)
