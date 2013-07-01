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

1.   Re-write the player.js using angularjs.
2.   Make the song fetcher and playlist creator runnable from console.
3.   New playlist selector concept, more user friendly.
4.   Sitemap
5.   Image feed from tumbrl
6.   And a lot of tasks which are stored in asana :D

P.S. They're not written in the execution order, except the first one.
