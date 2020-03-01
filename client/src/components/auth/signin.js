import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { signinUser } from '../../actions';

class Signin extends Component {

  componentWillMount() {
    if (this.props.authenticated) { 
      this.props.history.replace('/posts');
    }
  }

  handleFormSubmit({ email, password }) {
    this.props.signinUser({ email, password }, (path) => {
      this.props.history.push(path);
    }, (path, state) => { 
      this.props.history.replace(path, state);
    });
  }

  renderField = (field) => (
    <fieldset className="form-group">
      { /*<label>{field.label}</label>*/ }
      <input className="form-control" placeholder={field.label} {...field.input} type={field.type} required='required' />
    </fieldset>
  );

  renderAlert() {

    const { state } = this.props.history.location;
    const { action } = this.props.history;    
    if (state && action === 'PUSH') {
      return (
        <div className="alert alert-success" role="alert">
          {`[${state.time}] --- `} <strong>Congratulations!</strong> {state.message}
        </div>
      );
    }    
    if (state && action === 'REPLACE') {
      return (
        <div className="alert alert-danger" role="alert">
          {`[${state.time}] --- `} <strong>Oops!</strong> {state.message}
        </div>
      );
    }
  }

  render() {

    const { handleSubmit } = this.props;
    return (
      <div>
        {this.renderAlert()}
        <form className="form-signin" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <h3>Sign In</h3>
          <hr />
          <Field name="email" component={this.renderField} type="email" label="Email" />
          <Field name="password" component={this.renderField} type="password" label="Password" />
          <button action="submit" className="btn btn-primary">Sign In</button>
        </form>
      </div>
    );
  }
}

Signin = reduxForm({
  form: 'signin',  
})(Signin);

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, { signinUser })(Signin);