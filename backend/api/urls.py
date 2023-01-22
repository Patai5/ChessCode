from django.urls import include, path, re_path

from . import views as v

urlpatterns = [
    path("accounts/", include("api.accounts.urls")),
    path("auth/", include("api.auth.urls")),
    re_path(r".*", v.Invalid_Path.as_view()),
]
