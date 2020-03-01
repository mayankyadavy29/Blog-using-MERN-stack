import React, { Component } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { fetchProfile, clearProfile, updateProfile } from '../../actions/index';

class Profile extends Component {

  componentDidMount() {
    if (!this.props.initialValues) {
      this.props.fetchProfile();  
    }
  }

  componentWillUnmount() {
    this.props.clearProfile();  
  }

  handleFormSubmit({ firstName, lastName, birthday, sex, phone, address, occupation, description }) {
    this.props.updateProfile({ firstName, lastName, birthday, sex, phone, address, occupation, description }, (path, state) => {  
      this.props.history.replace(path, state);
    });
  }

  renderInput = (field) => (
    <fieldset className="form-group">
      <label>{field.label}</label>
      <input
        className="form-control"
        {...field.input}
        type={field.type}
        required={field.required? 'required' : ''}
        disabled={field.disabled? 'disabled' : ''}
      />
    </fieldset>
  );

  renderOptions = (field) => (
    <fieldset className="form-group">
      <label>{field.label}</label>
      <select className="form-control" {...field.input}>
        <option />
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </fieldset>
  );

  renderTextarea = (field) => (
    <fieldset className="form-group">
      <label>{field.label}</label>
      <textarea className="form-control" {...field.input} />
    </fieldset>
  );

  renderAlert() {

    const { state } = this.props.history.location;
    const { action } = this.props.history;

    if (state && action === 'REPLACE') {

      return (
        <div className={`alert ${state.status === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
          {`[${state.time}] --- `} <strong>{state.status === 'success' ? 'Congratulations!' : 'Oops!'}</strong> {state.message}
        </div>
      );
    }
  }

  render() {

    if (!this.props.initialValues) { 
      return <div>Loading...</div>
    }

    const { handleSubmit } = this.props;

    return (
      <div>
        { this.renderAlert() }
        <form className="form-profile" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
          <h3>Profile</h3>
          <hr />
          <Field name="email" component={this.renderInput} type="email" label="Email:" disabled={true} />
          <Field name="firstName" component={this.renderInput} type="text" label="First Name:" required={true} />
          <Field name="lastName" component={this.renderInput} type="text" label="Last Name:" required={true} />
          <Field name="birthday" component={this.renderInput} type="date" label="Birthday:" />
          <Field name="sex" component={this.renderOptions} label="Sex:" />
          <Field name="phone" component={this.renderInput} type="text" label="Phone:" />
          <Field name="address" component={this.renderInput} type="text" label="Address:" />
          <Field name="occupation" component={this.renderInput} type="text" label="Occupation:" />
          <Field name="description" component={this.renderTextarea} label="Description:" />
          <button action="submit" className="btn btn-primary">Update Profile</button>
        </form>
      </div>
    );
  }
}


Profile = reduxForm({
  form: 'profile',  
})(Profile);

function mapStateToProps(state) {
  return { initialValues: state.profile.user }; 
}

export default connect(mapStateToProps, { fetchProfile, clearProfile, updateProfile })(Profile);