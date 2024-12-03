from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='index'),
    path('about-us/', TemplateView.as_view(template_name='pages/about_us.html'), name='about'),
    path('attractions/', TemplateView.as_view(template_name='pages/attractions.html'), name='attractions'),
    path('contact-us/', TemplateView.as_view(template_name='pages/contact_us.html'), name='contact'),
    path('events/', TemplateView.as_view(template_name='pages/events.html'), name='events'),
    path('services/', TemplateView.as_view(template_name='pages/services.html'), name='services'),
]