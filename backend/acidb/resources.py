from acidb.models import *

from import_export.widgets import ForeignKeyWidget
from import_export import resources, fields

class OrganismResource(resources.ModelResource):
    class Meta:
        model = Organism
        fields = ('id_organism','visibility','name','isolated','state','seq_date','gen_size','gen_completeness','gen_contamination','gc_percentage','n_orfs','temp_associated','temp_min','temp_max','ph_associated','ph_min','ph_max','access_src','access_id','biosample','bioproject','ftp_url','annotation')
        import_id_fields = ['id_organism']

        export_order = fields


class GrowthDetailResource(resources.ModelResource):
    organism = fields.Field(attribute='organism', column_name="id", widget=ForeignKeyWidget(Organism, 'id_organism'))

    class Meta:
        model = GrowthDetail
        fields = ('organism','ph_confidence','temp_confidence','ph_src','temp_src')
        import_id_fields = ['organism']
        export_order = fields


# Every model with an organism as foreign key
class BaseOrganismResource(resources.ModelResource):
    def get_instance(self, instance_loader, row):
        try:
            params = {}
            for key in instance_loader.resource.get_import_id_fields():
                field = instance_loader.resource.fields[key]
                params[field.attribute] = field.clean(row)
            return self.get_queryset().get(**params)
        except Exception:
            return None

    organism = fields.Field(attribute='organism', column_name="id", widget=ForeignKeyWidget(Organism, 'id_organism'))

class ReferenceResource(BaseOrganismResource):

    class Meta:
        model = Reference
        fields = ('organism', 'ref_text')
        export_order = fields

class StrainResource(BaseOrganismResource):

    class Meta:
        model = Strain
        fields = ('organism', 'strain_name')
        export_order = fields

class TaxonomyResource(BaseOrganismResource):

    class Meta:
        model = Taxonomy
        fields = ('organism','tax_src','tax_id','domain','phylum','tax_class','order','family','genus','species')
        export_order = fields