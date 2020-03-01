import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';  
import { signupUser } from '../../actions';

class Signup extends Component {

  componentWillMount() {
    if (this.props.authenticated) {  
      this.props.history.replace('/posts');
    }
  }

  handleFormSubmit({ email, password, firstName, lastName }) {
    this.props.signupUser({ email, password, firstName, lastName }, (path, state) => {
      this.props.history.push(path, state);
    }, (path, state) => {  
      this.props.history.replace(path, state);
    });
  }

  renderField = ({ label, input, type, meta: { touched, error, warning } }) => (
    <fieldset className="form-group">
      { /*<label>{label}</label>*/ }
      <input className="form-control" placeholder={label} {...input} type={type} required='required' />
      { touched && error && <span className="text-danger">{error}</span> }
    </fieldset>
  );

  renderAlert() {

    const { state } = this.props.history.location;
    const { action } = this.props.history;

    if (state && action === 'REPLACE') {
      return (
        <div className="alert alert-danger">
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
          <h3>Sign Up</h3>
          <hr />
          <Field name="firstName" component={this.renderField} type="text" label="First Name"/>
          <Field name="lastName" component={this.renderField} type="text" label="Last Name"/>
          <Field name="email" component={this.renderField} type="email" label="Email"/>
          <Field name="password" component={this.renderField} type="password" label="Password"/>
          <Field name="passwordConfirm" component={this.renderField} type="password" label="Confirm Password"/>
          <button type="submit" className="btn btn-primary">Sign Up</button>
        </form>
      </div>
    );
  }
}

function validate(formProps) {

  const errors = {};

  if (formProps.password !== formProps.passwordConfirm) {
    errors.passwordConfirm = 'Password must match!';
  }

  return errors;
}

Signup = reduxForm({
  form: 'signup',
  validate: validate
})(Signup);

function mapStateToProps(state) {
  return { authenticated: state.auth.authenticated };
}

export default connect(mapStateToProps, { signupUser })(Signup);