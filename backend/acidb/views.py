from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response

from acidb.organism_serializers import SummaryOrganismSerializer, DetailOrganismSerializer, SearchSerializer, TaxonomyNodeSerializer
from acidb.models import Organism, Strain, Taxonomy


class OrganismViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Organism.objects.filter(
        visibility=1).prefetch_related('strains')
    serializer_class = SummaryOrganismSerializer

    # Return everything
    @method_decorator(cache_page(60*60))
    def list(self, request):
        serializer = SummaryOrganismSerializer(self.queryset, many=True)
        return Response(serializer.data)

    # Return only one instance
    @method_decorator(cache_page(60*5))
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class OrganismDetailViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Organism.objects.filter(visibility=1).prefetch_related('strains').prefetch_related(
        'taxonomy').prefetch_related('references').prefetch_related('growth_detail')
    serializer_class = DetailOrganismSerializer

    # Return only one instance
    @method_decorator(cache_page(60*5))
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class SearchViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Strain.objects.select_related(
        'organism').filter(organism__visibility=1)
    serializer_class = SearchSerializer

    # Return everything
    @method_decorator(cache_page(60*60))
    def list(self, request):
        serializer = SearchSerializer(self.queryset, many=True)
        return Response(serializer.data)


class TaxonomyViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):

    serializer_class = TaxonomyNodeSerializer

    # Return everything
    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        # [print(arg) for arg in self.kwargs]
        taxonomy = ['domain', 'phylum', 'tax_class',
                    'order', 'family', 'genus', 'species']

        data = Taxonomy.objects.filter(organism__visibility=1)
        last_category = None
        for category in self.kwargs:
            if self.kwargs[category] == 'None':
                continue
            data = data.filter(**{category: self.kwargs[category]})
            last_category = category

        next_category_idx = 0 if last_category is None else taxonomy.index(
            last_category) + 1

        if len(self.kwargs) < len(taxonomy):
            return data.values_list(taxonomy[next_category_idx]).distinct()
        else:
            return data.values_list('id').distinct()

    # Return everything
    @method_decorator(cache_page(60*60))
    def retrieve(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


# Check action decorator
