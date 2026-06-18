import uuid,secrets
import jwt
from datetime import datetime,timedelta
from hashlib import sha256
from .redis import r
from django.conf import settings
import json

def generate_access_token(user_id:int) -> str:
    return jwt.encode(
        {
            'user_id':user_id,
            'exp':datetime.utcnow()+timedelta(minutes=15),
            'jti':str(uuid.uuid4())
        },
        settings.SECRET_KEY,
        algorithm='HS256'
    )

def invalidate_family(family_id:str):
    members = r.smembers(f'family:{family_id}')
    for i in members:
        r.delete(f'rt:{i}')
    r.delete(f'family:{family_id}')

def create_token_family(user,request):
    family_id = str(uuid.uuid4())
    rt = secrets.token_urlsafe(32)
    rt_hash = sha256(rt)

    r.set(f'{rt_hash}',json.dumps({
        'user_id': user.id,
        'family_id': family_id,
        'is_used': False
    }),ex=30*86400)
    
    r.sadd(f'family:{family_id}',rt_hash)
    r.expire(f'family:{family_id}',30*86400)

    access = generate_access_token(user.id)
    return access, rt

def refresh_token(rt:str)->tuple[str,str]|None:
    rt_hash = sha256(rt)
    raw = r.get(f'rt:{rt_hash}')

    if not raw:
        return None
    
    data = json.loads(raw)

    if data['is_used']:
        invalidate_family(data['family_id'])
        return None
    
    data['is_used'] = True
    r.set(f'rt:{rt_hash}', json.dumps(data))

    new_rt = secrets.token_urlsafe(32)
    new_rt_hash = sha256(new_rt)

    r.set(f'{rt_hash}',json.dumps({
        'user_id': data['user_id'],
        'family_id': data['family_id'],
        'is_used': False
    }),ex=30*86400)
    r.sadd(f'family:{data['family_id']}',new_rt_hash)

    access = generate_access_token(data['user_id'])
    return access, new_rt

def logout_token(rt:str):
    rt_hash = sha256(rt)
    raw = r.get(f'rt:{rt_hash}')
    if not raw:
        return
    
    data = json.loads(raw)
    invalidate_family(data['family_id'])