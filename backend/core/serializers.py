from rest_framework import serializers
class ArtistListSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    avatar = serializers.ImageField(required=False)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
    
class TrackAlbumSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    artists = ArtistListSerializer(many=True)
    path = serializers.FileField(required=False)
    order = serializers.IntegerField()
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data

class AlbumItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    artists = ArtistListSerializer(many=True)
    tracks = serializers.SerializerMethodField()
    cover = serializers.ImageField(required=False,)

    def get_tracks(self,obj):
        tracks = obj.tracks.all().order_by('order')
        return TrackAlbumSerializer(tracks, many=True).data
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data

class AlbumListSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=200)
    artists = ArtistListSerializer(many=True)
    cover = serializers.ImageField(required=False,)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
    
class ArtistAlbumSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=200)
    cover = serializers.ImageField(required=False,)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
class ArtistItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    cover = serializers.ImageField(required=False,)
    albums = ArtistAlbumSerializer(many=True, read_only=True)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
    
class TrackListSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    album = AlbumListSerializer()
    artists = ArtistListSerializer(many=True)
    path = serializers.FileField(required=False,)
    cover = serializers.ImageField(required=False,)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['cover'] = instance.album.cover.url
        return data

