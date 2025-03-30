
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Driver, Trip, LogEntry, CustomUser

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['email', 'full_name', 'password']
        extra_kwargs = {
            'email': {'required': True},
            'full_name': {'required': True}
        }

    def create(self, validated_data):
        # Create user
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            full_name=validated_data['full_name']
        )
        
        # # Optionally create a driver profile
        # Driver.objects.create(user=user)
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class DriverSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        queryset=CustomUser.objects.all(),
        slug_field='email'
    )
    
    class Meta:
        model = Driver
        fields = ['id','user', 'license_number', 'available_hours']
    
    def validate(self, data):
        user = data['user']
        if hasattr(user, 'driver_profile'):
            raise serializers.ValidationError(
                "This user already has a driver profile"
            )
        return data
    
class DefaultSerializer(serializers.Serializer):
    # Define at least one field
    dummy_field = serializers.CharField(required=False)

class LogEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = '__all__'
        

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = '__all__'
        read_only_fields = ('id', 'start_time', 'actual_end_time', 'driver')

    def create(self, validated_data):
        # Get the driver from the request context
        request = self.context.get('request')
        validated_data['driver'] = request.user.driver_profile  # Assuming driver_profile is related to the user
        return super().create(validated_data)
