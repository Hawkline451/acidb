import React from 'react';
import {
  Grid, Typography, Box
} from '@material-ui/core';

const OrganismNotFoundPage = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Typography component='div'>
        <Box fontSize={64} m={1}>
          ¯\_(ツ)_/¯ Organism not found
      </Box>
      </Typography>
    </Grid>
  );
};
export default OrganismNotFoundPage;