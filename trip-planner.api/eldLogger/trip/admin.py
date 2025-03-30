from django.contrib import admin
from .models import CustomUser, Driver, Trip, LogEntry

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'is_staff', 'is_active')
    search_fields = ('full_name',)
    list_filter = ('is_staff', 'is_active')

@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ('id','full_name', 'license_number', 'license_expiration', 'available_hours')
    search_fields = ('license_number',)
    list_filter = ('license_expiration',)

    @staticmethod
    def full_name(obj):
        return obj.user.full_name


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('id', 'driver', 'pickup_location', 'dropoff_location', 'status', 'created_at')
    search_fields = ('pickup_location', 'dropoff_location')
    list_filter = ('status', 'created_at')

@admin.register(LogEntry)
class LogEntryAdmin(admin.ModelAdmin):
    list_display = ('id', 'trip', 'status', 'start_time', 'end_time', 'location', 'odometer')
    search_fields = ('trip__id', 'location')
    list_filter = ('status', 'start_time', 'end_time')
