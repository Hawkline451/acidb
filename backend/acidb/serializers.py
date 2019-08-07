from acidb.models  import Organism, Strain, Taxonomy
from rest_framework import serializers

# Get all info from the organism table
class OrganismSerializer(serializers.HyperlinkedModelSerializer):
    #organism_id = serializers.Field(source='organism.id')
    class Meta:
        model = Organism
        fields = [  'id_organism','name','isolated','state','seq_date','gen_size','gen_completeness','gen_contamination','gc_percentage','n_orfs','temp_associated',
                    'temp_min','temp_max','ph_associated','ph_min','ph_max','access_src','access_id','biosample','bioproject','ftp_url','annotation']

class StrainSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Strain
        fields = ['strain_name']

class TaxonomySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Taxonomy
        fields = ['tax_src','tax_id','domain','phylum','tax_class','order','family','genus','species']

class TaxonomySummarySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Taxonomy
        fields = ['domain', 'phylum']

class SummaryOrganismSerializer(serializers.HyperlinkedModelSerializer):
    strains = StrainSerializer(many=True)
    taxonomy = TaxonomySummarySerializer(many=True)
    #organism_id = serializers.Field(source='organism.id')
    class Meta:
        model = Organism
        fields = [  'id_organism','name','isolated','state','seq_date','gen_size','gen_completeness','gen_contamination','gc_percentage',
                    'n_orfs','temp_associated', 'temp_min','temp_max','ph_associated','ph_min','ph_max','access_src','annotation', 
                    'strains','taxonomy' ]

