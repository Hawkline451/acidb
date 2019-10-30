# Generated by Django 2.2.1 on 2019-10-30 17:39

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('acidb', '0003_auto_20191030_1449'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='protein',
            name='isoelectric_p',
        ),
        migrations.AlterField(
            model_name='ec_number',
            name='nr_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ec_number', to='acidb.Protein'),
        ),
        migrations.AlterField(
            model_name='inter_fam',
            name='nr_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='inter_fam', to='acidb.Protein'),
        ),
        migrations.AlterField(
            model_name='kegg_ko',
            name='nr_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='kegg_ko', to='acidb.Protein'),
        ),
        migrations.AlterField(
            model_name='protein',
            name='nr_id',
            field=models.AutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='proteome',
            name='nr_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proteome_nr_id', to='acidb.Protein'),
        ),
        migrations.AlterField(
            model_name='proteome',
            name='organism',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='proteome_organism', to='acidb.Organism'),
        ),
    ]
