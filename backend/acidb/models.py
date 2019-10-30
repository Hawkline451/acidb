from django.db import models

# Create your models here.

# Primary model with the micro organism features


class Organism(models.Model):
    id_organism = models.AutoField(primary_key=True)
    visibility = models.BooleanField(default=True)
    name = models.CharField(max_length=50, default=None, null=True)
    isolated = models.BooleanField(default=None, null=True, blank=True)
    state = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    seq_date = models.DateField(default=None, null=True, blank=True)
    gen_size = models.FloatField(default=None, null=True, blank=True)
    gen_contamination = models.FloatField(default=None, null=True, blank=True)
    gen_completeness = models.FloatField(default=None, null=True, blank=True)
    gc_percentage = models.FloatField(default=None, null=True, blank=True)
    n_orfs = models.IntegerField(default=None, null=True, blank=True)
    temp_associated = models.FloatField(default=None, null=True, blank=True)
    temp_min = models.FloatField(default=None, null=True, blank=True)
    temp_max = models.FloatField(default=None, null=True, blank=True)
    ph_associated = models.FloatField(default=None, null=True, blank=True)
    ph_min = models.FloatField(default=None, null=True, blank=True)
    ph_max = models.FloatField(default=None, null=True, blank=True)
    access_src = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    access_id = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    biosample = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    bioproject = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    ftp_url = models.CharField(
        max_length=250, default=None, null=True, blank=True)
    annotation = models.CharField(
        max_length=10, default=None, null=True, blank=True)

# One organism can have one or more strains names


class Strain(models.Model):
    organism = models.ForeignKey(
        Organism, on_delete=models.CASCADE, related_name='strains')
    strain_name = models.CharField(
        max_length=50, default=None, null=True, blank=True)

# One organism can have one or more references

class Reference(models.Model):
    organism = models.ForeignKey(
        Organism, on_delete=models.CASCADE, related_name='references')
    ref_text = models.CharField(
        max_length=1000, default=None, null=True, blank=True)


# It's possible to have more than one taxonomy but the database only have the NCBI classification
class Taxonomy(models.Model):
    organism = models.ForeignKey(
        Organism, on_delete=models.CASCADE, related_name='taxonomy')
    tax_src = models.CharField(
        max_length=20, default=None, null=True, blank=True)
    tax_id = models.IntegerField(default=None, null=True, blank=True)
    domain = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    phylum = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    tax_class = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    order = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    family = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    genus = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    species = models.CharField(
        max_length=50, default=None, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Taxonomy"


class GrowthDetail(models.Model):
    organism = models.OneToOneField(
        Organism,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='growth_detail'
    )
    ph_confidence = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    temp_confidence = models.CharField(
        max_length=50, default=None, null=True, blank=True)
    ph_src = models.CharField(
        max_length=250, default=None, null=True, blank=True)
    temp_src = models.CharField(
        max_length=250, default=None, null=True, blank=True)

    class Meta:
        verbose_name_plural = "GrowthDetail"

##
# Proteome database
##


# Protein models
class Protein(models.Model):
    nr_id = models.AutoField(primary_key=True, db_index=True)
    prot_len = models.IntegerField(default=None, null=True, blank=True)
    mol_weight = models.FloatField(default=None, null=True, blank=True)
    tmhmm = models.CharField(max_length=5, default=None, null=True, blank=True)
    hmmtop = models.CharField(max_length=5, default=None, null=True, blank=True)
    psort = models.CharField(max_length=5, default=None, null=True, blank=True)
    pfam = models.CharField(max_length=20, default=None, null=True, blank=True)
    signal_p = models.CharField(max_length=5, default=None, null=True, blank=True)
    cog = models.CharField(max_length=20, default=None, null=True, blank=True)
    cog_category = models.CharField(max_length=10, default=None, null=True, blank=True)


class Kegg_ko(models.Model):
    nr_id = models.ForeignKey(Protein, on_delete=models.CASCADE, db_index=True, related_name='kegg_ko')
    kegg_ko = models.CharField(
        max_length=50, default=None, null=True, blank=True)


class Inter_fam(models.Model):
    nr_id = models.ForeignKey(Protein, on_delete=models.CASCADE, db_index=True, related_name='inter_fam')
    inter_fam = models.CharField(
        max_length=20, default=None, null=True, blank=True)


class Ec_number(models.Model):
    nr_id = models.ForeignKey(Protein, on_delete=models.CASCADE, db_index=True, related_name='ec_number')
    ec_number = models.CharField(
        max_length=20, default=None, null=True, blank=True)


# nr : non redundant
class Proteome(models.Model):
    organism = models.ForeignKey(Organism, on_delete=models.CASCADE, db_index=True, related_name='proteome_organism')
    nr_id = models.ForeignKey(Protein, on_delete=models.CASCADE, db_index=True,  related_name='proteome_nr_id')
    
    prot_id = models.CharField(max_length=50, default=None, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Proteome"
