from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TripViewSet, DriverViewSet

router = DefaultRouter()
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
