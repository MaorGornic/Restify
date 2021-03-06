# Generated by Django 4.0.3 on 2022-03-12 20:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_alter_modifieduser_phone_num'),
        ('restaurants', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='notification',
            name='message',
        ),
        migrations.AddField(
            model_name='notification',
            name='actor_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.modifieduser'),
        ),
        migrations.AddField(
            model_name='notification',
            name='blog',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='restaurants.blog'),
        ),
        migrations.AddField(
            model_name='notification',
            name='restaurant',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='restaurants.restaurant'),
        ),
        migrations.AddField(
            model_name='notification',
            name='viewed',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='notification',
            name='type',
            field=models.CharField(choices=[('NEWBLOG', 'newblog'), ('MENUUPDATE', 'menuupdate'), ('FOLLOWED', 'followed'), ('LIKEDRES', 'likedres'), ('LIKEDBLOG', 'likedblog'), ('COMMENTED', 'commented')], default='GENERAL', max_length=10),
        ),
    ]
