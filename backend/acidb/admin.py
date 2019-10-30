from django.contrib import admin

from import_export.admin import ImportExportModelAdmin
from acidb.resources import *

# Organism

# this class define which columns will be shown in the admin web site.
class OrganismAdmin(ImportExportModelAdmin):
    resource_class = OrganismResource
    list_display = ['id_organism', 'name']

class GrowthDetailAdmin(ImportExportModelAdmin):
    resource_class = GrowthDetailResource
    list_display = ['organism', 'get_name']
    def get_name(self, obj):
        return obj.organism.name
    
    #get_name.admin_order_field  = 'Organism'  #Allows column order sorting
    get_name.short_description = 'Organism name'  #Renames column head

class ReferenceAdmin(ImportExportModelAdmin):
    resource_class = ReferenceResource
    list_display = ['organism', 'get_name']
    def get_name(self, obj):
        return obj.organism.name
    
    get_name.short_description = 'Organism name'

class StrainAdmin(ImportExportModelAdmin):
    resource_class = StrainResource
    list_display = ['organism', 'get_name']
    def get_name(self, obj):
        return obj.organism.name
    
    get_name.short_description = 'Organism name'

class TaxonomyAdmin(ImportExportModelAdmin):
    resource_class = TaxonomyResource
    list_display = ['organism', 'get_name']
    def get_name(self, obj):
        return obj.organism.name
    
    get_name.short_description = 'Organism name'

# Proteome

class ProteinAdmin(ImportExportModelAdmin):
    resource_class = ProteinResource
    list_display = ['nr_id']


class ProteomeAdmin(ImportExportModelAdmin):
    resource_class = ProteomeResource
    raw_id_fields = ('organism','nr_id')
    list_display = ['organism', 'get_name', 'nr_id']
    def get_name(self, obj):
        return obj.organism.name
    
    get_name.short_description = 'Organism name'


admin.site.register(Organism,OrganismAdmin)
admin.site.register(Strain, StrainAdmin)
admin.site.register(Reference, ReferenceAdmin)
admin.site.register(Taxonomy, TaxonomyAdmin)
admin.site.register(GrowthDetail,GrowthDetailAdmin)

admin.site.register(Protein,ProteinAdmin)
admin.site.register(Proteome,ProteomeAdmin)
