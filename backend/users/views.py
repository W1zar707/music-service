from django.shortcuts import render
from rest_framework import generics
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework import status
from .redis import r
from .tokens import create_token_family,refresh_token, logout_token
# Create your views here.
class RegistrationView(generics.GenericAPIView):
    serializer_class = RegistrationSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        access, rt = create_token_family(user,request)

        response = Response({
            'detail': 'registration success'
        },status=status.HTTP_201_CREATED)

        response.set_cookie('access_token',
                            access,
                            httponly=True,
                            samesite='Strict',
                            max_age=15*60)

        response.set_cookie('refresh_token',
                            rt,
                            httponly=True,
                            samesite='Strict',
                            max_age=30*86400)

        return response
    
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=username, password=password)

        if not user:
            raise AuthenticationFailed("Неверное имя пользователя или пароль.")

        access, rt = create_token_family(user,request)

        response = Response({
            "detail": "login success"
        }, status=status.HTTP_200_OK)

        response.set_cookie('access_token',
                            access,
                            httponly=True,
                            samesite='Strict',
                            max_age=15*60)
        
        response.set_cookie('refresh_token',
                            rt,
                            httponly=True,
                            samesite='Strict',
                            max_age=30*86400)

        return response
    
class TokenRefreshView(generics.GenericAPIView):
    def post(self,request):
        rt = request.COOKIES.get('refresh_token')
        if not rt:
            return Response({'detail':'74'},status=status.HTTP_401_UNAUTHORIZED)
        
        result = refresh_token(rt)

        if not result:
            return Response({'detail':'79'},status=status.HTTP_401_UNAUTHORIZED)
        
        access, new_rt = result

        response = Response({
            'detail': 'refresh success'
        })

        response.set_cookie('access_token',
                            access,
                            httponly=True,
                            samesite='Strict',
                            max_age=15*60)
        
        response.set_cookie('refresh_token',
                            new_rt,
                            httponly=True,
                            samesite='Strict',
                            max_age=30*86400)

        return response

class LogoutView(generics.GenericAPIView):
    def post(self,request):
        rt = request.COOKIES.get('refresh_token')
        if rt:
            logout_token(rt)

        response = Response({
            'detail':'logout success'
        })
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

class ValidateView(generics.GenericAPIView):
    def post(self, request):
        if 'username' in request.data:
            username = request.data['username']
            if User.objects.filter(username=username).exists():
                return Response({
                    'username': 'Имя занято'
                },status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            return Response({
                'username': None
            },status=status.HTTP_200_OK)
            
        if 'email' in request.data:
            email = request.data['email']
            if User.objects.filter(email=email).exists():
                return Response({
                    'email':'Email уже используется'
                },status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            return Response({
                'email': None
            },status=status.HTTP_200_OK)
            
        if 'password' in request.data:
            password= request.data['password']
            try:
                validate_password(password)
            except ValidationError as e:
                return Response({
                    'password':list(e.messages)
                },status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            return Response({
                'password': None
            },status=status.HTTP_200_OK)

        return Response({
            'error': None
        })
