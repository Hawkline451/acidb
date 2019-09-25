from acidb.models import Organism, Strain, Taxonomy, Reference, GrowthDetail
from rest_framework import serializers

# Get all info from the organism table


class OrganismSerializer(serializers.HyperlinkedModelSerializer):
    # organism_id = serializers.Field(source='organism.id')
    isolated = serializers.SerializerMethodField(read_only=True)

    def get_isolated(self, obj):
        return 'yes' if obj.isolated else 'no'

    class Meta:
        model = Organism
        fields = ['id_organism', 'name', 'isolated', 'state', 'seq_date', 'gen_size',
                  'gen_completeness', 'gen_contamination', 'gc_percentage', 'n_orfs',
                  'temp_associated', 'temp_min', 'temp_max', 'ph_associated', 'ph_min',
                  'ph_max', 'access_src', 'access_id', 'biosample', 'bioproject', 'ftp_url',
                  'annotation']


class StrainSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Strain
        fields = ['strain_name']


class TaxonomySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Taxonomy
        fields = ['tax_src', 'tax_id', 'domain', 'phylum',
                  'tax_class', 'order', 'family', 'genus', 'species']


class TaxonomySummarySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Taxonomy
        fields = ['domain', 'phylum']


class SummaryOrganismSerializer(serializers.HyperlinkedModelSerializer):
    strains = StrainSerializer(many=True)
    taxonomy = TaxonomySummarySerializer(many=True)
    isolated = serializers.SerializerMethodField(read_only=True)

    def get_isolated(self, obj):
        return 'yes' if obj.isolated else 'no'

    class Meta:
        model = Organism
        fields = ['id_organism', 'name', 'isolated', 'state', 'seq_date', 'gen_size',
                  'gen_completeness', 'gen_contamination', 'gc_percentage', 'n_orfs',
                  'temp_associated', 'temp_min', 'temp_max', 'ph_associated', 'ph_min',
                  'ph_max', 'access_src', 'annotation', 'strains', 'taxonomy', 'access_id', 'ftp_url']


class ReferenceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Reference
        fields = ['ref_text']


class GrowthDetailSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GrowthDetail
        fields = ['ph_confidence', 'temp_confidence', 'ph_src', 'temp_src']


class DetailOrganismSerializer(serializers.HyperlinkedModelSerializer):
    strains = StrainSerializer(many=True)
    taxonomy = TaxonomySerializer(many=True)
    references = ReferenceSerializer(many=True)
    growth_detail = GrowthDetailSerializer(many=False)
    isolated = serializers.SerializerMethodField(read_only=True)

    def get_isolated(self, obj):
        return 'yes' if obj.isolated else 'no'

    class Meta:
        model = Organism
        fields = ['id_organism', 'name', 'isolated', 'state', 'seq_date', 'gen_size',
                  'gen_completeness', 'gen_contamination', 'gc_percentage', 'n_orfs',
                  'temp_associated', 'temp_min', 'temp_max', 'ph_associated', 'ph_min',
                  'ph_max', 'access_src', 'access_id', 'biosample', 'bioproject', 'ftp_url',
                  'annotation', 'strains', 'taxonomy', 'references', 'growth_detail']


class SearchSerializer(serializers.HyperlinkedModelSerializer):

    organism_name = serializers.SerializerMethodField(read_only=True)
    id_organism = serializers.SerializerMethodField(read_only=True)

    def get_id_organism(self, obj):
        return obj.organism.id_organism

    def get_organism_name(self, obj):
        return obj.organism.name

    class Meta:
        model = Strain
        fields = ['id_organism', 'strain_name', 'organism_name']


class TaxonomyNodeSerializer(serializers.HyperlinkedModelSerializer):
    category = serializers.SerializerMethodField(read_only=True)
    total = serializers.SerializerMethodField(read_only=True)
    type = serializers.SerializerMethodField(read_only=True)
    node = serializers.SerializerMethodField(read_only=True)
    current_url = serializers.SerializerMethodField(read_only=True)
    url = serializers.SerializerMethodField(read_only=True)

    def get_category(self, obj):
        taxonomy = ['domain', 'phylum', 'tax_class',
                    'order', 'family', 'genus', 'species']
        idx = len(self.context['view'].kwargs)
        result = taxonomy[idx] if idx < len(taxonomy) else None
        return result

    def get_total(self, obj):
        try:
            result = obj['total']
        except:
            result = None
        return result

    def get_type(self, obj):
        idx = len(self.context['view'].kwargs)
        result = 'tree' if idx < 7 else 'leaf'
        return result

    def get_node(self, obj):
        idx = len(self.context['view'].kwargs)
        if idx < 7:
            return {'id_organism': obj['name'], 'name': obj['name']}
        else:
            strain_name = [
                name.strain_name for name in obj.organism.strains.all()]
            return {'id_organism': obj.organism_id, 'name': strain_name}

    def get_current_url(self, obj):
        return self.context['request'].path

    def get_url(self, obj):
        idx = len(self.context['view'].kwargs)
        if idx < 7:
            url = obj['name'] if obj['name'] is not None else 'unclassified'
            result = self.context['request'].path + url
        else:
            result = '/api/organism_detail/' + str(obj.organism_id)
        return result

    class Meta:
        model = Taxonomy
        fields = ['category', 'current_url', 'total', 'type', 'node', 'url']


class SimplePlotSerializer(serializers.HyperlinkedModelSerializer):
    strains = StrainSerializer(many=True)
    domain = serializers.SerializerMethodField(read_only=True)
    isolated = serializers.SerializerMethodField(read_only=True)

    def get_domain(self, obj):
        return obj.taxonomy.all()[0].domain

    def get_isolated(self, obj):
        return 'yes' if obj.isolated else 'no'

    class Meta:
        model = Organism
        fields = ['id_organism', 'name', 'strains', 'domain', 'isolated', 'state', 'seq_date', 'gen_size',
                  'gc_percentage', 'n_orfs', 'temp_associated', 'temp_min', 'temp_max',
                  'ph_associated', 'ph_min', 'ph_max', 'gen_completeness', 'gen_contamination' ]
