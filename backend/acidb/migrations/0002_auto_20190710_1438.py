# Generated by Django 2.2.1 on 2019-07-10 14:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('acidb', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Confidence',
            new_name='GrowthDetail',
        ),
        migrations.AlterModelOptions(
            name='growthdetail',
            options={'verbose_name_plural': 'GrowthDetail'},
        ),
    ]