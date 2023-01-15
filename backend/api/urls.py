from django.urls import include, path, re_path

from . import views as v

urlpatterns = [
    path("auth/", include("api.auth.urls")),
    re_path(r".*", v.invalid_path),
]
