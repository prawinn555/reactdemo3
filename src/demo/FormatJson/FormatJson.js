import React, { PureComponent } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ReactJson from 'react-json-view';

class FormatJson extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
		formattedObject : {},
		jsonContent : `{ "value" : "3" }`
    };
  }

  handleFormChange = (ev) => {
	  var change = {};
      change[ev.target.name] = ev.target.value;
	  this.setState(change);
	  console.log('handleFormChange', change);
  }

  formatJson = () => {

	  var obj = {};
	  try {
		 obj = JSON.parse(this.state.jsonContent);
	  } catch(err) {
		  obj = {
			  err : (''+err)
		  };
	  }
	  this.setState( {
		  formattedObject : obj
	  });
	  console.log('formatJson', obj);
  }

  render() {
    return (
      <div className="px-2" >

		<Form>

			<Form.Group controlId="jsonContent">
				<Form.Label>Json content</Form.Label>
				<Form.Control as="textarea" row="5"
					name="jsonContent"
					placeholder={ `{ "value" : "3" }` }
					onChange={this.handleFormChange}
					value={this.state.jsonContent}  />
			</Form.Group>

			<Button variant="primary"  onClick={this.formatJson} >
				Format
			</Button>
		</Form>

        <div className="py-2" >
	      <ReactJson displayDataTypes={false} src={this.state.formattedObject} />
		</div>

      </div>
    );
  }
}
export default FormatJson;