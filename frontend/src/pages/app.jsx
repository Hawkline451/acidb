import React, { Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

import NavBar from '../components/navbar'
import Footer from '../components/footer'

import DocumentationComponent from '../components/documentation'
import TreeComponent from '../components/tree'
import TableComponent from '../components/table_component'
import OrganismComponent from '../components/organism'
import AdvanceSearchComponent from '../components/search_organism'
import AdvanceProteinSearchComponent from '../components/search_protein'
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
                <Route exact path="/app" component={DocumentationComponent} />
                <Route exact path="/app/organism/:id" component={OrganismComponent} />
                <Route exact path="/app/advance_search/:query" component={AdvanceSearchComponent} />
                <Route exact path="/app/advance_search/" component={AdvanceSearchComponent} />
                <Route exact path="/app/advance_protein_search/:query" component={AdvanceProteinSearchComponent} />
                <Route exact path="/app/advance_protein_search/" component={AdvanceProteinSearchComponent} />
                <Route exact path="/app/tools_tree" component={TreeComponent} />
                <Route exact path="/app/tools" component={Loader} />
                <Route exact path="/app/tools_table" component={TableComponent} />
                <Route exact path="/app/tools_scatter_plot" component={PlotComponent} />
                <Route exact path="/app/tools_bar_chart" component={SimpleBarComponent} />
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


