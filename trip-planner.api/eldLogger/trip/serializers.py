
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Driver, Trip, LogEntry, CustomUser
import requests


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

    def get_coordinates(self, address):
        """Fetch latitude & longitude from OpenStreetMap, handling potential errors."""
        url = f"https://nominatim.openstreetmap.org/search?format=json&q={address}"
        try:
            response = requests.get(url, timeout=5)  # Timeout prevents hanging requests
            response.raise_for_status()  # Raises an error for 4xx/5xx HTTP codes

            # Ensure response contains JSON data
            if "application/json" not in response.headers.get("Content-Type", ""):
                return None, None

            data = response.json()
            if data:  # If the API returns results
                return float(data[0]["lat"]), float(data[0]["lon"])
            
        except (requests.exceptions.RequestException, ValueError, KeyError, IndexError) as e:
            print(f"Error fetching coordinates: {e}")  # Log error for debugging
        
        return None, None  # Return None if lookup fails

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['driver'] = request.user.driver_profile  # Assign driver
        
        # Convert location names to coordinates
        pickup_location = validated_data.get("pickup_location", "")
        dropoff_location = validated_data.get("dropoff_location", "")

        if pickup_location:
            lat, lon = self.get_coordinates(pickup_location)
            if lat is not None and lon is not None:
                validated_data["pickup_latitude"] = lat
                validated_data["pickup_longitude"] = lon
        
        if dropoff_location:
            lat, lon = self.get_coordinates(dropoff_location)
            if lat is not None and lon is not None:
                validated_data["dropoff_latitude"] = lat
                validated_data["dropoff_longitude"] = lon
        
        return super().create(validated_data)


        

# class TripSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Trip
#         fields = '__all__'
#         read_only_fields = ('id', 'start_time', 'actual_end_time', 'driver')

#     def create(self, validated_data):
#         # Get the driver from the request context
#         request = self.context.get('request')
#         validated_data['driver'] = request.user.driver_profile  # Assuming driver_profile is related to the user
#         return super().create(validated_data)
