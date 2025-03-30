from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics


from .models import Driver, Trip, LogEntry, CustomUser
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer, 
    DriverSerializer, 
    TripSerializer,
    LogEntrySerializer,
    DefaultSerializer,
    
)

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = DefaultSerializer  # Define a default serializer

    def get_serializer_class(self):
        if self.action == 'register':
            return UserRegistrationSerializer
        elif self.action == 'login':
            return UserLoginSerializer
        return self.serializer_class 

    @action(detail=False, methods=['POST'])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'user_id': str(user.id),
                'email': user.email,
                'full_name': user.full_name,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'])
    def login(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Authenticate user
            user = authenticate(request, email=email, password=password)
            
            if user:
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user_id': str(user.id),
                    'email': user.email,
                    'full_name': user.full_name,
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                })
            
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Check if the 'user' key is in the request data
        if 'user' not in request.data:
            return Response(
                {"error": "'user' key is required in the request data"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = CustomUser.objects.get(email=request.data['user'])
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "No user found with the given email"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if the user already has a driver profile
        if hasattr(user, 'driver_profile'):
            return Response(
                {"error": "User already has a driver profile"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().create(request, *args, **kwargs)

class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    #permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        print(self.request.user.id)
        driver = Driver.objects.filter(user=self.request.user.id).first()
        print(driver)
        serializer.save(driver=driver)  # Automatically sets the driver

