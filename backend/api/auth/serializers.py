import re

from rest_framework import serializers


class AuthDetailsSerializer(serializers.Serializer):  # type: ignore
    username = serializers.CharField(max_length=15)
    password = serializers.CharField(max_length=255)


class LoginDetailsSerializer(AuthDetailsSerializer):
    pass


class RegisterDetailsSerializer(AuthDetailsSerializer):
    def validate_username(self, value: str) -> str:
        if re.match(r"^[a-zA-Z0-9._-]{3,15}$", value) is None:
            raise serializers.ValidationError("Username does not match the required pattern")
        return value

    def validate_password(self, value: str) -> str:
        if re.match(r"^(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z]).{8,}$", value) is None:
            raise serializers.ValidationError("Password is not strong enough")
        return value
