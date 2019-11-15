import React from "react";

import {
  Divider, List, ListItem, ListItemText, Grid, Typography, Paper,
} from '@material-ui/core';

// Styles
import { stylesDetail } from './css/themes'

// Internationalization
import { useTranslation } from 'react-i18next';

const useStylesDocumetation = stylesDetail

//Organism component
export default function DocumentationComponent(props) {
  const classes = useStylesDocumetation();
  const { t } = useTranslation();

  return (
    <div>
      <Grid container>
        <Grid item xs={1}>
          <div className={classes.fixedList}>
            <List>
              <ListItem className={classes.listItemTitle} button component="a" href={props.location.pathname + '#metodology'}>
                <ListItemText primary={
                <Typography type="body2" style={{ fontSize: 20 }}>{t('documentation.metodology')}</Typography>
                }/>
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#gen_metadata'}>
                <ListItemText primary={t('asd2')} />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#prot_metadata'}>
                <ListItemText primary={t('asd3')} />
              </ListItem>
              <Divider light />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#growth'}>
                <ListItemText primary={t('asd4')} />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#taxonomy'}>
                <ListItemText primary={t('asd5')} />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#references'}>
                <ListItemText primary={t('asd6')} />
              </ListItem>
              <Divider />

              <ListItem className={classes.listItemTitle} button component="a" href={props.location.pathname + '#features'}>
              <ListItemText primary={
                <Typography type="body2" style={{ fontSize: 20 }}>{t('documentation.features')}</Typography>
                }/>
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#gen_metadata'}>
                <ListItemText primary={t('asd2')} />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#prot_metadata'}>
                <ListItemText primary={t('asd3')} />
              </ListItem>
              <Divider light />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#growth'}>
                <ListItemText primary={t('asd4')} />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#taxonomy'}>
                <ListItemText primary={t('asd5')} />
              </ListItem>
              <Divider />
              <ListItem className={classes.listItem} button component="a" href={props.location.pathname + '#references'}>
                <ListItemText primary={t('asd6')} />
              </ListItem>
            </List>
          </div>
        </Grid>

        <Grid item xs={11} >
          <span id="metodology"></span>
          <Paper style={{ margin: 30, boxShadow: 'none' }}>
            <Typography variant='h5' style={{ marginBottom: 15 }}>
              metodoloy
          </Typography>
            <Typography paragraph align='justify'>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
              facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
              tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
              consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
              vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
              hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
              tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
              nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
              accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
          </Typography>
          </Paper>


          <span id="features"></span>
          <Paper style={{ margin: 30, boxShadow: 'none' }}>
            <Typography variant='h5' style={{ marginBottom: 15 }}>
              features
          </Typography>
            <Typography paragraph align='justify'>
              Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla
              facilisi etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac
              tincidunt. Ornare suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat
              consequat mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis risus sed
              vulputate odio. Morbi tincidunt ornare massa eget egestas purus viverra accumsan in. In
              hendrerit gravida rutrum quisque non tellus orci ac. Pellentesque nec nam aliquam sem et
              tortor. Habitant morbi tristique senectus et. Adipiscing elit duis tristique sollicitudin
              nibh sit. Ornare aenean euismod elementum nisi quis eleifend. Commodo viverra maecenas
              accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
          </Typography>
          </Paper>

        </Grid>
      </Grid>

    </div >
  );
}


