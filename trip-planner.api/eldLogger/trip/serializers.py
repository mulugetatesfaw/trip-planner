from rest_framework import serializers
from .models import Trip, Driver

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class TripSerializer(serializers.ModelSerializer):
    driver = serializers.PrimaryKeyRelatedField(queryset=Driver.objects.all())  # Expect UUID

    class Meta:
        model = Trip
        fields = '__all__'
