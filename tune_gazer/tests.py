from django.test import TestCase
from django.test.client import Client
from django.core.urlresolvers import reverse
from tune_gazer.models import *


class TuneTest(TestCase):
    fixtures = ['test_fixture.json']

    def setUp(self):
        self.client = Client()

    def test_access_main_page(self):
        url = reverse('home')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_access_individual_station_ok(self):
        station = Station.objects.all().order_by('?')[0]
        response = self.client.get('/%s' % station.slug)
        self.assertEqual(response.status_code, 301)

    def test_access_individual_station_err(self):
        response = self.client.get('/non-existent-station')
        self.assertEqual(response.status_code, 301)
