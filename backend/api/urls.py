from django.urls import include, path

from . import views as v

urlpatterns = [
    path("auth/", include("api.auth.urls")),
]
