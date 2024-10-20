from django.contrib import admin
from .models import UserProfile
from .models import DogListing
from .models import AdoptionApplication
from .models import Message
from django.utils.html import format_html
from django.db.models import Q, Value
from django.db.models.functions import Concat

class DogListingAdmin(admin.ModelAdmin):
    list_display = ('name', 'breed', 'age', 'get_image_previews')

    def get_image_previews(self, obj):
        images = obj.images
        if images:
            
            images_html = ''.join([format_html('<img src="{}" width="100" height="auto" style="margin-right: 10px;" />', img) for img in images])
            return format_html(images_html)
        return "No Images"

    get_image_previews.short_description = 'Images'

admin.site.register(DogListing, DogListingAdmin)
admin.site.register(UserProfile)
admin.site.register(AdoptionApplication)

class MessageAdmin(admin.ModelAdmin):
    list_display = ('conversation', 'content', 'timestamp')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.annotate(conversation=Concat('sender__username', Value(' - '), 'receiver__username'))
        return queryset

    def conversation(self, obj):
        # Display the conversation participants
        return f"{obj.sender.username} - {obj.receiver.username}"

    conversation.admin_order_field = 'conversation'  # Allows column order sorting
    conversation.short_description = 'Conversation'  # Column header

admin.site.register(Message, MessageAdmin)