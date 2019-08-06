from acidb.models  import Organism
from rest_framework import serializers

# Get all info from the organism
class OrganismSerializer(serializers.HyperlinkedModelSerializer):
    #organism_id = serializers.Field(source='organism.id')
    class Meta:
        model = Organism
        fields = [  'name','isolated','state','seq_date','gen_size','gen_completeness','gen_contamination','gc_percentage','n_orfs','temp_associated',
                    'temp_min','temp_max','ph_associated','ph_min','ph_max','access_src','access_id','biosample','bioproject','ftp_url','annotation']

# Get the info displayed in the summary table
class SummaryOrganismSerializer(serializers.HyperlinkedModelSerializer):
    #organism_id = serializers.Field(source='organism.id')
    class Meta:
        model = Organism
        fields = [  'name','isolated','state','seq_date','gen_size','gen_completeness','gen_contamination','gc_percentage','n_orfs','temp_associated',
                    'temp_min','temp_max','ph_associated','ph_min','ph_max','access_src','annotation']
