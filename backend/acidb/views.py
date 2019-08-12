from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.response import Response

from acidb.organism_serializers import SummaryOrganismSerializer, DetailOrganismSerializer
from acidb.models import Organism



class OrganismViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Organism.objects.filter(visibility=1).prefetch_related('strains')
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

class OrganismDetailViewSet(mixins.RetrieveModelMixin,
                            viewsets.GenericViewSet):
    queryset = Organism.objects.filter(visibility=1).prefetch_related('strains').prefetch_related('taxonomy').prefetch_related('references').prefetch_related('growth_detail')
    serializer_class = DetailOrganismSerializer

    # Return only one instance
    @method_decorator(cache_page(60*5))
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# Check action decorator