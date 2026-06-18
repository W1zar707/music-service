import redis
import os
r = redis.Redis(
    host = 'redis',
    port = 6379,
    password = os.getenv("REDIS_PASSWORD"),
    db = 0,
    decode_responses=True,
)