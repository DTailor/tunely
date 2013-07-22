import os
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))

DEBUG = False
TEMPLATE_DEBUG = False
COMPRESS_ENABLED = True

# Gmail account used to send feedback messages
GMAIL_USER = '' # enter full e-mail address
GMAIL_PSWD = ''
MAIL_RECIPIENT = ''

# Soundcloud app and account configuration
SC_CLIENT_ID = ''
SC_CLIENT_SECRET = ''
SC_USERNAME = ''
SC_PSWD = ''

ADMINS = (
# ('Your Name', 'your_email@example.com'),
)

DATABASES = {
    'default': {
        'ENGINE': '', # Add 'postgresql_psycopg2', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': '', # Or path to database file if using sqlite3.
        'USER': '',
        'PASSWORD': '',
        'HOST': '', # Empty for localhost through domain sockets or '127.0.0.1' for localhost through TCP.
        'PORT': '', # Set to empty string for default.
    }
}


SECRET_KEY = "sample_key"

MANAGERS = ADMINS

ALLOWED_HOSTS = ['*']

TIME_ZONE = 'America/Chicago'

LANGUAGE_CODE = 'en-us'

SITE_ID = 1

USE_I18N = True

USE_L10N = True

USE_TZ = True

MEDIA_ROOT = (os.path.join(PROJECT_PATH, '../tune_gazer/media'))

MEDIA_URL = '/media/'

STATIC_ROOT = (os.path.join(PROJECT_PATH, '../tune_gazer/static'))

STATIC_URL = '/static/'

STATICFILES_DIRS = (
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
)

MIDDLEWARE_CLASSES = (
    "django.middleware.gzip.GZipMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

)

ROOT_URLCONF = 'tunely.urls'

WSGI_APPLICATION = 'tunely.wsgi.application'

import os

TEMPLATE_DIRS = (os.path.join(os.path.dirname(__file__), '..', 'templates').replace('\\', '/'),)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'tune_gazer',
    'south',
    "compressor",
    'gunicorn',
)

COMPRESS_JS_FILTERS = [
     'compressor.filters.jsmin.JSMinFilter'
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

try:
    from local_settings import *
except ImportError:
    pass
