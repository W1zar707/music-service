import jwt
from rest_framework.authentication import BaseAuthentication
from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
User = get_user_model()
class JWTCookieAuthentitication(BaseAuthentication):
    def authenticate(self,request):
        access = request.COOKIES.get('access_token')
        if not access:
            return None
        
        try:
            payload = jwt.decode(access, settings.SECRET_KEY)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Access token истек')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Невалидный токен')
        
        try:
            user = User.objects.get(id=payload['user_id'])
        except User.DoesNotExist:
            raise AuthenticationFailed('Пользователь не найден')
        
        return (user,None)