from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import status
from django_opensearch_dsl.search import Search
from .documents import *
from collections import defaultdict
from rest_framework.permissions import IsAuthenticated
from opensearchpy import Q
import logging
from .models import *
from .serializers import *
from silk.profiling.profiler import silk_profile
# Create your views here.
class ArtistListView(generics.GenericAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistListSerializer
    def get(self, request):
        artists = self.get_queryset()

        serializer = self.get_serializer(artists, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ArtistItemView(generics.GenericAPIView):
    queryset = Artist.objects.all()
    serializer_class = ArtistItemSerializer
    lookup_field = 'slug'
    def get(self, request, *args, **kwargs):
        artist = self.get_object()
        serializer = self.get_serializer(artist)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class SuggestView(APIView):
    def post(self,request):
        suggest_string = request.data['suggest']
        s = Search().index(
            TrackDocument.Index.name,
            AlbumDocument.Index.name,
            ArtistDocument.Index.name
        )

        s = s.suggest(
            'name_suggest',
            suggest_string,
            completion={'field':'name_suggest'}
        )
        response = s.execute()
        suggestion = []
        for option in response.suggest.name_suggest[0].options:
            suggestion.append(option['text'])

        return Response({
            'suggest':suggestion
        })
    
class SearchView(APIView):
    @silk_profile(name='Track List')
    def post(self, request):
        search_string = request.data['search']
        s = Search().index(
            TrackDocument.Index.name,
            AlbumDocument.Index.name,
            ArtistDocument.Index.name
        )
        s = s.query(
            'bool',
            should=[
                Q(
                    'bool',
                    must=[
                        Q('term', _index=ArtistDocument.Index.name),
                        Q('match', name={'query': search_string, 'boost': 5})
                    ]
                ),

                Q(
                    'bool',
                    must=[
                        Q('term', _index=AlbumDocument.Index.name),
                        Q('match', name={'query': search_string, 'boost': 4})
                    ]
                ),

                Q(
                    'bool',
                    must=[
                        Q('term', _index=TrackDocument.Index.name),
                        Q('match', name={'query': search_string, 'boost': 2})
                    ]
                ),
                
                Q('multi_match', query=search_string, fields=['album.name'], lenient=True),
                
                Q(
                    'bool',
                    must=[
                        Q('terms', _index=[TrackDocument.Index.name,AlbumDocument.Index.name]), 
                        Q('nested', path='artists', query=Q('match', **{'artists.name': search_string}))
                    ]
                )
            ],
            minimum_should_match=1
        )
        response = s.execute()
        hits = defaultdict(list)
        track_ids = []
        album_ids = []
        artist_ids = []
        for i, hit in enumerate(response):
            logging.warning(hit)
            item = hit.to_dict()     
            item['index_name'] = hit.meta.index 
            item['id'] = hit.meta.id     
            item['score'] = hit.meta.score
            if i == 0:
                if item['index_name'] == 'artist':
                    raw_artist = Artist.objects.filter(id=item['id']).first()
                    artist = ArtistItemSerializer(raw_artist).data
                    item['albums'] = artist.get('albums')
                    item['cover'] = artist.get('cover')
                if item['index_name'] == 'album':
                    raw_album = Album.objects.filter(id=item['id']).prefetch_related('artists').first()
                    album = AlbumItemSerializer(raw_album).data
                    item=album
                    item['index_name'] = hit.meta.index 
                hits['best_result'] = item
            else:
                if item['index_name'] == 'tracks':  
                    track_ids.append(item['id'])
                elif item['index_name'] == 'artist':
                    artist_ids.append(item['id'])
                elif item['index_name'] == 'album':
                    album_ids.append(item['id'])


        tracks = Track.objects.filter(id__in=track_ids).select_related('album').prefetch_related('artists','album__artists')
        hits['tracks'] = TrackListSerializer(tracks,many=True).data

        artists = Artist.objects.filter(id__in=artist_ids).prefetch_related('albums')
        hits['artists'] = ArtistListSerializer(artists,many=True).data

        albums = Album.objects.filter(id__in=album_ids).prefetch_related('artists')
        hits['albums'] = AlbumListSerializer(albums,many=True).data
        return Response(
            hits
        )
    
class AudioStreamView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,filepath):
        response = HttpResponse()
        response["X-Accel-Redirect"] = f"/protected/tracks/{filepath}"
        response["Content-Type"] = "audio/mpeg"
        return response