# Generated by Django 4.2.7 on 2023-12-05 01:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pawsBackend', '0006_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='profile_image',
            field=models.CharField(blank=True, default='images/defaultCustomer.png', max_length=255),
        ),
    ]
