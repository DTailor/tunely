tunely
======

Here is hosted the source code of the new refactored [tunely](https://tunely.co) web-app. 

Setting Up
-------------

1.   `git clone https://github.com/DTailor/tunely.git`
2.   `virtualenv tunely_env`
3.   `source tunely_env/bin/activate`
4.   `pip install -r requirements.txt`
5.   set-up the database configuration
6.   change the secret key to a more complex one
7.   run `syncdb`
8.   run `migrate tune_gazer`
9.   `chmod +x manage.py`
10.   `./manage.py runserver`
11.   access [localhost:8000](localhost:8000)

P.S. You can create a local_settings.py file and activate debug mode by overriding the original settings.