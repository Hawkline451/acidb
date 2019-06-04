from django.db import models

# Create your models here.

# Primary model with the micro organism features
class Organism(models.Model):
    id_organism = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, default=None, null=True)
    isolated =  models.CharField(max_length=50, default=None, null=True)
    state = models.CharField(max_length=50, default=None, null=True)
    seq_date = models.DateField(default=None, null=True)
    gen_size = models.FloatField(default=None, null=True)
    gen_contamination = models.FloatField(default=None, null=True)
    gen_completeness = models.FloatField(default=None, null=True)
    gc_percentage = models.FloatField(default=None, null=True)
    n_orfs = models.IntegerField(default=None, null=True)
    temp_associated = models.FloatField(default=None, null=True)
    temp_min = models.FloatField(default=None, null=True)
    temp_max = models.FloatField(default=None, null=True)
    ph_associated = models.FloatField(default=None, null=True)
    ph_min = models.FloatField(default=None, null=True)
    ph_max = models.FloatField(default=None, null=True)
    access_src = models.CharField(max_length=50, default=None, null=True)
    access_id = models.CharField(max_length=50, default=None, null=True)
    biosample = models.CharField(max_length=50, default=None, null=True)
    bioproject = models.CharField(max_length=50, default=None, null=True)
    ftp_url = models.CharField(max_length=200, default=None, null=True)

# One organism can have one or more strains names  
class Strain(models.Model):
    organism = models.ForeignKey(Organism, on_delete=models.CASCADE)
    strain_name = models.CharField(max_length=50, default=None)

# One organism can have one or more references
class References(models.Model):
    organism = models.ForeignKey(Organism, on_delete=models.CASCADE)
    ref_text = models.CharField(max_length=100, default=None)


# It's possible to have more than one taxonomy but the database only have the NCBI classification 
class Taxonomy(models.Model):
    organism = models.ForeignKey(Organism, on_delete=models.CASCADE)
    tax_src = models.CharField(max_length=20, default=None)
    tax_id = models.IntegerField(default=None)
    domain = models.CharField(max_length=50, default=None)
    phylum = models.CharField(max_length=50, default=None)
    classorder = models.CharField(max_length=50, default=None)
    family = models.CharField(max_length=50, default=None)
    genus = models.CharField(max_length=50, default=None)
    species = models.CharField(max_length=50, default=None)
