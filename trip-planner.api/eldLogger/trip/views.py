from django.shortcuts import render
from rest_framework import viewsets
from .models import Trip, Driver
from .serializers import TripSerializer, DriverSerializer

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
