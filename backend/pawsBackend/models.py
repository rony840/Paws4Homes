from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    company_name = models.CharField(max_length=255, blank=True, null=True)
    is_business_account = models.BooleanField(default=False)
    profile_image = models.CharField(
        max_length=255, 
        default='',
        blank=True
    )

    def save(self, *args, **kwargs):
        # Only set the profile image if it's empty
        if not self.profile_image:
            if self.is_business_account:
                self.profile_image = 'images/defaultBusiness.png'
            else:
                self.profile_image = 'images/defaultCustomer.png'
        super(UserProfile, self).save(*args, **kwargs)

class DogListing(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    breed = models.CharField(max_length=255)
    age = models.IntegerField()
    age_unit = models.CharField(max_length=20)
    color = models.CharField(max_length=50)
    size = models.CharField(max_length=50)
    bio = models.TextField(blank=True)
    gender = models.CharField(max_length=50)
    images = models.JSONField()  # Store image URLs or paths in JSON format
    date_added = models.DateTimeField(auto_now_add=True)

class AdoptionApplication(models.Model):
    dog = models.ForeignKey(DogListing, on_delete=models.CASCADE, related_name='applications')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    why_adopt = models.TextField()
    alone_time = models.CharField(max_length=50)
    house_type = models.CharField(max_length=50)
    home_owner = models.CharField(max_length=3)  
    owned_dog_before = models.CharField(max_length=3)  
    additional_note = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Message(models.Model):
    sender = models.ForeignKey(User, related_name='sent_messages', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.sender} to {self.receiver} at {self.timestamp}"
