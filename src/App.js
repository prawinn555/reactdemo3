import React from "react";
import SimpleMenu   from './menu/SimpleMenu';
import Dynamic from './Dynamic';
import {getQueryStringValue} from './service/utils';


export default function App(props) {


	let menu = getQueryStringValue('menu') 
    console.log('menu', menu);

    return (
      <div>



        <SimpleMenu selectedMenu={''} >
        </SimpleMenu>

        <hr/>
		{menu &&  <Dynamic path={menu} /> }
   		{!menu && <div>Please select a menu</div>}


      </div>
      
    );
  
}

