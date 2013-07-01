from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.conf import settings

from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^humans\.txt$',
                           TemplateView.as_view(template_name="humans.txt", content_type='text/plain')),
                       url(r'^$', 'tune_gazer.views.home', name='home'),
                       url(r'^feedback$', 'tune_gazer.views.feedback', name='feedback'),
                       url(r'^admin/', include(admin.site.urls)),
                       (r'^([\w,-]{1,255})/$', 'tune_gazer.views.get_station'),

)

if settings.DEBUG:
    urlpatterns += patterns('',
                            url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {
                                'document_root': settings.MEDIA_ROOT,
                            }),
    )