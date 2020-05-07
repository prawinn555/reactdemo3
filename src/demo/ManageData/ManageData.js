import React, { PureComponent } from "react";
import icons from 'glyphicons';
import ManageList from './ManageList';
import Dropdown from 'react-bootstrap/Dropdown';
import { findItems, getTimeStamp } from '../../service/data-service';
import ConfirmModal from '../Modal/ConfirmModal';
import EditCustomForm from '../DynamicForm/EditCustomForm';

class ManageData extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
		selectedIndex : null,
	    formList : []
	};
	this.refreshCount=1;
  }
  
  componentDidMount() {
	this.refresh();
  }  

  refresh = () => {
	findItems("type=FORM").then(
		(data) => {
			data = data.sort( (a,b) => a.id.localeCompare(b.id));
			this.setState( {
				formList : data,
				error : ''
			});
		}, 
		(err) => {
			this.setState( {
				error : 'Error while loading : ' +err
			});
		}
	);
  };

  select = (ev) => {
	  let i = ev.target.getAttribute('data-index');
	  if(i === undefined) {
		  i = null;
	  }
	  this.setState({selectedIndex : i});
  };

  editCustomForm = () => {
	  this.setState({
		  customFormParam : {
			  form : this.getSelectedForm().id,
			  suggestedId : `${this.getSelectedForm().id}_${getTimeStamp()}`
		  } });
  };
  
  getSelectedForm = () => {
	if(!this.state.selectedIndex) {
		return null;
	}
	return this.state.formList[this.state.selectedIndex];
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
				title={this.state.customFormParam.id? `Edit item ID ${this.state.customFormParam.id}` 
							:  `Create a new object ${this.state.customFormParam.form}`  }
				handleClose={this.closeCreationModal} >
				<EditCustomForm param={this.state.customFormParam} callbackRefresh={this.notifyRefresh} />
			</ConfirmModal>
		}
		
		<Dropdown className="px-2">
		<Dropdown.Toggle variant="primary" id="dropdown-basic">
			Filter by an object type
		</Dropdown.Toggle>

		<Dropdown.Menu>
			<Dropdown.Item href="#" onClick={this.select} 
				key="all" ><b>All data</b></Dropdown.Item>
			{ this.state.formList.map ( (v,index) => 
			<Dropdown.Item href="#" onClick={this.select} 
				key={v.id} data-index={index}>{`${v.id} - ${v.description}`}</Dropdown.Item>
			)}
		</Dropdown.Menu>
		</Dropdown>

		<ManageList
			 filter={this.state.selectedIndex? 
					`type=${this.state.formList[this.state.selectedIndex].id}&refreshCount=${this.refreshCount}` : 
					`type=FORM&opposite=true&refreshCount=${this.refreshCount}`} 
			 showType="true" />

		
      
          New instance 
				{this.state.selectedIndex && 
		  			` of ${this.state.formList[this.state.selectedIndex].id} `
  				}
				: 
                <span className="px-2" >
				  { this.state.selectedIndex?
					<button onClick={this.editCustomForm} >
						{icons.plus}
					</button> :
					<span style={ {color:'grey'} } >
						Choose a type to create an instance.
					</span>
				  }
                </span>
        </div>

    );
  }
};
export default ManageData;