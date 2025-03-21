import uuid
from django.db import models

class Driver(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    license_number = models.CharField(max_length=100, unique=True)
    available_hours = models.FloatField()  # Remaining available driving hours
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.license_number})"

class Trip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, related_name="trips")
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_used = models.FloatField()  # Hours used in the current cycle
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip by {self.driver.name} from {self.pickup_location} to {self.dropoff_location}"
