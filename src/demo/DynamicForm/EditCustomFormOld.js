import React from "react";
import CustomForm from "@rjsf/core";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';
import ReactJson from 'react-json-view';
import { findItemById, saveItem, formatJson } from '../../service/data-service';

export default function EditCustomForm(props) {


	const [success, setSuccess] = React.useState('Loading...');
	const [error, setError] = React.useState(null);
	const [ready, setReady] = React.useState(false);
	const [formattedObject, setFormattedObject] = React.useState(null);
	const [schema, setSchema] = React.useState(null);
	const [map, setMap] = React.useState(new Map());

	const updateMap = (k,v) => {
		setMap(new Map(map.set(k,v)));
		console.log('updateMap', k, v);
		if(k==='content') {
			setFormattedObject(formatJson(v));
		} 
	}

	const showError = (err) => {
		setError(err);
		setSuccess(null);
	}

	React.useEffect( () => {
		if(props.param.id) {
			prefillForm(props.param.id, updateMap, setSchema)
			.then((r)=> { 
				setSuccess(null);
				setReady(true);
			}).catch((e)=> showError('Error while loading : '+e));
		} else {
			loadForm(props.param.form, setSchema)
			.then((form)=> {
				setSuccess(null);
				map.set('type', form.id);
				updateMap('id', form.id +'_' + props.param.suggestedId);
				setReady(true);
			})
			.catch((e)=> showError('Error while loading : '+e));
		}
	}, []);  // run only once

	const idReadOnly = Boolean(props.param.id);

  
	const handleFormChange = (ev) => {
		updateMap(ev.target.name, ev.target.value);
	};

	const onSubmit = async (data) => {
		try {
			console.log('submit', data);
			showError(null);
			setFormattedObject(data.formData);
			map.set('content', JSON.stringify(data.formData, null, ' '));

			let res = await saveItem({
				id : map.get('id'),
				type : map.get('type'),
				description : map.get('description'),
				content : map.get('content')
			});
			console.log('result', res);
			setSuccess((res.status==='OK')? res.message : null)
			setError( (res.status!=='OK')? res.message : null)

			if(res.status==='OK' && props.callbackRefresh) {
				props.callbackRefresh();
			}
		} catch(err) {
			console.log(err);
			setError('Error ' +err);
		}

	}
	const onError = (data) => {
		console.error('Form error', data);
	}




	return (
      <div className="px-2" >

		{ success &&
			<Alert variant='success' >
				{success}
			</Alert>
		}
		{ error &&
			<Alert variant='danger' >
				{error}
			</Alert>
		}
		{ ready &&
			<>
				<Form>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
						<InputGroup.Text id="fieldLabel-id">Unique ID</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control 
							name="id"
							value={map.get('id')}
							placeholder="required"
							onChange={handleFormChange}
							aria-describedby="fieldLabel-id"
							disabled={Boolean(idReadOnly)}
							/>
					</InputGroup>

					<InputGroup className="mb-3">
						<InputGroup.Prepend> 
						<InputGroup.Text id="fieldLabel-type">Type</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control 
							name="type"
							value={map.get('type')}
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
							value={map.get('description')? map.get('description') : ''}
							placeholder="describe your form"
							onChange={handleFormChange}
							aria-describedby="fieldLabel-description" />
					</InputGroup>
				</Form>
				<div className="px-2" >
					<CustomForm schema={schema}
							onSubmit={onSubmit}
							onError={onError} 
							formData={formattedObject}
							showErrorList={false}
							/>
				</div>

				{formattedObject && 
					<div className="py-2" >
						<div>Json view</div>
						<ReactJson displayDataTypes={false} src={formattedObject} />
					</div>
  				}
			</>
  		}
      </div>

	);
};

function prefillForm(id, updateMap, setSchema) {
	return findItemById(id).then(
			(listResult) => {
				if(listResult.length>0) {
					let item = listResult[0];
					for (let [key, value] of Object.entries(item)) {
						console.log(`${key}: ${value}`);
						updateMap(key, value);
					}
					return item;
				} else {
					return Promise.reject(`ID ${id} not found `);
				}
			}
	).then(
		(item) => loadForm(item.type, setSchema)
	);
}

function loadForm(form, setSchema) {
	return findItemById(form).then(
			(listResult) => {
				if(listResult.length>0) {
					let item = listResult[0];
					if(item.type!=='FORM') {
						return Promise.reject(`Object ID ${form} must be of type FORM (actuel ${item.type})`);
					}
					let schema = formatJson(item.content);
					if(!schema || !schema.properties) {
						return Promise.reject(`Form ID ${form} has invalide schema (actuel ${item.content})`);
					}
					setSchema(schema);
					return item;
				} else {
					return Promise.reject(`Form ID ${form} not found `);
				}
	});
}