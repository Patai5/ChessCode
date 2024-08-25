from attr import dataclass
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    class Meta:
        db_table = "auth_user"


@dataclass(frozen=True)
class AnonymousSessionUser:
    session_key: str
