import re

from rest_framework import serializers


class AuthDetailsSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=15)
    password = serializers.CharField(max_length=255)

    def validate_username(self, value):
        if re.match("^[a-zA-Z0-9._-]{3,15}$", value) is None:
            raise serializers.ValidationError("Username does not match the required pattern")
        return value
