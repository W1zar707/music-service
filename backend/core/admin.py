from django.contrib import admin
from .models import *
# Register your models here.

class TrackAuthorInline(admin.TabularInline):
    model = TrackAuthor
    extra = 0

class AlbumAuthorInline(admin.TabularInline):
    model = AlbumArtist
    extra = 0

@admin.register(Artist)
class ArtistAdmin(admin.ModelAdmin):
    search_fields = ['name']

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    search_fields = ['name']
    inlines = [AlbumAuthorInline]

@admin.register(Track)
class TrackAdmin(admin.ModelAdmin):
    search_fields = ['name']
    inlines = [TrackAuthorInline]