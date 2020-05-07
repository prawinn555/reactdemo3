import React, { PureComponent } from "react";
import Alert from 'react-bootstrap/Alert';

class AutoFocusAlert extends PureComponent {

  constructor(props) {
    super(props);
    this.refAlert = React.createRef();    
  }
  componentDidMount() {
    this.scrollToVisible(); 
  }
  componentDidUpdate() {
    this.scrollToVisible();
  }

  scrollToVisible() {
    if(this.props.alert && this.refAlert) {
			this.refAlert.current.scrollIntoView();
			// console.log('scrollIntoView', this.refAlert.current);
		}
  }


  render() {
    return 	<>		
      { this.props.alert &&
				<Alert variant={this.props.alertVariant} ref={this.refAlert} >
					{this.props.alert}
				</Alert>
			}
      </>;
  }
}
export default AutoFocusAlert;
  
  