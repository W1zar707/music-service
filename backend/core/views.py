from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from django_elasticsearch_dsl.search import Search
from .documents import *
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
    
class SearchView(APIView):
    def post(self, request):
        search_string = request.data['search']
        s = Search().index(
            TrackDocument.Index.name,
            AlbumDocument.Index.name,
            ArtistDocument.Index.name
        )
        s = s.query(
            "multi_match", 
            query=search_string, 
        )
        response = s.execute()
        hits = []
        for hit in response:
            item = hit.to_dict()     
            item['index_name'] = hit.meta.index 
            item['id'] = hit.meta.id     
            hits.append(item)
        return Response(hits)