# Your Django app's views.py
from django.http import JsonResponse

def test_api(request):
    return JsonResponse({'message': 'Success', 'data': 'This is a test response'})
