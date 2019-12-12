import React from 'react';

import {
  Divider, List, ListItem, ListItemText, Grid, Typography, Paper,
} from '@material-ui/core';

// Styles
import { stylesDetail } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

// Videos
import 'video-react/dist/video-react.css';
import { Player, BigPlayButton } from 'video-react';

const useStylesDocumetation = stylesDetail

//Organism component
export default function DocumentationComponent(props) {
  const classes = useStylesDocumetation();
  const { t } = useTranslation();

  return (
    <div>
      <Grid container>
        <Grid item xs={2}>
          <div className={classes.fixedList}>
            <List>
              <ListItem className={classes.listItemTitle} button component='a' href={props.location.pathname + '#features'}>
                <ListItemText primary={
                  <Typography type='body2' style={{ fontSize: 20 }}>{t('documentation.features')}</Typography>
                } />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component='a' href={props.location.pathname + '#tree'}>
                <ListItemText primary={t('navbar.tree')} />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component='a' href={props.location.pathname + '#table'}>
                <ListItemText primary={t('navbar.table')} />
              </ListItem>
              <Divider light />
              <ListItem className={classes.listItem} button component='a' href={props.location.pathname + '#charts'}>
                <ListItemText primary={t('navbar.charts')} />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component='a' href={props.location.pathname + '#advance_organism_search'}>
                <ListItemText primary={t('navbar.advance_organism_search')} />
              </ListItem>
              <Divider />
            </List>

            <List>
              <ListItem className={classes.listItemTitle} button component='a' href={props.location.pathname + '#methodology'}>
                <ListItemText primary={
                  <Typography type='body2' style={{ fontSize: 20 }}>{t('documentation.methodology')}</Typography>
                } />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component='a' href={props.location.pathname + '#organism_metadata'}>
                <ListItemText primary={t('navbar.organism_metadata')} />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component='a' href={props.location.pathname + '#proteome_metadata'}>
                <ListItemText primary={t('navbar.proteome_metadata')} />
              </ListItem>
            </List>

          </div>
        </Grid>

        <Grid item xs={10} >


          <span id='features'></span>
          <Paper style={{ margin: 30, marginRight: '10%', boxShadow: 'none' }}>
            <Typography variant='h4' style={{ marginBottom: 15 }}>
              Features
            </Typography>
            <span id='tree'></span>
            <Typography variant='h5' style={{marginTop:20}}>
              {'Taxonomy Browser'}
            </Typography>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={5}
            >
              <Grid item xs={6}>
                <div>
                  Searching for <i>Kyrpidia spormannii:</i>
                  <p align='justify'>Navigate through the taxonomic ranks (displayed at the right side of the folders) from domain through strain.
                Each strain in the final branch can be clicked to get complete information of the organism including NCBI ftp direct links and references.</p>
                </div>
              </Grid>

              <Grid item xs={6}>
                <Player>
                  <source src={process.env.PUBLIC_URL + '/videos/tree.mp4'} />
                  <BigPlayButton position="center" />
                </Player>
              </Grid>
            </Grid>

            <span id='table'></span>
            <Typography variant='h5' style={{marginTop:20}}>
              {'DB Browser'}
            </Typography>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={5}
            >
              <Grid item xs={6}>
                <Player>
                  <source src={process.env.PUBLIC_URL + '/videos/table.mp4'} />
                  <BigPlayButton position="center" />
                </Player>
              </Grid>
              <Grid item xs={6}>
                <div>
                  Obtaining all extreme acidophilic organisms in Firmicutes phylum
                  <p align='justify'>By adding the column “phylum” to the displayed is possible to use the filter function to obtain organism from the Firmicutes phylum.
                    The optimum pH column can use expressions like less than (&#60;) or greater than (&#62;) to further filter the table (you can also use range
                    expressions e.g. 0-10). Each column can sort
                    the table in ascending or descending order. Finally it’s possible to add further columns and download the table to a csv file for further analyses. </p>
                </div>
              </Grid>
            </Grid>


            <span id='charts'></span>
            <Typography variant='h5' style={{marginTop:20}}>
              {'Scatter plot'}
            </Typography>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={5}
            >
              <Grid item xs={6}>
                <div>
                  Selecting a dataset of thermoacidophilic bacteria from isolated source:
                  <p align='justify'>The plot allows for custom axis selection with growth conditions such as optimum pH and Temperature (ºC).
                    A combination of all domain or just a specific domain like Bacteria can be selected. Options for quality of
                    the genome and source (isolated or non isolated sample) can be used to narrow the desired data. Selection
                    of organism in the dot can be done to get specific organisms and download the full data of each one. </p>
                </div>
              </Grid>

              <Grid item xs={6}>
                <Player>
                  <source src={process.env.PUBLIC_URL + '/videos/table.mp4'} />
                  <BigPlayButton position="center" />
                </Player>
              </Grid>
            </Grid>

            <span id='advance_organism_search'></span>
            <Typography variant='h5' style={{marginTop:20}}>
              {'Advance search'}
            </Typography>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={5}
            >
              <Grid item xs={6}>
                <Player>
                  <source src={process.env.PUBLIC_URL + '/videos/table.mp4'} />
                  <BigPlayButton position="center" />
                </Player>
              </Grid>
              <Grid item xs={6}>
                <div>
                  Curated dataset of moderate acidophilic Archaea of genus <i>sulfolobus</i> with complete genomes.
                  <p align='justify'>All taxonomy ranks are available to use as filter. Growth range conditions add the “Can grow at”
                    feature that will search in the range each organism can grow. Detailed options of genome metadata are
                     available to filter. This tool download give a csv file with all fields available in the database
                     for all the results of the search.</p>
                </div>
              </Grid>
            </Grid>

          </Paper>


          <span id='methodology'></span>
          <Paper style={{ margin: 30, marginRight: '10%', boxShadow: 'none' }}>
            <Typography variant='h4' style={{ marginBottom: 15 }}>
              Methodology
            </Typography>
            <Typography paragraph align='justify'>
              {'AciDB is an extensive database of sequenced acidophilic microorganisms with emphasis in Bacterial and Archaeal genomes. The main focus of this database \
              are extremely acidophilic microorganisms (optimal pH <3.6 [ref]) but organisms that grow optimally up to pH 5 were also included. For the determination   \
              of the organisms’ pH and temperature optima these genomes belong to, the publications about the organisms and metadata associated to it were scanned. For \
              organisms without a clear associated pH, the species or genus’ average growth pH was considered. The genomes you will find here come from external genome \
              repositories such as NCBI refseq, NCBI genbank, and JGI. Both isolated strains and metagenome assembled genomes (MAGs) were included.'}
            </Typography>
            <Typography paragraph align='justify'>
              {'For proteomic data, the genomes’ predicted proteins were obtained from their respective databases, if present. Genomes without existing predicted proteomes \
              were annotated with PROKKA v1.13.3 [ref]. The genome quality was assesed using CheckM v1.0.12 [ref] using the standard lineage workflow and the “reduced tree” \
              option.'}
            </Typography>
            <Typography paragraph align='justify'>
              {'For every genome in this database a series of associated metadata was collected to provide clarity on these genomes’ characteristics and to increase the \
              amount of possible analysis able to be done on these genomes.'}
            </Typography>
          </Paper>

          <span id='organism_metadata'></span>
          <Paper style={{ margin: 30, marginRight: '10%', boxShadow: 'none' }}>
            <Typography variant='h5' style={{ marginBottom: 15 }}>
              Organism metadata
          </Typography>
            <Typography variant='h6'>
              General identifiers
            </Typography>
            <List>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Strain (s): '}</b>{'This is the strain designation given to either the sequenced monoclonal culture (strain) or the MAG. One genome can have several strain designations. At least one strain designation was included per genome. '}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Organism Name: '}</b>{'This is the genus and species of the strain. If no species or no genus is known, the most specific taxonomic classification is given (e.g Alicyclobacillus sp., Acidobacteria bacterium).'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Isolated: '}</b>{'“Yes” if the genome comes from a monoclonal culture, “No” if it was assembled from a metagenome (MAG) or from a single cell metagenomic project.'}
                </Typography>
              </ListItem>
            </List>

            <Typography variant='h6'>
              Genome accessions and annotation
            </Typography>
            <List >
              <ListItem >
                <Typography align='justify'>
                  <b>{'Source of genome: '}</b>{'The genome repository where this genome was obtained from. It’s Either GenBank, RefSeq, JGI or “Other”'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Annotation: '}</b>{'The method of annotation or source of predicted proteins of the genome. It’s either GenBank, RefSeq, JGI or “PROKKA”.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Accession id: '}</b>{'The Accession id for obtaining the genome in the repository mentioned in “Source of genome”'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'FTP URL: '}</b>{'The URL to the repository’s FTP containing the genome (if existing) and other genome related files for downloading.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Biosample: '}</b>{'NCBI accession id of the sample this microorganism was sequenced from.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Bioproject: '}</b>{'NCBI accession id of the sequencing project of this microorganism.'}
                </Typography>
              </ListItem>
            </List>

            <Typography variant='h6'>
              Genomic features
            </Typography>
            <List>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Assembly level: '}</b>{'“Complete” if it’s a closed genome, “Draft” if it’s not a closed genome and it’s missing parts of it.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Sequencing Date: '}</b>{'This is the date when the genome sequence was first fully submitted. It’s not the last modification date or the project starting date.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Genome Size: '}</b>{'This is the size of the genome in KB. It only considers the actual genome sequence.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'GC percentage: '}</b>{'The percentage of guanine/cytosine nucleotides in the sequenced genome.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Number of ORFs: '}</b>{'This is the number of predicted open reading frames from the genomic sequence.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Genome completeness: '}</b>{'The completeness level of the genome in percentage as predicted by the software CheckM. A value close to 100% indicates a nearly closed genome.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Genome contamination: '}</b>{'The contamination level of the genome in percentage as predicted by the software checkM. A 5% contamination indicates that about 5% of the genome sequence probably belongs to another organism.'}
                </Typography>
              </ListItem>
            </List>

            <Typography variant='h6'>
              Growth features
            </Typography>
            <List>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Optimum temperature: '}</b>{'The optimal temperature for growth of this strain, if known. If only growth range has been reported, the optimum temperature was calculated as the midpoint of the range. If no optimal or growth range have been reported, the observed growth range was considered as the optimal. If none of these data are available, the environmental temperature of the strain was reported. For MAGs, only environmental data was used.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Minimum temperature: '}</b>{'The minimum recorded temperature this organism can grow. If only one growth temperature is known (optimum or observed), a range of 10°C was assumed around the optimum, unless the only data available is environmental temperature.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Maximum temperature: '}</b>{'Analog for minimum but for the highest recorded value.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Optimum pH: '}</b>{'The optimal pH for growth of this strain, if known. If no optimal pH has been reported, the same criteria was used as in optimum temperature.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Minimum pH: '}</b>{'The minimum recorded pH this organism can grow. If only one growth pH is known, range of pH 1 was assumed around the optimum, unless the only data available is environmental pH.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Maximum pH: '}</b>{'Analog for minimum but for the highest recorded pH.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Temperature source: '}</b>{'Either “Optimum”, “Range”, “Growth” or “Environment” depending on how the optimum temperature was calculated.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'pH source: '}</b>{'Either “Optimum”, “Range”, “Growth” or “Environment” depending on how the optimum pH was calculated.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Temperature confidence: '}</b>{'How reliable is the information about growth temperature. It’s either High (detailed lab experiment with several growth temperatures tested), Medium (unspecific metadata or only observed growth), Low (isolation temperature) or unreliable (indirect information about the possible temperature of the organism’s environment).'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'pH confidence: '}</b>{'Analog for temperature confidence but for growth pH.'}
                </Typography>
              </ListItem>
            </List>

            <Typography variant='h6'>
              Taxonomy
            </Typography>
            <List>
              <ListItem>
                <Typography align='justify'>
                  <b>{'TaxID: '}</b>{'the NCBI id for this organism’s taxonomy.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Domain: '}</b>{'This organism’s domain.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Phylum: '}</b>{'This organism’s phylum, if known.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Class: '}</b>{'This organism’s class, if known.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Order: '}</b>{'This organism’s order, if known.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Family: '}</b>{'This organism’s family, if known.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Genus: '}</b>{'This organism’s genus, if known.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b> {'Species: '}</b>{'This organism’s species, if known.'}
                </Typography>
              </ListItem>
            </List>

            <Typography paragraph align='justify'>
              <b>{'Reference: '}</b>{'The reference to either the genome sequencing project’s publication or the temperatures and or pHs related to the genome. It’s either a publication in APA format, a culture collection, a biosample or a bioproject with relevant metadata. Several references can be found per genome.'}
            </Typography>

          </Paper>

          <span id='proteome_metadata'></span>
          <Paper style={{ margin: 30, marginRight: '10%', boxShadow: 'none' }}>
            <Typography variant='h5' style={{ marginBottom: 15 }}>
              Proteome metadata
          </Typography>
            <Typography paragraph align='justify'>
              {'The predicted proteome of all the genomes present in this database was analyzed with several softwares to determine their physicochemical and biochemical characteristics. This allows to search for functions among the acidophiles’ genomes and to provide increasing amounts data for statistical analysis. The available characteristics are:'}
            </Typography>
            <Typography variant='h6'>
              General characteristics
            </Typography>
            <List>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Protein length: '}</b>{'The length of the proteins in number of aminoacids'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Molecular Weight: '}</b>{'The mass of the protein in Daltons'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Isoelectric point: '}</b>{'The pH at which the polipeptide has a theoretical charge of zero (isoelectrical). This was calculated with the sofvtware IPC v1.0 with the ProMoST pKa dataset.'}
                </Typography>
              </ListItem>
            </List>
            <Typography variant='h6'>
              Subcellular localization
            </Typography>
            <List>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Psort: '}</b>{'The subcellular localization of the protein as predicted by the software PsortB v3.0. The options are: “c” cytoplasmatic, “im” inner membrane, “p” periplasm, “om” outer membrane, “w” cell wall, “e” exported and “u” unkown. '}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'SignalP: '}</b>{'The presence or absence of a translocation signal peptide, which migth be a TAT, SEC or a LIPO (Lipoprotein) signal peptide, as predicted by the software SignalP v5.0b.'}
                </Typography>
              </ListItem>
            </List>
            <Typography variant='h6'>
              Transmembrane predictions
            </Typography>
            <List>
              <ListItem>
                <Typography align='justify'>
                  <b>{'TMHMM: '}</b>{'The number of transmembrane regions as well as the topology as predicted by the software TMHMM v2.0c. The letter “i” means the first transmembrane segment has its N-terminal end towards the cytoplasm. The letter “o” is the other way around.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'HMMTOP: '}</b>{'The number transmembrane regions as well as the topology as predicted by the software HMMTOP. The symbology is the same as in TMHMM.'}
                </Typography>
              </ListItem>
            </List>
            <Typography variant='h6'>
              Functional annotation
            </Typography>
            <List>
              <ListItem>
                <Typography align='justify'>
                  <b>{'COG: '}</b>{'The id of the “Cluster of Ortholog Groups” (COG) functional domain annotation of the protein as predicted by the web tool '}<a href='http://eggnog-mapper.embl.de'>{'EggNog mapper v5.0'}</a>{' with default values.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'COG category: '}</b>{'The category of biological functions where this protein’s COG domain belongs to. See '}<a href='http://clovr.org/docs/clusters-of-orthologous-groups-cogs/'>{'http://clovr.org/docs/clusters-of-orthologous-groups-cogs/'}</a>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'Pfam:  '}</b>{'The id of the “Protein family” (Pfam) functional domain annotation of the protein as predicted by the software'}<a href='https://pfam.xfam.org/'>{' Pfam scan v1.6'}</a>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'EC number: '}</b>{'The id of the enzymatic reaction this protein might perform, if it was predicted to be an enzyme by EggNog mapper v5.0. See '}<a href='https://biocyc.org/'>{'https://biocyc.org/'}</a>
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'KEGG ko: '}</b>{'The id of the KEGG Orthology molecular function of the protein as predicted by EggNog mapper v5.0.'}
                </Typography>
              </ListItem>
              <ListItem>
                <Typography align='justify'>
                  <b>{'KEGG pathway: '}</b>{'The id of the pathway in the KEGG pathway collection this protein participates in as predicted by EggNog mapper v5.0.'}
                </Typography>
              </ListItem>
            </List>
          </Paper>



        </Grid>
      </Grid >

    </div >
  );
}


