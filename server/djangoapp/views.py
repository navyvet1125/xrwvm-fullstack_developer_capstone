"""Views for the djangoapp application"""

import logging
import json

# from django.shortcuts import render
# from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
# from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
# from django.contrib import messages
# from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate
from .models import CarMake, CarModel
from .restapis import get_request, analyze_review_sentiments, post_review, search_cars


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request) -> JsonResponse:
    """Login a user"""
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)


# Create a `logout_request` view to handle sign out request
def logout_request(request) -> JsonResponse:
    """Logout a user"""
    logout(request)
    data = {"userName": ""}
    return JsonResponse(data)


@csrf_exempt
def registration(request) -> JsonResponse:
    """Register a new user"""

    # context = {}

    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']
    username_exist = False
    # email_exist = False
    try:
        # Check if user already exists
        User.objects.get(username=username)
        username_exist = True
    except Exception:
        # If not, simply log this is a new user
        logger.debug("{} is new user".format(username))

    # If it is a new user
    if not username_exist:
        # Create user in auth_user table
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email
        )
        # Login the user and redirect to list page
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
        return JsonResponse(data)
    else:
        data = {"userName": username, "error": "Already Registered"}
        return JsonResponse(data)


def get_cars(request) -> JsonResponse:
    """Get cars from the database"""
    count = CarMake.objects.filter().count()
    print(count)
    if count == 0:
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name
        })
    return JsonResponse({"CarModels": cars})


def get_dealerships(request, state="All") -> JsonResponse:
    """Get dealerships from the database"""
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/"+state
    dealerships = get_request(endpoint)
    return JsonResponse({"status": 200, "dealers": dealerships})


def get_dealer_reviews(request, dealer_id) -> JsonResponse:
    """Get reviews for a dealer"""
    if dealer_id:
        endpoint = f"/fetchReviews/dealer/{dealer_id}"
        reviews = get_request(endpoint)
        try:
            for review in reviews:
                response = analyze_review_sentiments(review['review'])
                review['sentiment'] = response['sentiment']
            return JsonResponse({"status": 200, "reviews": reviews})
        except Exception:
            return JsonResponse({"status": 404, "error": "Bad Request"})
    else:
        return JsonResponse({"status": 404, "error": "Bad Request"})


def get_dealer_details(request, dealer_id) -> JsonResponse:
    """Get reviews for a dealer"""
    if dealer_id:
        endpoint = f"/fetchDealer/{dealer_id}"
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    else:
        return JsonResponse({"status": 404, "error": "Bad Request"})


def add_review(request) -> JsonResponse:
    """Add review for a dealer"""
    if request.user.is_anonymous is False:
        data = json.loads(request.body)
        try:
            response = post_review(data)
            return JsonResponse({"status": 200, "response": response})
        except Exception:
            return JsonResponse({
                "status": 401,
                "message": "Error in posting review"
            })
    else:
        return JsonResponse({"status": 403, "message": "Unauthorized"})


def get_inventory(request, dealer_id) -> JsonResponse:
    """Get inventory for a dealer"""
    data = request.GET
    print(request)
    print(f"Dealer ID: {dealer_id}")

    if dealer_id:
        if 'year' in data:
            endpoint = f"/carsbyyear/{dealer_id}/{data['year']}"
        elif 'make' in data:
            endpoint = f"/carsbymake/{dealer_id}/{data['make']}"
        elif 'model' in data:
            endpoint = f"/carsbymodel/{dealer_id}/{data['model']}"
        elif 'mileage' in data:
            endpoint = f"/carsbymaxmileage/{dealer_id}/{data['mileage']}"
        elif 'price' in data:
            endpoint = f"/carsbyprice/{dealer_id}/{data['price']}"
        else:
            endpoint = f"/cars/{dealer_id}"
        print(f"Endpoint: {endpoint}")
        cars = search_cars(endpoint)
        return JsonResponse({"status": 200, "cars": cars})
    else:
        return JsonResponse({"status": 400, "message": "Bad Request"})
