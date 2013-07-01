# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Track'
        db.create_table(u'tune_gazer_track', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('yt_name', self.gf('django.db.models.fields.CharField')(max_length=255)),
            ('sc_name', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('sc_artist', self.gf('django.db.models.fields.CharField')(max_length=255, null=True, blank=True)),
            ('sc_id', self.gf('django.db.models.fields.IntegerField')(max_length=50, null=True, blank=True)),
            ('soundcloud', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('station_name', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['tune_gazer.Station'], null=True, blank=True)),
        ))
        db.send_create_signal(u'tune_gazer', ['Track'])

        # Adding model 'Station'
        db.create_table(u'tune_gazer_station', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=50)),
            ('station_id', self.gf('django.db.models.fields.CharField')(max_length=50, null=True, blank=True)),
            ('public', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=255, null=True, blank=True)),
        ))
        db.send_create_signal(u'tune_gazer', ['Station'])

        # Adding model 'Background'
        db.create_table(u'tune_gazer_background', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('daypart', self.gf('django.db.models.fields.IntegerField')(default=1)),
            ('bg_image', self.gf('django.db.models.fields.files.ImageField')(max_length=400)),
        ))
        db.send_create_signal(u'tune_gazer', ['Background'])


    def backwards(self, orm):
        # Deleting model 'Track'
        db.delete_table(u'tune_gazer_track')

        # Deleting model 'Station'
        db.delete_table(u'tune_gazer_station')

        # Deleting model 'Background'
        db.delete_table(u'tune_gazer_background')


    models = {
        u'tune_gazer.background': {
            'Meta': {'object_name': 'Background'},
            'bg_image': ('django.db.models.fields.files.ImageField', [], {'max_length': '400'}),
            'daypart': ('django.db.models.fields.IntegerField', [], {'default': '1'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'tune_gazer.station': {
            'Meta': {'object_name': 'Station'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'}),
            'public': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'station_id': ('django.db.models.fields.CharField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'})
        },
        u'tune_gazer.track': {
            'Meta': {'object_name': 'Track'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'sc_artist': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'sc_id': ('django.db.models.fields.IntegerField', [], {'max_length': '50', 'null': 'True', 'blank': 'True'}),
            'sc_name': ('django.db.models.fields.CharField', [], {'max_length': '255', 'null': 'True', 'blank': 'True'}),
            'soundcloud': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'station_name': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['tune_gazer.Station']", 'null': 'True', 'blank': 'True'}),
            'yt_name': ('django.db.models.fields.CharField', [], {'max_length': '255'})
        }
    }

    complete_apps = ['tune_gazer']