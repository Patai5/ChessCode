from django.urls import path, re_path


from . import views as v
from . import consumers as c

urlpatterns = [
    path("enqueue", v.Enqueue.as_view()),
    path("stop_queuing", v.StopQueuing.as_view()),
]


websocket_urlpatterns = [
    re_path("queue$", c.QueueConsumer.as_asgi()),
]
