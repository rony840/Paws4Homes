from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login_user, name='login'),
    path('submit-dog-listing/', views.submit_dog_listing, name='submit_dog_listing'),
    path('logout/', views.logout_user, name='logout'),
    path('get-dog-listings/', views.get_dog_listings, name='get_dog_listings'),
    path('get-user-dog-listings/', views.get_user_dog_listings, name='get_user_dog_listings'),
    path('update-dog-listing/<int:listing_id>/', views.update_dog_listing, name='update_dog_listing'),
    path('delete-dog-listing/<int:listing_id>/', views.delete_dog_listing, name='delete_dog_listing'),
    path('get-dog-listing/<int:listing_id>/', views.get_dog_listing, name='get_dog_listing'),
    path('get-user-details/', views.get_user_details, name='get_user_details'),
    path('create-adoption-application/', views.create_adoption_application, name='create_adoption_application'),
    path('send_message/', views.send_message, name='send_message'),
    path('get_messages/', views.get_messages, name='get_messages'),
    path('get_messages/<int:user_id>/', views.get_messages, name='get_messages_with_id'),
    path('applications/<int:application_id>/', views.get_adoption_application, name='get_adoption_application'),
    path('user_profile/<int:user_id>/', views.get_user_profile, name='get_user_profile'),
    path('mark_messages_as_read/<int:receiver_id>/', views.mark_messages_as_read, name='mark_messages_as_read'),
    path('get_unread_message_count/', views.get_unread_message_count, name='get_unread_message_count'),
    path('update_user_profile/<int:user_id>/', views.user_profile_update, name='user_profile_update'),
    path('change_password/', views.change_password, name='change_password'),
    path('upload-profile-picture/', views.upload_profile_picture, name= 'upload_profile_picture'),
    path('match-dog/', views.match_dog, name='match_dog'),
]
