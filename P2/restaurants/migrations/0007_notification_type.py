# Generated by Django 4.0.3 on 2022-03-06 16:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0006_alter_blog_likes_alter_comment_restaurant_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='type',
            field=models.CharField(choices=[('GENERAL', 'general'), ('RESTAURANT', 'restaurant')], default='GENERAL', max_length=10),
        ),
    ]