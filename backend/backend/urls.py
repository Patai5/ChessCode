from django.contrib import admin
from django.urls import include, path, re_path

from . import views as v

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    re_path(r".*", v.main),
]
