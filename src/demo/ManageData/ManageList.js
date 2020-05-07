import React, { PureComponent } from "react";
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import ConfirmModal from '../Modal/ConfirmModal';
import ViewItem   from './ViewItem.js';
import icons from 'glyphicons';
import { findItems, deleteItemById, getTimeStamp } from '../../service/data-service';
import EditAsRawJson from '../EditRawJson/EditRawJson';
import EditCustomForm from '../DynamicForm/EditCustomForm';

class ManageList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
		alert : 'Please wait...',
		alertVariant : 'info'
	};
  }

  componentDidMount() {
	this.refresh('');
  }

  componentDidUpdate(prevProps) {
	if(prevProps.filter!== this.props.filter) {
	  this.refresh('');
	}
  }



  refresh = (msg) => {
	findItems(this.props.filter).then(
		(data) => {
			data = data.sort( (a,b) => a.id.localeCompare(b.id));
			this.setState( {
				data : data
			});
			this.showSuccess(`${msg? msg : ''} ${data.length} element(s) found.`);
			if(this.props.notifyResultList) {
				this.props.notifyResultList(data);
			}
		}, 
		(err) => {
			this.showError('Error while loading : ' +err);
		}
	);
  };


  askConfirmDelete = (itemToDelete) => {
	  console.log('delete item', itemToDelete);
	  this.setState({
		  itemToDelete });
  };

  confirmDelete = async () => {
	let itemToDelete = this.state.itemToDelete;
	this.setState({
		  itemToDelete : null });
	try {
		let res = await deleteItemById(itemToDelete);
		console.log('delete result', res);
		this.refresh('Deleted '+itemToDelete+". ");

	} catch(err) {
		this.showError('Error while deleting : ' +err);
	}
	

  };

  cancelDelete = () => {
	this.setState({
		  itemToDelete : null });
  };


  ViewItem = (itemToShow) => {
	  console.log('itemToShow', itemToShow);
	  this.setState({
		  itemToShow });
  };


  editCustomForm = (param) => {
	  this.setState({
		  customFormParam : param });
  };

  editRawJson = (item) => {
	  this.setState({
		  itemToEditAsRawJson : item,
	  });
  };


  needRefresh = false;

  notifyRefresh = () => { this.needRefresh=true; };
  conditionalRefresh = () => { 
	  if(this.needRefresh) { this.refresh(); this.needRefresh=false; } 
  };

  // find icons in \node_modules\glyphicons\glyphicons.js

	showError = (err) => {
			this.setState({ alert: err, alertVariant : 'danger'});
	};
	showWarn = (msg) => {
			this.setState({ alert: msg, alertVariant : 'warning' });
	};
	showSuccess = (msg) => {
			this.setState({ alert: msg, alertVariant : 'success', ready : true});
	};
	showInfo = (msg) => {
			this.setState({  alert: msg, alertVariant : 'info' });
	};



  render() {
	console.log('ManageList render ', this.props.filter);
    return (
	<div className="py-2">

			{ this.state.alert &&
				<Alert variant={this.state.alertVariant} >
					{this.state.alert}
				</Alert>
			}

		<ConfirmModal show={Boolean(this.state.itemToDelete)} 
			handleConfirm={this.confirmDelete} handleClose={this.cancelDelete} >
			<p>
				Do you want to delete the item ID {this.setState.itemToDelete} ?
			</p>
		</ConfirmModal>
  		
		{this.state.itemToShow && 
			<ConfirmModal show={Boolean(this.state.itemToShow)} 
				title={`View Item ID ${this.state.itemToShow}`}
				handleClose={() => { this.setState({itemToShow : null}); }} >
				<ViewItem item={this.state.itemToShow} />
			</ConfirmModal>
		}

		{this.state.itemToEditAsRawJson &&
			<ConfirmModal show={Boolean(this.state.itemToEditAsRawJson)} 
				size="lg"
				title={`Edit ${this.state.itemToEditAsRawJson.type} ID ${this.state.itemToEditAsRawJson.id} (as raw json)`}
				handleClose={() => { 
					this.conditionalRefresh();
					this.setState({itemToEditAsRawJson : null}); }} >
				<EditAsRawJson itemId={this.state.itemToEditAsRawJson.id} callbackRefresh={this.notifyRefresh} />
			</ConfirmModal>
		}

		{this.state.customFormParam && 
			<ConfirmModal show={Boolean(this.state.customFormParam)} 
				size="xl"
				title={this.state.customFormParam.id? `Edit item ID ${this.state.customFormParam.id}` 
							:  `Create a new object ${this.state.customFormParam.form}`  }
				handleClose={() => { 
					this.conditionalRefresh(); 
					this.setState({customFormParam : null}); }} >
				<EditCustomForm param={this.state.customFormParam} 
					callbackRefresh={this.state.customFormParam.form? null : this.notifyRefresh} />
			</ConfirmModal>
  		}

		{ this.state.data && 
		<Table striped bordered hover size="sm">
			<thead>
				<tr>
				<th>ID</th>
				
				{ this.props.showType &&
					<th>Type (Form ID)</th>
  				}
				<th>Description</th>
				<th>Custom form</th>
				<th>Simple actions</th>
				</tr>
			</thead>
			<tbody>
			{this.state.data.map((item) =>
				<tr key={item.id} >
					<td>{item.id}</td>
					{ this.props.showType &&
						<th>{item.type}</th>
					}
					<td>{item.description}</td>
					<td>
						{ (item.type==='FORM') &&
							<button onClick={() => this.editCustomForm({
										form : item.id, 
										suggestedId : `${item.id}_${getTimeStamp()}`})} 
								title={`New instance from the form ${item.id}`}   >
								{icons.plus}
							</button>
						}
						{ (item.type==='FORM') &&
							<button onClick={() => this.editCustomForm({id : item.id })} title={`Edit the form definition ${item.id}`}   >
								{icons.gear}
							</button>
						}
						{ (item.type!=='FORM') &&
							<button onClick={() => this.editCustomForm({id : item.id})} title={`Edit the object ${item.id} with the form ${item.type}`}  >
								{icons.memo}
							</button>
						}
					</td>
					<td >
						<button onClick={() => this.editRawJson(item) } title="Edit raw json" >
							{icons.pencil}
						</button>
						<button onClick={() => this.ViewItem(item.id)} title="View raw json"  >
							{icons.magnifyingGlass}
						</button>
						<button onClick={() => this.askConfirmDelete(item.id)} title="Delete" >
							{icons.wastebasket}
						</button>
					</td>
				</tr>
			)}
			</tbody>
		</Table>		
  		}
      </div>
    );
  }
};
export default ManageList;