import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, FormControl } from 'react-bootstrap';
import { signup, login } from '../actions/account';
import fetchStates from '../reducers/fetchStates';

class AuthForm extends Component {
    /* We do not use redux here since none of the data is global.
    this.state is sufficient
    */

    state = { username: '', password: '', buttonClicked: false };

    // custom method
    updateUsername = event => {
        // user input contained in the object which dispatched the event
        // this object is known as the target. So event.target contains the value
        this.setState({ username: event.target.value })
    }

    // custom method
    updatePassword = event => {
        // user input contained in the object which dispatched the event
        // this object is known as the target. So event.target contains the value
        this.setState({ password: event.target.value })
    }

    signup = () => {
        this.setState({ buttonClicked: true });

        const { username, password } = this.state;

        this.props.signup({ username, password });
    }

    login = () => {
        this.setState({ buttonClicked: true });

        const { username, password } = this.state;

        this.props.login({ username, password });
    }

    // capitalized because it returns JSX
    // functions are not valid React children, so return the function with get. So react views it by its return value
    get Error() {
        if (
            this.state.buttonClicked &&
            this.props.account.status === fetchStates.error
            ) {
            return <div>{this.props.account.message}</div>
        }
    };

    render() {
        return (
            <div>
                <h2>Dragon Stack</h2>
                <FormGroup>
                    <FormControl 
                    type='text'
                    value={this.state.username}
                    placeholder='username'
                    onChange={this.updateUsername}
                />
                </FormGroup>
                <FormGroup>
                    <FormControl 
                    type='password'
                    value={this.state.password}
                    placeholder='password'
                    onChange={this.updatePassword}
                />
                </FormGroup>
                <div>
                    <Button onClick={this.login}>Log In</Button>
                    <span> or </span>
                    <Button onClick={this.signup}>Sign Up</Button>
                </div>
                <br />
                {this.Error}
            </div>
        );
    }
}

export default connect(
    ({ account }) => ({ account }), // state to props function
    { signup, login }  // dispatch to props function
)(AuthForm);