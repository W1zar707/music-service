from django_opensearch_dsl import Document, fields
from django_opensearch_dsl.registries import registry
from opensearchpy import analyzer, token_filter
from .models import *
from itertools import chain

INDEX_SETTINGS = {
    'number_of_shards':1,
    'number_of_replicas':0,
    'analysis':{
        'filter':{
            'russian_stemmer':{
                'type':'stemmer',
                'language':'russian',
            },
            'russian_cyrillic_to_latin':{
                'type':'icu_transform',
                'id': 'Cyrillic-Latin; Any-Lower',
            },
            'autocomplete_filter':{
                'type':'edge_ngram',
                'min_gram':2,
                'max_gram':20
            }
        },
        'analyzer':{
            'russian_analyzer':{
                'tokenizer': 'standard',
                'filter':[
                    'lowercase',
                    'icu_folding',
                    'russian_stemmer',
                    'russian_cyrillic_to_latin'
                ]
            },
            'autocomplete_analyzer':{
                'tokenizer':'standard',
                'filter': [
                    'lowercase',
                    'icu_folding',
                    'russian_cyrillic_to_latin',
                    'autocomplete_filter'
                ]
            }
        }
    }
}
@registry.register_document
class ArtistDocument(Document):
    class Index:
        name = 'artist'
        settings = INDEX_SETTINGS

    name = fields.TextField(
        analyzer='autocomplete_analyzer',
        search_analyzer='russian_analyzer'
        )
    name_suggest = fields.CompletionField()

    class Django:
        model = Artist
        fields = []

    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs)

    def prepare_name(self, instance):
        return instance.name

    def prepare_name_suggest(self,instance):
        return {'input':[instance.name]}

@registry.register_document
class AlbumDocument(Document):
    class Index:
        name = 'album'
        settings = INDEX_SETTINGS

    name = fields.TextField(
        analyzer='autocomplete_analyzer',
        search_analyzer='russian_analyzer'
        )
    name_suggest = fields.CompletionField()

    artists = fields.NestedField(properties={
        'name': fields.TextField(analyzer='russian_analyzer')
    })

    class Django:
        model = Album
        fields = []

        related_models = [Artist]
        queryset_pagination = 1000

    def prepare_name(self, instance):
        return instance.name
    

    def prepare_name_suggest(self,instance):
        return {
            'input':[
                instance.name,
                
            ]
        }

    def prepare_artists(self, instance):
        artists = instance.artists.all()
        return [{'name': a.name} for a in artists]

    def get_queryset(self, *args, **kwargs):
        return super().get_queryset(*args, **kwargs).prefetch_related('artists')

    def get_instances_from_related(self, related_model):
        if isinstance(related_model, Artist):
            return related_model.albums.all() 
    

@registry.register_document
class TrackDocument(Document):
    class Index:
        name = 'tracks'
        settings = INDEX_SETTINGS

    name = fields.TextField(
        analyzer='autocomplete_analyzer',
        search_analyzer='russian_analyzer'
        )
    name_suggest = fields.CompletionField()

    album = fields.ObjectField(properties={
        'name': fields.TextField(analyzer='russian_analyzer')
    })

    artists = fields.NestedField(properties={
        'name': fields.TextField(analyzer='russian_analyzer')
    })

    class Django:
        model = Track
        fields = []

        related_models = [Album, Artist]
        queryset_pagination = 1000

    def get_queryset(self,*args, **kwargs):
        return super().get_queryset(*args, **kwargs).select_related('album').prefetch_related('album__artists','artists')
    
    def prepare_name(self, instance):
        return instance.name

    def prepare_name_suggest(self,instance):
        return {
            'input':[
                instance.name
            ]
        }

    def prepare_album(self,instance):
        return {'name':instance.album.name}

    def prepare_artists(self,instance):
        all_artists = chain(instance.album.artists.all(), instance.artists.all())
        return [{'name': a.name} for a in all_artists]
    
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