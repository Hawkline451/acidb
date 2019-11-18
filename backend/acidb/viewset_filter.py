from django.db.models import Q
from django_filters import rest_framework as filters
from acidb.models import Organism, Protein

# Filter class

class SearchFilter(filters.FilterSet):

    gen_size_gte = filters.NumberFilter(
        label='Gene size greater or equal than', field_name='gen_size', lookup_expr='gte')
    gen_size_lte = filters.NumberFilter(
        label='Gene completeness lower or equal than', field_name='gen_completeness', lookup_expr='lte')
    gen_completeness_gte = filters.NumberFilter(
        label='Gene completeness greater or equal than', field_name='gen_completeness', lookup_expr='gte')
    gen_completeness_lte = filters.NumberFilter(
        label='Gene size lower or equal than', field_name='gen_size', lookup_expr='lte')
    gen_contamination_gte = filters.NumberFilter(
        label='Gene contamination greater or equal than', field_name='gen_contamination', lookup_expr='gte')
    gen_contamination_lte = filters.NumberFilter(
        label='Gene contamination lower or equal than', field_name='gen_contamination', lookup_expr='lte')
    gc_percentage_gte = filters.NumberFilter(
        label='Gc percentage greater or equal than', field_name='gc_percentage', lookup_expr='gte')
    gc_percentage_lte = filters.NumberFilter(
        label='Gc percentage lower or equal than', field_name='gc_percentage', lookup_expr='lte')
    n_orfs_gte = filters.NumberFilter(
        label='N orfs greater or equal than', field_name='n_orfs', lookup_expr='gte')
    n_orfs_lte = filters.NumberFilter(
        label='N orfs lower or equal than', field_name='n_orfs', lookup_expr='lte')

    temp_in_range = filters.CharFilter(
        label="Temperature in range", method='filter_temp_in_range')
    ph_in_range = filters.CharFilter(
        label="pH in range", method='filter_ph_in_range')
    # Associated
    temp_associated_gte = filters.CharFilter(
        label="Temperature associated greater or equal than", method='filter_temp_associated_gte')
    temp_associated_lte = filters.CharFilter(
        label="Temperature associated lower or equal than", method='filter_temp_associated_lte')
    ph_associated_gte = filters.CharFilter(
        label="pH  associated greater or equal than", method='filter_ph_associated_gte')
    ph_associated_lte = filters.CharFilter(
        label="pH associated lower or equal than", method='filter_ph_associated_lte')

    domain = filters.CharFilter(
        label="Domain contains", method='filter_tax', field_name='domain')
    phylum = filters.CharFilter(
        label="Phylum contains", method='filter_tax', field_name='phylum')
    tax_class = filters.CharFilter(
        label="Class contains", method='filter_tax', field_name='tax_class')
    order = filters.CharFilter(
        label="Order contains", method='filter_tax', field_name='order')
    family = filters.CharFilter(
        label="Family contains", method='filter_tax', field_name='family')
    genus = filters.CharFilter(
        label="Genus contains", method='filter_tax', field_name='genus')
    species = filters.CharFilter(
        label="Species contains", method='filter_tax', field_name='species')
    organism_or_strain = filters.CharFilter(
        label="Organism strain contains", method='filter_organism_strain')

    def filter_organism_strain(self, queryset, name, value):
        queryset = queryset.filter(Q(strains__strain_name__icontains=value) | Q(name__icontains=value)).distinct().order_by('name')
        return queryset
    def filter_tax(self, queryset, name, value):
        if name == 'domain':
            queryset = queryset.filter(taxonomy__domain__icontains=value)
        elif name == 'phylum':
            queryset = queryset.filter(taxonomy__phylum__icontains=value)
        elif name == 'tax_class':
            queryset = queryset.filter(taxonomy__tax_class__icontains=value)
        elif name == 'order':
            queryset = queryset.filter(taxonomy__order__icontains=value)
        elif name == 'family':
            queryset = queryset.filter(taxonomy__family__icontains=value)
        elif name == 'genus':
            queryset = queryset.filter(taxonomy__genus__icontains=value)
        elif name == 'species':
            queryset = queryset.filter(taxonomy__species__icontains=value)

        return queryset

    def filter_temp_in_range(self, queryset, name, value):
        queryset = queryset.filter(Q(temp_min__lte=value) & Q(temp_max__gte=value))
        return queryset
    def filter_temp_associated_gte(self, queryset, name, value):
        queryset = queryset.filter(temp_associated__gte=value)
        return queryset
    def filter_temp_associated_lte(self, queryset, name, value):
        queryset = queryset.filter(temp_associated__lte=value)
        return queryset
    def filter_ph_in_range(self, queryset, name, value):
        queryset = queryset.filter(Q(ph_min__lte=value) & Q(ph_max__gte=value))
        return queryset
    def filter_ph_associated_gte(self, queryset, name, value):
        queryset = queryset.filter(ph_associated__gte=value)
        return queryset
    def filter_ph_associated_lte(self, queryset, name, value):
        queryset = queryset.filter(ph_associated__lte=value)
        return queryset

    # Filtering by strain
    # query.filter(strains__strain_name__icontains='a')

    class Meta:
        model = Organism
        fields = {
            'isolated': ['exact'],
            'state': ['iexact'],

            'access_src': ['iexact'],
            'access_id': ['iexact'],
            'biosample': ['iexact'],
            'bioproject': ['iexact'],
            'annotation': ['iexact'],
        }


class ProteinSearchFilter(filters.FilterSet):
    ec_number = filters.CharFilter(
        label="Ec number contains", method='filter_ec_number', field_name='ec_number')
    kegg_ko = filters.CharFilter(
        label="Kegg ko contains", method='filter_kegg', field_name='kegg_ko')
    inter_fam = filters.CharFilter(
        label="Interfam contains", method='filter_interfam', field_name='inter_fam')
    signalp_null = filters.BooleanFilter(field_name='signal_p', lookup_expr='isnull')

    def filter_ec_number(self, queryset, name, value):
        queryset = queryset.filter(ec_number__ec_number__iexact=value)
        return queryset

    def filter_kegg(self, queryset, name, value):
        queryset = queryset.filter(kegg_ko__kegg_ko__iexact=value)
        return queryset

    def filter_interfam(self, queryset, name, value):
        queryset = queryset.filter(inter_fam__interfam__iexact=value)
        return queryset

    class Meta:
        model = Protein
        fields = {
            'tmhmm': ['iexact'], 
            'hmmtop': ['iexact'], 
            'psort': ['iexact'], 
            'pfam': ['icontains'], 
            'signal_p': ['iexact'], 
            'cog': ['iexact'], 
            'cog_category': ['icontains'],
        }
