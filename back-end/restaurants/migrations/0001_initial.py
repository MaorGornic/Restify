# Generated by Django 4.0.3 on 2022-03-12 18:28

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('address', models.CharField(max_length=200)),
                ('email', models.CharField(max_length=100)),
                ('phone_num', models.CharField(max_length=10)),
                ('views', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('logo', models.ImageField(blank=True, null=True, upload_to='restaurant_logo/')),
                ('followers', models.ManyToManyField(blank=True, null=True, related_name='restaurant_followers', to='accounts.modifieduser')),
                ('likes', models.ManyToManyField(blank=True, null=True, related_name='restaurant_likes', to='accounts.modifieduser')),
                ('owner', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='restaurant_owner', to='accounts.modifieduser')),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=200)),
                ('type', models.CharField(choices=[('GENERAL', 'general'), ('RESTAURANT', 'restaurant')], default='GENERAL', max_length=10)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users', to='accounts.modifieduser')),
            ],
        ),
        migrations.CreateModel(
            name='MenuItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=200)),
                ('price', models.DecimalField(decimal_places=2, max_digits=8, validators=[django.core.validators.MinValueValidator(0)])),
                ('picture', models.ImageField(blank=True, null=True, upload_to='menu/')),
                ('restaurant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='menuitems', to='restaurants.restaurant')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_created=True)),
                ('restaurant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='restaurant', to='accounts.modifieduser')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='comment', to='accounts.modifieduser')),
            ],
        ),
        migrations.CreateModel(
            name='Blog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('publish_timestamp', models.DateTimeField(auto_created=True)),
                ('title', models.CharField(max_length=200)),
                ('banner', models.ImageField(blank=True, null=True, upload_to='blogs/')),
                ('contents', models.CharField(max_length=5000)),
                ('likes', models.ManyToManyField(related_name='blog_likes', to='accounts.modifieduser')),
                ('restaurant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='restaurant', to='restaurants.restaurant')),
            ],
        ),
    ]
