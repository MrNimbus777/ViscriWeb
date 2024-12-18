from django.db import models
from django.contrib.auth.models import User

class Sessions(models.Model):
    token=models.CharField(max_length=64, primary_key=True, unique=True)
    user=models.CharField(max_length=150)
    created=models.PositiveBigIntegerField()
    
    class Meta:
        db_table = 'sessions'

class UserProfile(models.Model):
    user = models.CharField(unique=True, blank=False, null=False, primary_key=True, max_length=150)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    

    def __str__(self):
        return self.user
    
    class Meta:
        db_table = 'user_profiles'