import sys, os
import urllib2
import re
from django.conf import settings

from bs4 import BeautifulSoup

# sys.path.append('yt_fetcher')
sys.path.append('..')
sys.path.append('../../tunely/')
os.environ['DJANGO_SETTINGS_MODULE'] = "settings"

import soundcloud
from tune_gazer.models import Track, Station

client = soundcloud.Client(client_id=settings.SC_CLIENT_ID,
                           client_secret=settings.SC_CLIENT_SECRET,
                           username=settings.SC_USERNAME,
                           password=settings.SC_PSWD)



#####################GET_TRACKS_FROM_YOUTUBE######################################

def makePlaylistJson(id, index=1):
    link = 'http://gdata.youtube.com/feeds/api/playlists/%s?max-results=1&start-index=%i' % (id, index)
    return link


def makeUserUploadsJson(id, index=1):
    link = 'https://gdata.youtube.com/feeds/api/users/%s/uploads?max-results=1&start-index=%i' % (id, index)
    return link


def fetch(link):
    page = urllib2.urlopen(link)
    data = page.read()
    page.close()
    return data


def getLinks(pageContent):
    regex = re.compile("href=\"([\w?=]{1,4})(\:)(//)(www)([\w?=./]{1,255})")
    # r = regex.search(pageContent)
    return regex.findall(pageContent)


def getTracks(plstID, station_name, userUploads=False):
    if Station.objects.all():
        for i in xrange(310, 500): # Youtube max playlist length is 200

            if userUploads:
                content = fetch(makeUserUploadsJson(id=plstID, index=i))
            else:
                content = fetch(makePlaylistJson(id=plstID, index=i))
            soup = BeautifulSoup(content)
            for a in soup.find_all('link'):
                try:
                    if a['type'] == 'text/html' and (str(a['href']).find('watch') != -1):
                        video = BeautifulSoup(fetch(a['href']))
                        tempTile = video.find_all(id='eow-title')[0]['title']
                        print i, '. ', tempTile
                        station, rs = Station.objects.get_or_create(name=station_name)
                        track, cr = Track.objects.get_or_create(yt_name=tempTile, station_name=station)
                except:
                    pass


########INDEX_WITH_SOUNDCLOUD##########################
import re


def index_with_sc(station_name):
    station = Station.objects.get(name=station_name)
    total = Track.objects.filter(soundcloud=False, station_name=station).count()
    for index, track in enumerate(Track.objects.filter(soundcloud=False, station_name=station)):
        try:
            replacements = {"[": "", "]": "", "(": "", ")": "", "-": ""}
            yt_name = "".join(replacements.get(c, c) for c in track.yt_name)
            tracks = client.get('/tracks', q=yt_name)
            rsp = tracks[0].obj
            if rsp['duration'] / 60000 < 10:
                track.sc_id = rsp['id']
                track.sc_name = rsp['title']
                track.sc_artist = rsp['user']['username']
                track.soundcloud = True
                track.save()
                print '%s / %s' % (index, total)
                # print 'ad'
            else:
                print 'playlist warning -> %s ' % rsp['title']

        except:
            try:
                tracks = client.get('/tracks', q=track.yt_name)
                rsp = tracks[0].obj
                try:
                    track.sc_id = rsp['id']
                    track.sc_name = rsp['title']
                    track.sc_artist = rsp['user']['username']
                    track.soundcloud = True
                    track.save()
                    print '%s / %s' % (index, total)
                    # print 'ad'
                except:
                    print 'error-> %s / %s' % (index, total)
            except:
                print 'pass -> %s / %s' % (index, total)
    print 'finished'


#################UPDATE_SET####################################

def createSet():
    pass


def updateSet(pl_name, new_set=False):
    station = Station.objects.get(name=pl_name)
    track_ids = list()
    for track in Track.objects.filter(station_name=station, soundcloud=True):
        track_ids.append(track.sc_id)
    tracks = map(lambda id: dict(id=id), track_ids)
    if not new_set:
        playlist = client.get('/me/playlists')
        for pl in playlist:
            if pl.title == pl_name:
                result = client.put(pl.uri, playlist={
                    'tracks': tracks
                })
                print result
    else:
        client.post('/playlists', playlist={
            'title': pl_name,
            'sharing': 'public',
            'tracks': tracks
        })


def updateSetMF(pl_name):
    station = Station.objects.get(name=pl_name)
    track_ids = list()
    for track in Track.objects.filter(station_name=station, soundcloud=True)[:1]:
        track_ids.append(track.sc_id)
    tracks = map(lambda id: dict(id=id), track_ids)

    playlist = client.get('/me/playlists')
    for pl in playlist:
        if pl.title == pl_name:
            result = client.put(pl.uri, playlist={
                'tracks': tracks
            })
            print result


# updateSet('Majestic')
# Step one
# Get youtube tracks into DB
# getTracks playlist_id_youtube playlist_id_local
# getTracks('OneChilledPanda', 'OneChilledPanda', userUploads=True)

# Match with soundcloud
# index_with_sc('OneChilledPanda')

# Update set on soundcloud
# updateSet('OneChilledPanda', True)