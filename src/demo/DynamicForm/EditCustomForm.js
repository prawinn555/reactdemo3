import React, { PureComponent } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import AutoFocusAlert from '../Alert/AutoFocusAlert';
import ReactJson from 'react-json-view';
import { findItemById, saveItem, formatJson } from '../../service/data-service';
import DynamicFormChild from './DynamicFormChild';
import SchemaForm from './SchemaForm';

class EditCustomForm extends PureComponent {


	constructor(props) {
		super(props);
		// item id : props.item 
		this.state = {
			alert : 'Loading...',
			varient : 'info'
		};
		this.idReadOnly = Boolean(props.param.id);
		this.dataForRJSF = {};
	}

	componentDidMount() {
		// the call 'setState' is available after 'mount.
		if(this.props.param.id) {
			console.log('create an prefield form');
			this.prefillForm(this.props.param.id)
			.then(()=> { 
				this.showSuccess()
			}).catch((e)=> this.showError('Error while loading : '+e));
		} else {
			console.log('create an empty form');
			this.loadSchema(this.props.param.form)
			.then((form)=> {
				this.setState({ 
					id : this.props.param.suggestedId,
					type : form.id,
					description : this.props.param.initialDescription? this.props.param.initialDescription : null,
					dataToSave : this.props.param.initialData? this.props.param.initialData : null 
				});
				this.dataForRJSF = this.adaptFormDefinition(this.props.param.initialData, form.id);
				return this.showSuccess();
			})
			.catch((e)=> {
				console.log(e);
				this.showError('Error while loading : '+e)} );
		}
	}



   prefillForm = async (id) => {
		return findItemById(id).then(
				(listResult) => {
					if(listResult.length>0) {
						let item = listResult[0];
						let chg = {};
						for (let [k, v] of Object.entries(item)) {
							if(k==='content') {
								let d = formatJson(v);
								chg.dataToSave = d;
								this.dataForRJSF = this.adaptFormDefinition(d, item.type);
							} else {
								chg[k] = v;
							}
						}
						console.log('setState',chg);
						this.setState(chg);
						return item;
					} else {
						return Promise.reject(`ID ${id} not found `);
					}
				}
		).then(
			(item) => this.loadSchema(item.type)
		);
	};

	loadSchema = async (form) => {
		if(form === 'FORM') {
			this.setState({schema : SchemaForm});
			console.log('use SchemaForm', SchemaForm);
			return Promise.resolve({id:'FORM', description:'meta schema', schema : SchemaForm });
		}
		return findItemById(form).then(
				(listResult) => {
					if(listResult.length>0) {
						let item = listResult[0];
						if(item.type!=='FORM') {
							return Promise.reject(`Object ID ${form} must be of type FORM (found ${item.type})`);
						}
						let schema = formatJson(item.content);
						if(!schema || !schema.properties) {
							return Promise.reject(`Form '${form}' has invalide schema (found ${item.content})`);
						}
						this.setState({schema});
						return item;
					} else {
						return Promise.reject(`Form '${form}' not found `);
					}
		});
	};


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

	handleFormChange = (ev) => {
		let change = {};
		change[ev.target.name] = ev.target.value;
		this.setState(change);
		// console.log('handleFormChange', change);
	};

	
    onSubmit = async (data) => {
		try {
			console.log('submit', data);
			this.showInfo('Saving...');
			let dataToSave = this.transformToSave(data.formData);
			this.setState({dataToSave});
			let content = JSON.stringify(dataToSave, null, ' ');
			let res = await saveItem({
				id : this.state.id,
				type : this.state.type,
				description : this.state.description,
				content : content
			});
			// console.log('result', res);
			if(res.status==='OK') {
				this.showSuccess(res.message);
			} else {
				this.showError(res.message);
			}
			if(res.status==='OK' && this.props.callbackRefresh) {
				this.props.callbackRefresh();
			}
		} catch(err) {
			console.log(err);
			this.showError('' +err);
		}

	};

	transformToSave = (json) => {
		if(this.state.type!=='FORM') {
			return json;
		}
		// transform 'listFields' to 'properties'
		if(!json.listFields) {
			return json;
		}
		json = Object.assign({}, json);
		json.type = 'object';
		json.properties = {};
		json.required = [];
		json.listFields.forEach( (propOriginal, i) => {
			let prop = Object.assign({}, propOriginal);
			json.properties[prop.fieldName] = prop;
			if(prop.booleanRequired) {
				json.required.push(prop.fieldName);
			}
			delete prop.fieldName;
			if(prop.type==='date') {
				prop.type = 'string';
				prop.format = 'date';
			} else if(prop.type==='enum') {
				delete prop.type;
				prop.enum = [];
				if(prop.enumValues) {
					//console.log('prop.enumValues', prop.enumValues);
					prop.enumValues.split(',').forEach(
						(s) => {
							prop.enum.push(s.trim());
						}
					);
					delete prop.enumValues;
				}
			}
		});
		delete json.listFields;
		console.log('transformToSave', json);
		return json
	}

	adaptFormDefinition = (jsonOriginal, type) => {
		if(!jsonOriginal) {
			return {};
		}
		if(type!=='FORM') {
			return jsonOriginal;
		}
		let json = Object.assign({},jsonOriginal);
		// transform 'listFields' to 'properties'
		if(!json.properties) {
			return json;
		}
		json.listFields = [];
		Object.getOwnPropertyNames(json.properties).forEach( (v, i) => {
			let prop = json.properties[v];
			prop.fieldName = v;
			if(prop.format==='date') {
				prop.type = 'date';
				delete prop.format;
			} else if(prop.enum) {
				prop.type = 'enum';
				prop.enumValues = prop.enum.join(', ');
				delete prop.enum;
			}
			if(json.required && json.required.includes(v)) {
				prop.booleanRequired = true;
			}
			json.listFields.push(prop);
		});
		delete json.properties;
		console.log('adaptFormDefinition', jsonOriginal, json);
		return json
	}

    onError = (e) => {
		this.showWarn(`Problem with a form? 
			${(e && e[0] && e[0].stack)? e[0].stack : ''}` );
		console.log('Form error', e);
	};







  	render() {

		return ( <div className="px-2" >

			<AutoFocusAlert alert={this.state.alert} alertVariant={this.state.alertVariant} >
			</AutoFocusAlert>

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
								disabled={Boolean(this.idReadOnly)}
								/>
						</InputGroup>

						<InputGroup className="mb-3">
							<InputGroup.Prepend> 
							<InputGroup.Text id="fieldLabel-type">Type</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control 
								name="type"
								value={this.state.type}
								aria-describedby="fieldLabel-type"
								disabled
								/>
						</InputGroup>

						<InputGroup className="mb-3">
							<InputGroup.Prepend>
							<InputGroup.Text id="fieldLabel-description">Description</InputGroup.Text>
							</InputGroup.Prepend>
							<Form.Control 
								name="description"
								value={this.state.description? this.state.description : ''}
								placeholder="describe your form"
								onChange={this.handleFormChange}
								aria-describedby="fieldLabel-description" />
						</InputGroup>
					</Form>
					<div className="px-2" >
						<DynamicFormChild schema={this.state.schema}
								onSubmit={this.onSubmit}
								onError={this.onError} 
								formData={this.dataForRJSF}
								>
						</DynamicFormChild>
					</div>

					
					{this.state.dataToSave && 
						<div className="py-2" >
							<div>View JSON data</div>
							<ReactJson displayDataTypes={false} src={this.state.dataToSave} collapsed="true"/>
						</div>
					}
				</>
			}	
		</div>);
 	}

};
export default EditCustomForm;
