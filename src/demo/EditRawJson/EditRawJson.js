import React, { PureComponent } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import ReactJson from 'react-json-view';
import { findItemById, saveItem, formatJson } from '../../service/data-service';

class EditRawJson extends PureComponent {
  constructor(props) {
	super(props);
	
	if(props.itemId) {
		this.state = { 
			success : 'Loading...'
		};
		findItemById(props.itemId).then(
			(data) => {
				if(data.length>0) {
					let formattedObject = formatJson(data[0].content);
					this.setState( {
						...data[0],
						idReadOnly : true,
						formattedObject,
						ready : true,
						success : '',
						error : ''
					});
					
				} else {
					this.setState( {error : 'Error : not found'});
				}
			}, 
			(err) => {
				this.setState( {error : 'Error while loading : ' +err});
			}
		);
	} else {
		// if ID not provided,
		// we show emptyForm.
		let content = '';
		this.state = {
			formattedObject : formatJson(content),
			id : '',
			description : '',
			content : content,
			type : this.props.objectType,
			ready : true,
			success : '',
			error : ''
		};
	}




  }

  handleFormChange = (ev) => {
	  let change = {};
      change[ev.target.name] = ev.target.value;
	  this.setState(change);
	  // console.log('handleFormChange', change);
  }

  save = async () => {
	try {
	  let obj = formatJson(this.state.content);
	  let res = await saveItem({
		id : this.state.id,
		type : this.state.type,
		description : this.state.description,
		content : this.state.content
	  });
	  console.log('result', res);
	  if(this.props.callbackRefresh) {
		  this.props.callbackRefresh();
	  }
	  this.setState( {
		  success : (res.status==='OK')? res.message : null,
		  error : (res.status!=='OK')? res.message : null,
		  formattedObject : obj
	  });
	} catch(err) {
	  console.log(err);
	  this.setState( {
		  success : null,
		  error : 'error ' +err,
	  });
	}
  };



  adjustRows = (str) => {
	if(!str) return 3;
	let lines = str.split('\n');
	return Math.min(lines.length + 1, 10);
  }

  render() {
    return (
      <div className="px-2" >

		{ this.state.success &&
			<Alert variant='success' >
				{this.state.success}
			</Alert>
		}
		{ this.state.error &&
			<Alert variant='danger' >
				{this.state.error}
			</Alert>
		}
		{ this.state.ready &&
			<>
				<Form>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
						<InputGroup.Text id="fieldLabel-id">Unique ID</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control 
							name="id"
							value={this.state.id}
							placeholder="required"
							onChange={this.handleFormChange}
							aria-describedby="fieldLabel-id"
							disabled={Boolean(this.state.idReadOnly)}
							/>
					</InputGroup>

					<InputGroup className="mb-3">
						<InputGroup.Prepend>
						<InputGroup.Text id="fieldLabel-description">Description</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control 
							name="description"
							value={this.state.description? this.state.description : ''}
							placeholder="describe your data"
							onChange={this.handleFormChange}
							aria-describedby="fieldLabel-description" />
					</InputGroup>

					<Form.Group controlId="content">
						<Form.Label>Json content</Form.Label>
						<Form.Control as="textarea" 
							name="content"
							rows={this.adjustRows(this.state.content)}
							placeholder={ `{ "value" : "3" }` }
							onChange={this.handleFormChange}
							value={this.state.content? this.state.content : ''}  />
					</Form.Group>

					<Button variant="primary"  onClick={this.save} >
						Save
					</Button>
				</Form>

				{this.state.formattedObject && 
					<div className="py-2" >
						<div>Json view</div>
						<ReactJson displayDataTypes={false} src={this.state.formattedObject} />
					</div>
  				}
			</>
  		}
      </div>
    );
  }
};
export default EditRawJson;