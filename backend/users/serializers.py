from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password as django_validate_password
from django.core.exceptions import ValidationError
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from core.serializers import *
User = get_user_model()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150,required=True)
    password = serializers.CharField(write_only=True,required=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Неверный логин или пароль")
        data['user'] = user
        return data



class RegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    password_confirm = serializers.CharField(write_only=True, required=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Пользователь с таким именем уже существует.")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже зарегистрирован.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Пароли не совпадают."})

        user_instance = User(username=attrs.get('username'), email=attrs.get('email'))
        try:
            django_validate_password(attrs['password'], user=user_instance)
        except ValidationError as error:
            raise serializers.ValidationError({"password": list(error.messages)})

        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    
class ValidateSerializer(serializers.Serializer):
    username = serializers.CharField(min_length=3,max_length=30,required=False,write_only=True)
    email = serializers.EmailField(required=False,write_only=True)
    password = serializers.CharField(required=False,write_only=True)

    def validate_username(self,value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Имя занято')
        return value

    def validate_email(self,value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email уже используется')
        return value

    def validate_password(self,value):
        try:
            django_validate_password(value)
        except ValidateSerializer as e:
            raise serializers.ValidationError(e.message)
        return value

class ProfileSerializer(serializers.Serializer):
    username = serializers.CharField()

    def to_representation(self, instance):
        return super().to_representation(instance)
    
