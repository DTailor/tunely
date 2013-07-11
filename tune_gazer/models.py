from django.db import models


class Station(models.Model):
    name = models.CharField(max_length=50)
    station_id = models.CharField(max_length=50, blank=True, null=True)
    public = models.BooleanField(default=False)
    slug = models.SlugField(max_length=255, blank=True, null=True)
    icon = models.ImageField(upload_to='station_icon', blank=True, null=True)
    description = models.TextField(max_length=255, blank=True, null=True)

    def __unicode__(self):
        return self.name


class Track(models.Model):
    yt_name = models.CharField(max_length=255)
    sc_name = models.CharField(max_length=255, blank=True, null=True)
    sc_artist = models.CharField(max_length=255, blank=True, null=True)
    sc_id = models.IntegerField(max_length=50, blank=True, null=True)
    soundcloud = models.BooleanField(default=False)
    station_name = models.ForeignKey(Station, blank=True, null=True)

    def __unicode__(self):
        return self.yt_name


class Background(models.Model):
    dayparts = (
        (1, 'day'),
        (2, 'evening'),
        (3, 'night'),
        (4, 'morning'),
    )
    daypart = models.IntegerField(choices=dayparts, default=1)
    bg_image = models.ImageField(max_length=400, upload_to='backgrounds')