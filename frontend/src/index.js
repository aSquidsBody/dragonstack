import React from 'react';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { Router, Switch, Route, Redirect } from 'react-router-dom';  // npm i react-router and npm i react-router-dom
import { render } from 'react-dom';
import thunk from 'redux-thunk';
import rootReducer from './reducers';  // Don't need to specify index.js since index.js is used by default
import history from './history';
import Root from './components/Root';
import AccountDragons from './components/AccountDragons';
import PublicDragons from '/components/PublicDragons';
import { fetchAuthenticated } from './actions/account';
import './index.css';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(thunk)),  // thunk is a middleware which allows for actionCreates to return functions
);

// stateless functional component
// higher order component since it takes in a component and returns one
const AuthRoute = props => {
    if (!store.getState().account.loggedIn) {
        return <Redirect to={{ pathname: '/' }} />
    }

    const { component, path } = props;

    return <Route path={path} component={component} />
}


// make sure that the user has been authenticated before rendering
// fetchAuthenticated affects the loggedIn value of the redux state, which determines which page loads
store.dispatch(fetchAuthenticated())
    .then(() => {
        render(
            <Provider store={store}>
                <Router history={history}>
                    <Switch>
                        <Route exact={true} path='/' component={Root} />
                        <AuthRoute path='/account-dragons' component={AccountDragons} />
                        <AuthRoute path='/public-dragons' component={PublicDragons} />
                    </Switch>
                </Router>
            </Provider>,
            document.getElementById('root')
        );
    });


