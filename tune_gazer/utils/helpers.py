__author__ = 'dan'

from django.conf import settings
from datetime import datetime
from pytz import timezone

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