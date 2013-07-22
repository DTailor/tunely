tunely
======

Here is hosted the source code of the new refactored [tunely](http://tunely.co) web-app. 

Setting Up
-------------

1.   `git clone https://github.com/DTailor/tunely.git`
2.   `virtualenv tunely_env`
3.   `source tunely_env/bin/activate`
4.   `pip install -r requirements.txt`
5.   `cp tunely/sample_local_settings.py tunely/local_settings.py`
5.   fill the data in `local_settings.py` file
6.   run `syncdb`
7.   run `migrate tune_gazer`
8.   `chmod +x manage.py`
9.  Add a sample station
10.  `./manage.py runserver`
11.  access [localhost:8000](localhost:8000)

P.S. You can create a local_settings.py file and activate debug mode by overriding the original settings.


