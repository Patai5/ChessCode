from rest_framework import serializers


class GroupSerializer(serializers.Serializer):  # type: ignore
    group = serializers.ListField(child=serializers.CharField(max_length=15), required=False)


class EnqueueSerializer(serializers.Serializer):  # type: ignore
    game_mode = serializers.CharField(max_length=15)
    time_control = serializers.IntegerField(min_value=0)
    group = serializers.ListField(child=serializers.CharField(max_length=15), required=False)
