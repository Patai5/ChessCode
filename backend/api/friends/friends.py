from django.contrib.auth import get_user_model
from django.db.models import Q

from .models import Friendship

User = get_user_model()


def getFriends(user: User) -> list[User]:
    """Returns a list of users that are friends with the user"""
    friendships = Friendship.objects.filter(Q(user1=user) | Q(user2=user))
    return [friendship.get_friend(user) for friendship in friendships]


def areFriends(user1: User, user2: User) -> bool:
    """Returns True if user1 and user2 are friends, otherwise False"""
    return Friendship.objects.filter(Q(user1=user1, user2=user2) | Q(user1=user2, user2=user1)).exists()
