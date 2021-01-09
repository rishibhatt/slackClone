import React from 'react';
import { Link } from 'react-router-dom';
import { Grid , Form , Segment , Button , Header , Message , Icon } from 'semantic-ui-react';
import firebase from '../../firebase';


class Login extends React.Component {
    state = {
        
        email: '',
        password : '',
        
        errors : [],
        loading: false,
        

    };

    

    isFormEmpty = ({ username, email, password, passwordconfirmation}) => {
        return  !email.length || !password.length ;
    }



    displayErrors = errors => errors.map((error,i) => <p key={i}>{error.message}</p>);

    

    handleChange = event =>{
        this.setState({[event.target.name]: event.target.value });

    }

    handleSubmit = event => {
        event.preventDefault(); 
        if(this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true});
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(signedInUser => {
                console.log(signedInUser);
            }).catch(err => {
                console.error(err);
                this.setState({
                    errors: this.state.errors.concat(err),
                    loading: false
                });
            });
        }
    };

    isFormValid = ({ email, password}) => email && password;





    handleInputError = (errors,inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    render(){
        const {  email , password, errors, loading } = this.state;
        return (
            <Grid textAlign = "center" verticalAlign="middle" className = "app">
                <Grid.Column style = {{ maxWidth: 450}}>
                    <Header as='h2' icon color = 'black' textAlign="center">
                        <Icon name = 'puzzle piece' color = 'black' />
                        Login 🐱‍🏍
                    </Header>
                    <Form size= "large" onSubmit= {this.handleSubmit}>
                        <Segment stacked>
                            
                            <Form.Input fluid name ="email" icon = "mail" value = {email} className = {this.handleInputError(errors, 'email')}
                            iconPosition ="left" placeholder = "Email address" onChange = {this.handleChange} type = "email" />
                            <Form.Input fluid name ="password" icon = "lock" value = {password}
                            iconPosition ="left" placeholder = "password" onChange = {this.handleChange} type = "password" className = {this.handleInputError(errors, 'password')} />
                            
                            <Button disabled = {loading} className = {loading ? 'loading' : ''} color = "black" fluid size = "large">Submit</Button>

                        </Segment>

                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Don't have an account? <Link to ="/register">Register.</Link>  </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
export default Login;
