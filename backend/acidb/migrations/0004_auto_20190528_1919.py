# Generated by Django 2.2.1 on 2019-05-28 19:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('acidb', '0003_auto_20190528_1903'),
    ]

    operations = [
        migrations.RenameField(
            model_name='organism',
            old_name='ge_completeness',
            new_name='gen_completeness',
        ),
    ]
