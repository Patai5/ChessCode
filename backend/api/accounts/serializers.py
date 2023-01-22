import re

from rest_framework import serializers


class Username(serializers.Serializer):
    username = serializers.CharField(max_length=15)

    def validate_username(self, value):
        if re.match(r"^[a-zA-Z0-9._-]{3,15}$", value) is None:
            raise serializers.ValidationError("Username does not match the required pattern")
        return value
