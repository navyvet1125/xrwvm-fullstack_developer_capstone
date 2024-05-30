# Uncomment the imports below before you add the function code
import requests
import os
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")


def get_request(endpoint, **kwargs) -> dict:
    """Function to send get request to backend"""
    params = ""
    if kwargs:
        for key,value in kwargs.items():
            params=params+key+"="+value+"&"

    request_url = backend_url+endpoint+"?"+params

    print(f"GET from {request_url} ")
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url, timeout=30)
        return response.json()
    except Exception as err:
        # If any error occurs
        print(f"Network exception occurred: {err}")
        return {"error": err}


def analyze_review_sentiments(text) -> dict:
    """Function to send review to sentiment analyzer"""
    request_url = sentiment_analyzer_url+"analyze/"+text
    try:
        # Call get method of requests library with URL and parameters
        response = requests.get(request_url, timeout=30)
        return response.json()
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")
        return {"error": "Network exception occurred"}


def post_review(data_dict) -> dict:
    """Function to send review to backend"""
    request_url = backend_url+"/insert_review"
    try:
        response = requests.post(request_url,json=data_dict, timeout=30)
        return response.json()
    except Exception:
        print("Network exception occurred")
        return {"error": "Network exception occurred"}
