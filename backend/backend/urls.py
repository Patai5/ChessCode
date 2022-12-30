from django.contrib import admin
from django.urls import include, path, re_path

from .views import main

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    re_path(r".*", main),
]
