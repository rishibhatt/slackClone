import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import {BrowserRouter as Router , Switch , Route, withRouter} from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import 'semantic-ui-css/semantic.min.css';
import firebase from './firebase';
import { Form } from 'semantic-ui-react';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import rootReducer from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';  
import Spinner from './Spinner';
import {setUser , clearUser} from './actions';
const store = createStore(rootReducer, composeWithDevTools());

class Root extends React.Component {
    componentDidMount()
    {
        
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.props.setUser(user);
                this.props.history.push("/");
            }else {
                this.props.history.push('/login');
                this.props.clearUser();
            }
        });
    }
    render() {
       
        return this.props.isLoading ? <Spinner /> : (
            
                <Switch>
                    <Route exact path = "/" component = {App} />
                    <Route path = "/login" component = {Login} />
                    <Route path = "/register" component = {Register} />
                </Switch>
            
        );

    }
} 

const mapStateFromProps = state => ({
    isLoading : state.user.isLoading

});

const RootWithAuth = withRouter(connect(mapStateFromProps, {setUser , clearUser})( Root));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
