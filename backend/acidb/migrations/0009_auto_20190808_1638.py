# Generated by Django 2.2.1 on 2019-08-08 16:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('acidb', '0008_auto_20190807_2007'),
    ]

    operations = [
        migrations.AlterField(
            model_name='growthdetail',
            name='organism',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, related_name='growth_detail', serialize=False, to='acidb.Organism'),
        ),
    ]