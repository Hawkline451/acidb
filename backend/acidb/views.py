from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import viewsets
from rest_framework.response import Response

from acidb.serializers import OrganismSerializer
from acidb.models import Organism



class OrganismViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Organism.objects.all()
    serializer_class = OrganismSerializer
    http_method_names = ['get']

    # Return everything
    # Cache the query that returns all the organism, individual organism
    @method_decorator(cache_page(60*5))
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = OrganismSerializer(queryset, many=True)
        print(serializer.data[0])
        return Response(serializer.data)

    # Return only one instance
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        print("instance")
        return Response(serializer.data)

# Check action decorator