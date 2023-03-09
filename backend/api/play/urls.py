from django.urls import path

from . import views as v

urlpatterns = [
    path("enqueue", v.Enqueue.as_view()),
    path("stop_queuing", v.StopQueuing.as_view()),
]
