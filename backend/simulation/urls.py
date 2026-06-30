from django.urls import path

from . import views


urlpatterns = [
    path("state/", views.state, name="state"),
    path("step/", views.step, name="step"),
    path("reset/", views.reset, name="reset"),
    path("treatment/", views.treatment, name="treatment"),
]