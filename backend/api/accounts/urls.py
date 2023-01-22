from django.urls import path

from . import views as v

urlpatterns = [
    path("user-exists", v.UserExists.as_view()),
]
