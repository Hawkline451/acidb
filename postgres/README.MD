
# Tables structure

## Organism

* id_organism : Key, autoincremental integer value
* visibility : Boolean, 0 or 1
* name : String
* isolated : Boolean 0 or 1
* state : String, [complete, draft]
* seq_date : Date, YYYY-MM-DD
* gen_size : Float
* gen_completeness : Float
* gen_contamination : Float
* gc_percentage : Float
* n_orfs : Integer
* temp_associated : Float
* temp_min : Float
* temp_max : Float
* ph_associated : Float
* ph_min : Float
* ph_max : Float
* access_src : String
* access_id : String
* biosample : String
* bioproject : String
* ftp_url : String
* annotation : String

id_organism, visibility and name cannot be null.

## Strain

* id_organism : Foreign key, not primary key
* strain_name : String

One organism can have one or more strain name

## Reference

* id_organism : Foreign key, not primary key
* ref_text : String, support utf-8 characters


## GrowthDetail

* id_organism : Foreign key, primary key
* ph_confidence : String
* temp_confidence : String
* ph_src : String
* temp_src : Strin

One to one relation with organism table

## Taxonomy

* id_organism : Foreign key, not primary key
* tax_src : String
* tax_id : Integer
* domain : String
* phylum : String
* tax_class : String
* order : String
* family : String
* genus : String
* species : String

## Protein

* nr_id : primary key
* prot_len : Int
* mol_weight : Float
* tmhmm : String
* hmmtop : String
* psort : String
* pfam : String
* signal_p : String
* cog : String
* cog_category : String

## Proteome 

* organism : Foreign key
* nr_id : Foreign key
* prot_id : String

## Kegg ko

* nr_id : Foreign key
* kegg_ko : String

## Inter fam

* nr_id : Foreign key
* inter_fam : String

## Ec number

* nr_id : Foreign key
* ec_number : String


