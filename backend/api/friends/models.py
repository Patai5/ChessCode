from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Friendship(models.Model):
    friend_id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(User, related_name="user1", on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name="user2", on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user1", "user2")

    def __str__(self):
        return f"{self.user1.username} - {self.user2.username}"

    def get_friend(self, user):
        """Returns the other user in the friendship"""
        if self.user1 == user:
            return self.user2
        else:
            return self.user1


class FriendRequest(models.Model):
    friend_request_id = models.AutoField(primary_key=True)
    fromUser = models.ForeignKey(User, related_name="fromUser", on_delete=models.CASCADE)
    toUser = models.ForeignKey(User, related_name="toUser", on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("fromUser", "toUser")

    def __str__(self):
        return f"{self.fromUser.username} -> {self.toUser.username}"
