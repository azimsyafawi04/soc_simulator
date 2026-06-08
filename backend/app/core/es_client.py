from elasticsearch import Elasticsearch
import os

ES_URL = os.getenv("ELASTICSEARCH_URL", "http://localhost:9200")

# In production, authentication and SSL should be configured here
es_client = Elasticsearch([ES_URL])

def get_es_client():
    return es_client

def index_log(index_name: str, document: dict):
    """Index a single log document into Elasticsearch."""
    try:
        response = es_client.index(index=index_name, document=document)
        return response
    except Exception as e:
        print(f"Error indexing to Elasticsearch: {e}")
        return None
