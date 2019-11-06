import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import NavBar from '../components/navbar'
import Footer from '../components/footer'

import TreeComponent from '../components/tree'
import TableComponent from '../components/table_component'
import OrganismComponent from '../components/organism'
import AdvanceSearchComponent from '../components/advance_search'
import PlotComponent from '../components/plot'
import SimpleBarComponent from '../components/plot_bar_chart'
import { Loader } from '../components/loader'

import { ThemeProvider } from '@material-ui/styles';
import { theme } from '../components/css/themes'

function Page(props) {
  return (
    <ThemeProvider theme={theme}>
        <div>
          <NavBar {...props}/>
          <Route
            path="/app"
            render={() => (
              <Switch>
                <Route path="/app/organism/:id" component={OrganismComponent} />
                <Route path="/app/advance_search/:query" component={AdvanceSearchComponent} />
                <Route path="/app/advance_search/" component={AdvanceSearchComponent} />
                <Route path="/app/tools_tree" component={TreeComponent} />
                <Route path="/app/tools" component={Loader} />
                <Route path="/app/tools_table" component={TableComponent} />
                <Route path="/app/tools_scatter_plot" component={PlotComponent} />
                <Route path="/app/tools_bar_chart" component={SimpleBarComponent} />
              </Switch>
            )}
          />
          <Footer />
        </div>
    </ThemeProvider>
  );
}

const AppPage = (props) => {

  return (
    <Suspense fallback={<Loader />}>
      <Page {...props}/>
    </Suspense>
  );
};
export default AppPage


