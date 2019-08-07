from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import viewsets
from rest_framework.response import Response

from acidb.serializers import SummaryOrganismSerializer
from acidb.models import Organism



class OrganismViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Organism.objects.filter(visibility=1).prefetch_related('strains')
    serializer_class = SummaryOrganismSerializer
    http_method_names = ['get']

    # Return everything
    @method_decorator(cache_page(60*5))
    def list(self, request):
        serializer = SummaryOrganismSerializer(self.queryset, many=True)
        return Response(serializer.data)

    # Return only one instance
    @method_decorator(cache_page(60*5))
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# Check action decorator