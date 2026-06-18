from rest_framework import serializers



class AlbumListSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField(max_length=200)
    cover = serializers.ImageField(required=False)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data

class ArtistListSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    avatar = serializers.ImageField(required=False)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data
    
class ArtistItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=255)
    avatar = serializers.ImageField(required=False)
    albums = AlbumListSerializer(many=True, read_only=True)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        return data