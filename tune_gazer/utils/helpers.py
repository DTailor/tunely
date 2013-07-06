__author__ = 'dan'

from tune_gazer.models import Background
from django.conf import settings
from datetime import datetime
from pytz import timezone


def getBackground(request):
    day_part = {
        'day': 1,
        'evening': 2,
        'night': 3,
        'morning': 4
    }
    try:
        tz = request.META['TZ']

        now_utc = datetime.now(timezone('UTC'))
        now_user = now_utc.astimezone(timezone(tz))
        hour = now_user.hour

        time = ''
        if 11 < hour <= 17:
            time = 'day'
        elif 17 < hour <= 21:
            time = 'evening'
        elif 21 < hour < 24 or hour <= 6:
            time = 'night'
        elif 6 < hour <= 11:
            time = 'morning'
        return Background.objects.filter(daypart=day_part[time]).order_by('?')[0]

    except:
        return Background.objects.order_by('?')[0]


import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email import Encoders
import os




def mail(to, subject, text, ):
    msg = MIMEMultipart()

    msg['From'] = settings.GMAIL_USER
    msg['To'] = to
    msg['Subject'] = subject

    msg.attach(MIMEText(text))

    part = MIMEBase('application', 'octet-stream')
    # part.set_payload(open(attach, 'rb').read())
    Encoders.encode_base64(part)
    # part.add_header('Content-Disposition',
    #         'attachment; filename="%s"' % os.path.basename(attach))
    # msg.attach(part)

    mailServer = smtplib.SMTP("smtp.gmail.com", 587)
    mailServer.ehlo()
    mailServer.starttls()
    mailServer.ehlo()
    mailServer.login(settings.GMAIL_USER, settings.GMAIL_PSWD)
    mailServer.sendmail(settings.GMAIL_USER, to, msg.as_string())
    # Should be mailServer.quit(), but that crashes...
    mailServer.close()