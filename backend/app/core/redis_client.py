import redis
import os
import json

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

redis_client = redis.from_url(REDIS_URL, decode_responses=True)

def push_to_queue(queue_name: str, data: dict):
    """Push a JSON-serializable dictionary to a Redis List (Queue)."""
    try:
        redis_client.rpush(queue_name, json.dumps(data))
        return True
    except Exception as e:
        print(f"Error pushing to Redis queue {queue_name}: {e}")
        return False

def pop_from_queue(queue_name: str, timeout=0):
    """Pop an item from the Redis List (blocking)."""
    try:
        result = redis_client.blpop(queue_name, timeout=timeout)
        if result:
            return json.loads(result[1])
        return None
    except Exception as e:
        print(f"Error popping from Redis queue {queue_name}: {e}")
        return None
