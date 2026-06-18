from django.db import models
from slugify import slugify
from django.contrib.auth import get_user_model
from django.utils import timezone
# Create your models here.
User = get_user_model()

class Artist(models.Model):
    name = models.CharField(max_length=200)
    cover = models.ImageField(upload_to='artist/', blank=True, null=True)
    slug = models.SlugField(max_length=255, db_index=True,unique=True,blank=False)
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        
        super().save(*args, **kwargs)
    
class Album(models.Model):
    name = models.CharField(max_length=200)
    cover = models.ImageField(upload_to='albums/', verbose_name="Обложка",blank=True, null=True)
    artists = models.ManyToManyField(
        Artist,
        through='AlbumArtist',
        related_name='albums'
    )
    def __str__(self):
        return self.name

class Track(models.Model):
    name = models.CharField(max_length=200)
    album = models.ForeignKey(Album, verbose_name=("Альбом"), on_delete=models.CASCADE,related_name='tracks')
    path = models.FileField(upload_to='tracks', blank=True, null=True)
    order = models.PositiveSmallIntegerField(default=0)
    artists = models.ManyToManyField(Artist,
                                     through='TrackAuthor',
                                     related_name='tracks')
    favorite_by = models.ManyToManyField(User,
                                         through='FavoriteTrack',
                                         related_name='favorite_tracks'
                                         )
    
    def __str__(self):
        return self.name

class AlbumArtist(models.Model):
    album = models.ForeignKey(Album,on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('album','artist')

class TrackAuthor(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('track','artist')

class FavoriteTrack(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('user','track')

class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user','track','date')