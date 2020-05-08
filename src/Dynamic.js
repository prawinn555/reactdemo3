import React, { Component } from 'react';

class Dynamic extends Component {
  constructor(props) {
    super(props);
    this.state = { module: null };
  }
  componentDidMount() {
	// import(this.props.path) => not work
    import(''+this.props.path)
      .then(module => this.setState({ module: module.default }))
	  .catch((e)=> console.log(e));
  }
  render() {
    const { module: Component } = this.state; 

    return(
      <div>
        {Component && <Component />}
      </div>
    )
  }
}
export default Dynamic;