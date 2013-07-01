# Create your views here.
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from django.conf import settings
from tune_gazer.models import Station, Background
from utils.helpers import mail


def home(request):
    backgrounds = Background.objects.all()
    stations = Station.objects.select_related().filter(public=True)
    station = Station.objects.filter(public=True).order_by('?')[0]

    page = render_to_string('pages/main.html', {'stations': stations,
                                                'station': station,
                                                'main': True,
                                                'backgrounds': backgrounds})

    return HttpResponse(page)


def get_station(request, station_slug):
    stations = Station.objects.select_related().filter(public=True)
    station = get_object_or_404(Station, slug=station_slug)

    backgrounds = Background.objects.all()
    page = render_to_string('pages/main.html', {'stations': stations,
                                                'station': station,
                                                'backgrounds': backgrounds})
    return HttpResponse(page)


@csrf_exempt
def feedback(request):
    try:
        mail(settings.MAIL_RECIPIENT,
             "Feedback Message",
             request.POST['feedback'], )
        return HttpResponse('ok')
    except:
        return HttpResponse(0)
