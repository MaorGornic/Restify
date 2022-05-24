# Generated by Django 4.0.3 on 2022-03-14 16:58

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_modifieduser_phone_num'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modifieduser',
            name='phone_num',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, null=True, region=None),
        ),
    ]