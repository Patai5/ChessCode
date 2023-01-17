from django.urls import path

from . import views as v

urlpatterns = [
    path("login", v.Login.as_view()),
    path("register", v.Register.as_view()),
]
