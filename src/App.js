import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import SimpleMenu   from './menu/SimpleMenu';
import FormatJson   from './demo/FormatJson/FormatJson';
import ManageForms    from './demo/ManageForms/ManageForms';
import ManageData    from './demo/ManageData/ManageData';
import JsonFormExample     from './demo/DynamicForm/JsonFormExample';


//import dataLoaderAndFilter from "./dataLoaderAndFilter";


export default function App(props) {


    return (
      <div>

      <Router>

        <SimpleMenu selectedMenu={''} >
        </SimpleMenu>

        <hr/>
        
        <Switch>
          <Route path="/FormatJson">
            <FormatJson />
          </Route>
          <Route path="/ManageForms">
            <ManageForms />
          </Route>
          <Route path="/ManageData">
            <ManageData  />
          </Route>
          <Route path="/JsonFormExample">
            <JsonFormExample />
          </Route>
          <Route path="/">
            <h1>Please select a menu</h1>
          </Route>
        </Switch>
      </Router>

      </div>
      
    );
  
}

