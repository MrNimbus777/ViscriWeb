from django.http import JsonResponse
import json
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from .models import *
from .forms import *
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
import base64
import secrets
import time
import os

def currentTimeMills():
    return int(time.time())

def deleteSession(token):
    try:
        s = Sessions.objects.get(token=token)
        s.delete()
    except:
        return
            
def createSession(user:str):
    try:
        User.objects.get(username=user)
        token = secrets.token_urlsafe(32)
        session = Sessions(token=token, user=user, created=currentTimeMills())
        session.save()
        return token
    except:
        return None

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
            token = createSession(user=login)
            p = UserProfile(user=login)
            p.save()
            return JsonResponse({"status" : "success", "session_token" : token}, status=200)
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
                token = createSession(user=login)
                return JsonResponse({"status" : "success", "session_token" : token}, status=200)
            else: return JsonResponse({"status" : "wrong_password"}, status=200)
        except: return JsonResponse({"status" : "not_existing"}, status=200)
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def check_token(request):
    if request.method == 'POST':
        token = request.headers.get("token")
        try:
            session = Sessions.objects.get(token=token)
            if currentTimeMills() - session.created <= 2_678_400:
                session.created = currentTimeMills()
                session.save()
                return JsonResponse({"status" : "valid"}, status=200)
            else:
                session.delete() 
                return JsonResponse({"status" : "invalid"}, status=200)
        except: return JsonResponse({"status" : "invalid"}, status=200)
    return JsonResponse({"error": "Invalid request method"}, status=400)

@csrf_exempt
def upload_avatar(request):
    if request.method == 'POST':
        token = request.headers.get('token')
        print(token)
        try:
            s = Sessions.objects.get(token=token)
            p = UserProfile.objects.get(user=s.user)
            avatar = request.FILES.get('avatar')
            if avatar:
                if p.avatar:
                    if os.path.isfile(p.avatar.path):
                        os.remove(p.avatar.path)
                v = avatar.name.split(".")
                p.avatar.save(f'{token}.{v[len(v)-1]}', avatar, save=True)
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'no file'}, status=200)
        except:
            return JsonResponse({'status': 'error', 'error': 'Something went wrong.'}, status=405)
    return JsonResponse({'status': 'error', 'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def get_user_data(request):
    if request.method == 'POST':
        token = request.headers.get("token")
        options = json.loads(request.body).get("options", [])
        #try:
        session = Sessions.objects.get(token=token)
        u = User.objects.get(username=session.user)
        p = UserProfile.objects.get(user=u.username)
        response = {'status': 'success'}
        if 'username' in options:
            response['username'] = u.username
        if 'bio' in options:
            response['bio'] = p.bio
        if 'image' in options:
            if p.avatar:    
                avatar_path = p.avatar.path
                try:
                    response['image'] = base64.b64encode(default_storage.open(avatar_path, 'rb').read()).decode('utf-8')
                    response['format'] = avatar_path.split('.')[-1]
                except:
                    response['image'] = 'none'
            else: response['image'] = 'none'
        if 'likes' in options:
            response['likes'] = p.likes
        if 'dislikes' in options:
            response['dislikes'] = p.dislikes
        return JsonResponse(response, status=200)
        #except: return JsonResponse({"status" : "invalid"}, status=200)
    return JsonResponse({"error": "Invalid request method"}, status=400)