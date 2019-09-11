"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin

from django.urls import include, path
from rest_framework import routers
from acidb.views import OrganismViewSet, OrganismDetailViewSet, SearchViewSet, TaxonomyViewSet, SimplePlotDataViewSet

apiurl = routers.SimpleRouter()
apiurl.register(r'organism', OrganismViewSet, base_name='organism')
apiurl.register(r'organism_detail', OrganismDetailViewSet, base_name='organism_detail')
apiurl.register(r'search_list', SearchViewSet, base_name='search_list')

apiurl.register(r'taxonomy/(?P<domain>[^/.]+)/(?P<phylum>[^/.]+)/(?P<tax_class>[^/.]+)/(?P<order>[^/.]+)/(?P<family>[^/.]+)/(?P<genus>[^/.]+)/(?P<species>[^/.]+)', TaxonomyViewSet, base_name='taxonomy')
apiurl.register(r'taxonomy/(?P<domain>[^/.]+)/(?P<phylum>[^/.]+)/(?P<tax_class>[^/.]+)/(?P<order>[^/.]+)/(?P<family>[^/.]+)/(?P<genus>[^/.]+)', TaxonomyViewSet, base_name='taxonomy')
apiurl.register(r'taxonomy/(?P<domain>[^/.]+)/(?P<phylum>[^/.]+)/(?P<tax_class>[^/.]+)/(?P<order>[^/.]+)/(?P<family>[^/.]+)', TaxonomyViewSet, base_name='taxonomy')
apiurl.register(r'taxonomy/(?P<domain>[^/.]+)/(?P<phylum>[^/.]+)/(?P<tax_class>[^/.]+)/(?P<order>[^/.]+)', TaxonomyViewSet, base_name='taxonomy')
apiurl.register(r'taxonomy/(?P<domain>[^/.]+)/(?P<phylum>[^/.]+)/(?P<tax_class>[^/.]+)', TaxonomyViewSet, base_name='taxonomy')
apiurl.register(r'taxonomy/(?P<domain>[^/.]+)/(?P<phylum>[^/.]+)', TaxonomyViewSet, base_name='taxonomy')
apiurl.register(r'taxonomy/(?P<domain>[^/.]+)', TaxonomyViewSet, base_name='taxonomy')
apiurl.register(r'taxonomy', TaxonomyViewSet, base_name='taxonomy')

apiurl.register(r'simple_plot_data', SimplePlotDataViewSet, base_name='simple_plot')


urlpatterns = [
    path('admin/', admin.site.urls),
    # API router
    path('api/', include(apiurl.urls))
]
