from django.shortcuts import render
from pawsBackend.models import UserProfile, DogListing
import json
from django.http import JsonResponse, HttpResponseBadRequest, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import logout
from .models import DogListing, AdoptionApplication, Message
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.conf import settings
import logging
from django.core.files.storage import default_storage

logger = logging.getLogger(__name__)

@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('email')  
        password = data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            auth_login(request, user) 
            user_profile = UserProfile.objects.get(user=user)
            is_business_account = user_profile.is_business_account if user_profile else False
            print(user.id)
            return JsonResponse({
                'success': True, 
                'isBusiness': is_business_account,
                'userId': user.id  # Include the user's ID in the response
            }, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def logout_user(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': 'Logged out successfully'}, status=200)

    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt  
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        re_password = data.get('rePassword')
        phone_number = data.get('phone')    
        company_or_full_name = data.get('companyNameOrFullName')  

        print(data)

        # Check if the passwords match
        if password != re_password:
            print("Passwords do not match")
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        # Check if the email is already in use
        if User.objects.filter(email=email).exists():
            print("Email is already in use")
            return JsonResponse({'error': 'Email is already in use'}, status=400)

        # Validate the password
        try:
            validate_password(password)
        except ValidationError as e:
            print(e.messages)
            return JsonResponse({'error': e.messages}, status=400)

        # Create the user account
        user = User.objects.create_user(username=email, email=email, password=password)

        # Decide how to store the company or full name
        if company_or_full_name:
            # If it's a business account
            UserProfile.objects.create(
                user=user, 
                phone_number=phone_number,
                company_name=company_or_full_name,
                is_business_account=True
            )
        else:
            # Handle as individual account
            first_name = data.get('firstname')
            last_name = data.get('lastname')
            user.first_name = first_name
            user.last_name = last_name
            user.save()
            UserProfile.objects.create(user=user, phone_number=phone_number)

        return JsonResponse({'success': 'User created successfully'}, status=201)

    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def submit_dog_listing(request):
    if request.method == 'POST':
        print("Request = post")
        print(request.user)
        data = json.loads(request.body)

        # Perform checks for all required fields including the new ones
        required_fields = ['name', 'breed', 'age', 'ageUnit', 'color', 'size', 'bio', 'gender', 'images']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'{field} is required'}, status=400)
        
        # Check if at least one image is uploaded
        images = data.get('images')
        if not images or not any(images):
            return JsonResponse({'error': 'At least one image is required'}, status=400)

        user = request.user  # Get the logged-in user
        
        # Create a new DogListing instance and save the data
        dog_listing = DogListing(
            user=user,
            name=data.get('name'),
            breed=data.get('breed'),
            age=data.get('age'),
            age_unit=data.get('ageUnit'),
            color=data.get('color'),
            size=data.get('size'),
            bio=data.get('bio'),
            gender=data.get('gender'),
            images=data.get('images')
        )
        print(data)
        dog_listing.save()

        return JsonResponse({'success': 'Dog listing created successfully'}, status=201)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
def get_dog_listings(request):
    if request.method == 'GET':
        listings = DogListing.objects.all()  
        listings_data = [{
            'id': listing.id,
            'name': listing.name,
            'breed': listing.breed,
            'age': listing.age,
            'age_unit': listing.age_unit,
            'color': listing.color,
            'size': listing.size,
            'bio': listing.bio,
            'gender': listing.gender,
            'images': listing.images,  
        } for listing in listings]
        return JsonResponse(listings_data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

@login_required
def get_user_dog_listings(request):
    if request.method == 'GET':
        # Filter listings by the logged-in user
        user_listings = DogListing.objects.filter(user=request.user)
        listings_data = [{
            'id': listing.id,
            'name': listing.name,
            'breed': listing.breed,
            'age': listing.age,
            'age_unit': listing.age_unit,
            'color': listing.color,
            'size': listing.size,
            'bio': listing.bio,
            'gender': listing.gender,
            'images': listing.images,  
        } for listing in user_listings]
        return JsonResponse(listings_data, safe=False)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
@login_required
def update_dog_listing(request, listing_id):
    if request.method == 'PUT':
        data = json.loads(request.body)
        try:
            dog_listing = DogListing.objects.get(id=listing_id, user=request.user)
            # Update fields
            for field, value in data.items():
                setattr(dog_listing, field, value)
            dog_listing.save()
            return JsonResponse({'success': 'Listing updated successfully'}, status=200)
        except DogListing.DoesNotExist:
            return JsonResponse({'error': 'Listing not found'}, status=404)

    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
@login_required
def delete_dog_listing(request, listing_id):
    if request.method == 'DELETE':
        try:
            dog_listing = DogListing.objects.get(id=listing_id, user=request.user)
            dog_listing.delete()
            return JsonResponse({'success': 'Listing deleted successfully'}, status=200)
        except DogListing.DoesNotExist:
            return JsonResponse({'error': 'Listing not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

def get_dog_listing(request, listing_id):
    if request.method == 'GET':
        try:
            listing = DogListing.objects.get(id=listing_id)
            listing_data = {
                'id': listing.id,
                'name': listing.name,
                'breed': listing.breed,
                'age': listing.age,
                'age_unit': listing.age_unit,
                'color': listing.color,
                'size': listing.size,
                'bio': listing.bio,
                'gender': listing.gender,
                'images': listing.images, 
                'date_added': listing.date_added.strftime("%m-%d-%Y")  
            }
            return JsonResponse(listing_data)
        except DogListing.DoesNotExist:
            return JsonResponse({'error': 'Listing not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)
    
@login_required
def get_user_details(request):
    user = request.user
    user_profile = UserProfile.objects.get(user=user)

    return JsonResponse({
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'phone_number': user_profile.phone_number
    })

@csrf_exempt
def create_adoption_application(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Fetch the DogListing object using the dogID
        dog_id = data.get('dogID')
        try:
            dog = DogListing.objects.get(id=dog_id)
        except DogListing.DoesNotExist:
            return JsonResponse({'error': 'Dog not found'}, status=404)

        # Create the AdoptionApplication object
        application = AdoptionApplication.objects.create(
            dog=dog,  
            user=request.user,  
            first_name=data['firstName'],
            last_name=data['lastName'],
            email=data['email'],
            phone_number=data['phone'],
            why_adopt=data['whyAdopt'],
            alone_time=data['aloneTime'],
            house_type=data['houseType'],
            home_owner=data['homeOwner'],
            owned_dog_before=data['dogOwner'],
            additional_note=data.get('additionalNote', '')  
        )

        application_id = application.id  
        application_url = f"/applications/{application_id}"  

        initial_message_content = f"New adoption application from {request.user.username} for {dog.name}. <a href='{application_url}'>Click here to view the application.</a>"
        Message.objects.create(
            sender=request.user,
            receiver=dog.user,
            content=initial_message_content
        )

        return JsonResponse({'success': 'Application submitted successfully'})
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
@login_required
def send_message(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            receiver_id = data['receiver']
            content = data['content']

            if not receiver_id or not content:
                return JsonResponse({'error': 'Missing reciever or content'}, status =400)

            sender = request.user  # Use the authenticated user as the sender
            receiver = User.objects.get(id=receiver_id)

            message = Message.objects.create(
                sender=sender,
                receiver=receiver,
                content=content
            )
            return JsonResponse({'success': 'Message sent successfully'}, status=200)

        except User.DoesNotExist:
            return JsonResponse({'error': 'Receiver not found'}, status=404)
        except json.JSONDecodeError as e:
            return JsonResponse({'error': 'Invalid JSON: ' + str(e)}, status=400)
        except Exception as e:
            print("Error in send_message:", e)
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
def get_messages(request, user_id=None):
    user = request.user

    # Decide the query based on whether a specific user_id is given
    messages = (Message.objects
                .filter(Q(sender=user) & Q(receiver_id=user_id) | Q(sender_id=user_id) & Q(receiver=user))
                .order_by('-timestamp') if user_id else
                Message.objects
                .filter(Q(sender=user) | Q(receiver=user))
                .order_by('-timestamp'))

    messages_data = []
    for message in messages:
        sender_profile = UserProfile.objects.get(user=message.sender)

        # Decide the sender's name based on account type
        sender_name = sender_profile.company_name if sender_profile.is_business_account else f"{message.sender.first_name} {message.sender.last_name}"

        message_data = {
            'id': message.id,
            'sender_id': message.sender.id,
            'receiver_id': message.receiver.id,
            'sender_name': sender_name,
            'content': message.content,
            'timestamp': message.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            'is_read': message.is_read,
        }

        # If a specific user_id is provided, add the profile image of the receiver
        if user_id:
            # The receiver is the other person in the conversation
            receiver = message.receiver if message.sender == user else message.sender
            receiver_profile = UserProfile.objects.get(user=receiver)

            # Get the full URL for the receiver's profile image
            receiver_profile_pic = request.build_absolute_uri(settings.STATIC_URL + receiver_profile.profile_image)
            message_data['receiver_profile_pic'] = receiver_profile_pic

        messages_data.append(message_data)

    return JsonResponse(messages_data, safe=False, status=200)



@login_required
def get_adoption_application(request, application_id):
    # Fetch the application, or return 404 if not found
    application = get_object_or_404(AdoptionApplication, pk=application_id)

    dog = application.dog

    owner_profile = UserProfile.objects.get(user=dog.user)

    application_data = {
        "id": application.id,
        "applicant_id": application.user.id,
        "dog": {
            "id": dog.id,
            "user_id": dog.user.id,
            "name": dog.name,
            "breed": dog.breed,
            "age": dog.age,
            "age_unit": dog.age_unit,
            "color": dog.color,
            "size": dog.size,
            "bio": dog.bio,
            "gender": dog.gender,
            "images": dog.images,
            "date_added": dog.date_added.strftime("%Y-%m-%d %H:%M:%S")
        },

        "owner_contact_info": {
            "email": dog.user.email,
            "phone_number": owner_profile.phone_number
        },

        "first_name": application.first_name,
        "last_name": application.last_name,
        "email": application.email,
        "phone_number": application.phone_number,
        "why_adopt": application.why_adopt,
        "alone_time": application.alone_time,
        "house_type": application.house_type,
        "home_owner": application.home_owner,
        "owned_dog_before": application.owned_dog_before,
        "additional_note": application.additional_note
    }

    return JsonResponse(application_data)

@login_required
def get_user_profile(request, user_id):
    user = get_object_or_404(User, pk=user_id)
    user_profile = get_object_or_404(UserProfile, user=user)
    
    profile_image_url = settings.STATIC_URL + user_profile.profile_image

    data = {
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'phone_number': user_profile.phone_number,
        'company_name': user_profile.company_name,
        'is_business_account': user_profile.is_business_account,
        'profile_image': request.build_absolute_uri(profile_image_url)
    }
    return JsonResponse(data)

@csrf_exempt
@login_required
def mark_messages_as_read(request, receiver_id):
    # Mark all messages in the conversation as read
    Message.objects.filter(sender_id=receiver_id, receiver=request.user, is_read=False).update(is_read=True)
    return JsonResponse({'success': True})

@login_required
def get_unread_message_count(request):
    unread_count = Message.objects.filter(receiver=request.user, is_read=False).count()
    return JsonResponse({'unread_count': unread_count})

@csrf_exempt
@login_required
def user_profile_update(request, user_id):
    print('request user id', request.user.id, ' user_id=', user_id)

    if request.method != 'PUT':
        return HttpResponseNotAllowed(['PUT'])
    
    user_id = int(user_id)


    try:
        data = json.loads(request.body)
        
        if request.user.id != user_id:
            return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)

        user = User.objects.get(pk=user_id)
        profile, created = UserProfile.objects.get_or_create(user=user)

        # Update User fields
        user.first_name = data.get('first_name', user.first_name)
        user.last_name = data.get('last_name', user.last_name)
        user.save()

        # Update UserProfile fields
        if profile.is_business_account:
            profile.company_name = data.get('company_name', profile.company_name)
        profile.phone_number = data.get('phone_number', profile.phone_number)
        profile.save()

        return JsonResponse({'status': 'success', 'message': 'Profile updated successfully.'})

    except User.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'User not found.'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'status': 'error', 'message': 'Invalid JSON format.'}, status=400)
    except Exception as e:
        # Log the exception for debugging purposes
        # e.g., logger.error(f"Error updating user profile: {str(e)}")
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

@csrf_exempt
@login_required
def change_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        new_password = data.get('newPassword')

        # Validate the new password
        try:
            validate_password(new_password)
        except ValidationError as e:
            return JsonResponse({'error': e.messages}, status=400)

        try:
            user = request.user
            user.set_password(new_password)
            user.save()

            # Invalidate the current session after changing the password
            logout(request)

            return JsonResponse({'success': 'Password changed successfully. Please log in again.'})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
@login_required
@csrf_exempt
def upload_profile_picture(request):
    if request.method == 'POST' and request.FILES['image']:
        image = request.FILES['image']
        file_path = default_storage.save('path/to/save/image', image)
        
        # Update the user's profile picture URL in the database
        user_profile = UserProfile.objects.get(user=request.user)
        user_profile.profile_image = file_path
        user_profile.save()

        return JsonResponse({'success': True, 'image_url': file_path})
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

breed_characteristics = {
    'Husky': {
    'activityLevel': 'high',
    'sizePreference': 'large',
    'otherPets': 'yes',
    'childrenAtHome': 'yes',
    'furPreference': 'long',
    'sheddingTolerance': 'high',
    'livingSituation': 'house_with_yard',
    'purpose': 'companionship'
},

    'Golden Retriever' : {
    'activityLevel': 'moderate',
    'sizePreference': 'large',
    'otherPets': 'yes',
    'childrenAtHome': 'yes',
    'furPreference': 'long',
    'sheddingTolerance': 'high',
    'livingSituation': 'house_with_yard',
    'purpose': 'companionship'
},

'French Bulldog': {
    'activityLevel': 'low',
    'sizePreference': 'small',
    'otherPets': 'yes',
    'childrenAtHome': 'yes',
    'furPreference': 'short',
    'sheddingTolerance': 'minimal',
    'livingSituation': 'apartment',
    'purpose': 'companionship'
},

'Border Collie': {
    'activityLevel': 'high',
    'sizePreference': 'medium',
    'otherPets': 'yes',
    'childrenAtHome': 'yes',
    'furPreference': 'long',
    'sheddingTolerance': 'high',
    'livingSituation': 'farm_rural',
    'purpose': 'working'
},

'Dachshund': {
    'activityLevel': 'moderate',
    'sizePreference': 'small',
    'otherPets': 'no',
    'childrenAtHome': 'no',
    'furPreference': 'short',
    'sheddingTolerance': 'minimal',
    'livingSituation': 'yard',
    'lookingFor': 'companionship'
}
}

@login_required
@csrf_exempt
def match_dog(request):
    if request.method == 'POST':
        print('We here')
        data = json.loads(request.body)
        # User's preferences
        user_preferences = {
            'activityLevel': data.get('activityLevel'),
            'dailyTime' : data.get('dailyTime'),
            'sizePreference': data.get('sizePreference'),
            'otherPets': data.get('otherPets'),
            'preferredAge': data.get('preferredAge'),
            'childrenAtHome': data.get('childrenAtHome'),
            'furPreference': data.get('furPreference'),
            'sheddingTolerance': data.get('sheddingTolerance'),
            'livingSituation': data.get('livingSituation'),
            'lookingFor': data.get('lookingFor'),

        }

        matched_dogs = []
        for dog in DogListing.objects.all():
            print('We here2')
            points = 0
            breed_info = breed_characteristics.get(dog.breed, {})
            print('breed info: ', breed_info)
            print('user prefences: ', user_preferences)

        # Check size match
        if breed_info.get('sizePreference') == user_preferences['sizePreference']:
            points += 10
            print('10 points added for size')

        # Check activity level match
        if breed_info.get('activityLevel') == user_preferences['activityLevel']:
            points += 10

        # Check other pets compatibility
        if breed_info.get('otherPets') == user_preferences['otherPets']:
            points += 5

        # Check children at home compatibility
        if breed_info.get('childrenAtHome') == user_preferences['childrenAtHome']:
            points += 5

        # Check fur preference
        if breed_info.get('furPreference') == user_preferences['furPreference']:
            points += 5

        # Check shedding tolerance
        if breed_info.get('sheddingTolerance') == user_preferences['sheddingTolerance']:
            points += 5

        # Check living situation
        if breed_info.get('livingSituation') == user_preferences['livingSituation']:
            points += 5

        # Check purpose
        if breed_info.get('purpose') == user_preferences['lookingFor']:
            points += 5

            matched_dogs.append({'dog': dog, 'points': points})
        print('dog points: ',points)
        # Sort and return top matches
        matched_dogs.sort(key=lambda x: x['points'], reverse=True)
        
        # Return the dog with the highest points
        top_dog = matched_dogs[0]['dog'] if matched_dogs else None
        if top_dog:
            dog_data = {
                'id': top_dog.id,
                'name': top_dog.name,
                'breed': top_dog.breed,
                'age': top_dog.age,
                'color': top_dog.color,
                'size': top_dog.size,
                'bio': top_dog.bio,
                'images': top_dog.images,
                'points': matched_dogs[0]['points']
            }
            return JsonResponse({'matchedDog': dog_data})
        else:
            return JsonResponse({'error': 'No matching dogs found'}, status=404)

    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)