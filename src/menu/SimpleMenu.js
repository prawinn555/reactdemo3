import React, { PureComponent } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import icons from 'glyphicons';


class SimpleMenu extends PureComponent {

  menuListe = [
            ["ManageData" ,"Manage your data"],
            ["ManageForms"   ,"Manage your forms"],

            ["FormatJson" , "Example : How to format Json"],
            ["JsonFormExample" ,"Example : Dynamic form"],
  ];

  constructor(props) {
    super(props);
    this.state = {
       menuItemText : ""
    };

    let menuKey =  window.location.pathname;
    console.log('window.location', window.location);
    
    let menu = this.menuListe.find(element => '/'+element[0] === menuKey );
    if(menu) {
      this.state.menuItemText = menu[1];
    }
  };



  render() {
    return (<div className="container">

      <div className="row">
        
        {icons.rabbitFace}
        Welcome !!
        {icons.rabbit}

        <Dropdown className="px-2">
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            Menu
          </Dropdown.Toggle>

          <Dropdown.Menu>
            { this.menuListe.map ( (v,index) => 
              <Dropdown.Item href="#" onClick={ () => window.location.href='/'+v[0]} 
                   key={v[0]}>{v[1]}</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>

         <header>{this.state.menuItemText}</header>
      </div>
    </div>);
  }
}
export default SimpleMenu;
