from django.contrib import admin
from tune_gazer.models import Station, Track, Background


class TrackAdmin(admin.ModelAdmin):
    list_display = ('yt_name', 'station_name', 'soundcloud' )
    list_filter = ('station_name', 'soundcloud')


admin.site.register(Station)
admin.site.register(Background)
admin.site.register(Track, TrackAdmin)