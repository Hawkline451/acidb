# Generated by Django 2.2.1 on 2019-10-30 14:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('acidb', '0002_ec_number_inter_fam_kegg_ko_protein_proteome'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proteome',
            name='organism',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proteome', to='acidb.Organism'),
        ),
    ]