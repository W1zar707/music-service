from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import *
from itertools import chain
@registry.register_document
class ArtistDocument(Document):
    class Index:
        name = 'artist'

    class Django:
        model = Artist
        fields = ['name']

@registry.register_document
class AlbumDocument(Document):
    class Index:
        name = 'album'

    artists = fields.NestedField(properties={
        'name': fields.TextField()
    })

    class Django:
        model = Album
        fields = ['name']

        related_models = [Artist]
        queryset_pagination = 1000

    def prepare_artists(self, instance):
        artists = instance.artists.all()
        return [{'name': a.name,'slug':a.slug} for a in artists]

    def get_queryset(self):
        return super().get_queryset().prefetch_related('artists')

    def get_instances_from_related_model(self, related_model):
        if isinstance(related_model, Artist):
            return related_model.albums.all() 
    

@registry.register_document
class TrackDocument(Document):
    class Index:
        name = 'tracks'

    album = fields.ObjectField(properties={
        'name': fields.TextField()
    })

    artists = fields.NestedField(properties={
        'name': fields.TextField()
    })

    class Django:
        model = Track
        fields = ['name']

        related_models = [Album, Artist]
        queryset_pagination = 1000

    def get_queryset(self):
        return super().get_queryset().select_related('album').prefetch_related('album__artists','artists')
    
    def prepare_album(self,instance):
        return {'name':instance.album.name}

    def prepare_artists(self,instance):
        all_artists = chain(instance.album.artists.all(), instance.artists.all())
        return [{'name': a.name, 'slug':a.slug} for a in all_artists]
    
    def get_instances_from_related(self, related_model):
        if isinstance(related_model, Album):
            return related_model.tracks.all()

        if isinstance(related_model, Artist):
            direct_track_ids = related_model.tracks.values_list('id', flat=True)
            
            via_album_track_ids = Track.objects.filter(
                album__artists=related_model
            ).values_list('id', flat=True)
        
            all_track_ids = list(direct_track_ids) + list(via_album_track_ids)
            
            return Track.objects.filter(id__in=all_track_ids)