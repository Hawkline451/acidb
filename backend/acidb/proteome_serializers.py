from acidb.models import Protein, Ec_number, Proteome
from rest_framework import serializers


class PrpteomeSerializer(serializers.HyperlinkedModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    def get_name(self, obj):
        return obj.organism.name

    class Meta:
        model = Proteome
        fields = ['prot_id', 'organism_id','name']

class EcSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ec_number
        fields = ['ec_number']

class KeggSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ec_number
        fields = ['kegg_ko']

class InterfamSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Ec_number
        fields = ['inter_fam']

class ProteinSearchSerializer(serializers.HyperlinkedModelSerializer):
    ec_number = EcSerializer(many=True)
    kegg_ko = EcSerializer(many=True)
    inter_fam = EcSerializer(many=True)
    proteome_nr_id = PrpteomeSerializer(many=True)

    class Meta:
        model = Protein
        fields = ['nr_id', 'prot_len', 'mol_weight', 'tmhmm', 'hmmtop', 'psort', 'pfam', 'signal_p', 'cog', 'cog_category', 'ec_number', 'kegg_ko', 'inter_fam', 'proteome_nr_id']