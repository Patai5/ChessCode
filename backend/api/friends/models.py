from __future__ import annotations

import typing

from django.db import models
from users.models import User


class Friendship(models.Model):
    friend_id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(User, related_name="user1", on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name="user2", on_delete=models.CASCADE)

    objects: models.Manager[Friendship]

    class Meta:
        unique_together = ("user1", "user2")

    def __str__(self) -> str:
        return f"{self.user1.username} - {self.user2.username}"

    def get_friend(self, user: User) -> User:
        """Returns the other user in the friendship"""
        if self.user1 == user:
            return typing.cast(User, self.user2)
        else:
            return typing.cast(User, self.user1)


class FriendRequest(models.Model):
    friend_request_id = models.AutoField(primary_key=True)
    fromUser = models.ForeignKey(User, related_name="fromUser", on_delete=models.CASCADE)
    toUser = models.ForeignKey(User, related_name="toUser", on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    objects: models.Manager[FriendRequest]

    class Meta:
        unique_together = ("fromUser", "toUser")

    def __str__(self) -> str:
        return f"{self.fromUser.username} -> {self.toUser.username}"
