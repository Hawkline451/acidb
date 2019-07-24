import React from 'react';
import {
  Grid, Typography, Box
} from '@material-ui/core';

const NotFoundPage = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh' }}
    >
      <Typography component='div'>
        <Box fontSize={64} m={1}>
          ¯\_(ツ)_/¯
      </Box>
      </Typography>
    </Grid>
  );
};
export default NotFoundPage;