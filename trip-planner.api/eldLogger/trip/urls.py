from django.urls import path, include
from rest_framework.routers import DefaultRouter # type: ignore
from .views import (
    DriverViewSet, 
    TripViewSet, 
    LogEntryViewSet, 
    AuthViewSet
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView
)

router = DefaultRouter()
router.register(r'drivers', DriverViewSet)
router.register(r'trips', TripViewSet)
router.register(r'log-entries', LogEntryViewSet)

auth_urlpatterns = [
    path('register/', AuthViewSet.as_view({'post': 'register'}), name='auth-register'),
    path('login/', AuthViewSet.as_view({'post': 'login'}), name='auth-login'),
]
urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include(auth_urlpatterns)),
    
    # Token-related URLs
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]