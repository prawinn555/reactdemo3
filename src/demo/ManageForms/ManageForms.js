import React, { PureComponent } from "react";
import icons from 'glyphicons';
import ManageList from '../ManageData/ManageList';
import ConfirmModal from '../Modal/ConfirmModal';
import EditCustomForm from '../DynamicForm/EditCustomForm';
import formCatalogRandom from './formCatalog';

class ManageForms extends PureComponent {

  constructor(props) {
    super(props);
    this.state = { };
    this.refreshCount=1;
  }

  createForm = () => {
	  this.setState({
      customFormParam : formCatalogRandom()
    })
  };
  

  closeCreationModal = () => {
	  this.setState({customFormParam : null}); 
  }

  notifyRefresh = ()=> {
	  // force refresh.
	  this.refreshCount++;
  }


  render() {
    return (   
      <div className="px-2" >


        {this.state.customFormParam && 
          <ConfirmModal show={Boolean(this.state.customFormParam)} 
            size="xl"
            title={`Create a new form`}
            handleClose={this.closeCreationModal} >
            <EditCustomForm param={this.state.customFormParam} callbackRefresh={this.notifyRefresh} />
          </ConfirmModal>
        }

        <ManageList filter={`type=FORM&refreshCount=${this.refreshCount}`} />
        
        New form : 
                <span className="px-2" >
                  <button onClick={this.createForm} >
                    {icons.plus}
                  </button>
                </span>
      </div>
    );
  }
};
export default ManageForms;