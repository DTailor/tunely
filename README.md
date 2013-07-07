tunely
======

Here is hosted the source code of the new refactored [tunely](http://tunely.co) web-app. 

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
10.  Configure GMAIL and SOUNDCLOUD data in `settings.py` file  
11.  Add a sample station and background
12.  `./manage.py runserver`
13.  access [localhost:8000](localhost:8000)

P.S. You can create a local_settings.py file and activate debug mode by overriding the original settings.


To Do
-----

1.   Make the song fetcher and playlist creator runnable from console.
2.   New playlist selector concept, more user friendly.
3.   Sitemap
4.   Image feed from tumbrl
5.   And a lot of tasks which are stored in asana :D

P.S. They're not written in the execution order, except the first one.
