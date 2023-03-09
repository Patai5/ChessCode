from rest_framework import serializers


class EnqueueSerializer(serializers.Serializer):
    game_mode = serializers.CharField(max_length=15)
    time_control = serializers.IntegerField(min_value=0)
