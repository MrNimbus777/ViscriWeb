from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import base64
from django.db import connections
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        credentials = request.headers.get("Authorization")
        decode = base64.b64decode(credentials).decode('utf-8').split(":")
        login = decode[0]
        passw = decode[1]
        try:
            User.objects.get(username=login)
            return JsonResponse({"status" : "existing"}, status=200)
        except:
            User.objects.create_user(username=login, password=passw)
            return JsonResponse({"status" : "success", "user" : login}, status=200)
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        credentials = request.headers.get("Authorization")
        decode = base64.b64decode(credentials).decode('utf-8').split(":")
        login = decode[0]
        passw = decode[1]
        try:
            u = User.objects.get(username=login)
            if(u.check_password(passw)):
                return JsonResponse({"status" : "success", "user" : login}, status=200)
            else: return JsonResponse({"status" : "wrong_password"}, status=200)
        except: return JsonResponse({"status" : "not_existing"}, status=200)
    return JsonResponse({"error": "Invalid request method"}, status=400)