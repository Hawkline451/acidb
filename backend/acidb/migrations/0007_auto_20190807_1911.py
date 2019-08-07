# Generated by Django 2.2.1 on 2019-08-07 19:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('acidb', '0006_auto_20190807_1910'),
    ]

    operations = [
        migrations.AlterField(
            model_name='strain',
            name='organism',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='strains', to='acidb.Organism'),
        ),
    ]
