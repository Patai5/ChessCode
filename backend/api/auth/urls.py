from django.urls import path

from . import views as v

urlpatterns = [
    path("login", v.Login.as_view()),
    path("register", v.Register.as_view()),
    path("logout", v.Logout.as_view()),
    path("is_authenticated", v.IsAuthenticated.as_view())
]
