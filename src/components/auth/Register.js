import React from 'react';
import { Link } from 'react-router-dom';
import { Grid , Form , Segment , Button , Header , Message , Icon } from 'semantic-ui-react';
import firebase from '../../firebase';
import md5 from 'md5';

class Register extends React.Component {
    state = {
        username: ' ',
        email: '',
        password : '',
        passwordconfirmation: '',
        errors : [],
        loading: false,
        usersRef : firebase.database().ref('users')

    };

    isFormValid = () => {
        let errors = [];
        let error;
        if(this.isFormEmpty(this.state)){
            error = {message : "Fill in all fields"};
            this.setState({ errors: errors.concat(error)});
            return false;
        }else if(!this.isPasswordValid(this.state)){
            error = { message : "password is invalid"};
            this.setState({ errors: errors.concat(error)});
            return false;

            
            
        }else {
            return true;
        }
    }

    isFormEmpty = ({ username, email, password, passwordconfirmation}) => {
        return !username.length || !email.length || !password.length || !passwordconfirmation.length;
    }

    isPasswordValid = ({ password, passwordconfirmation}) => {
        if (password.length < 6 || passwordconfirmation.length <6 ){
            return false;
        } else if (password !== passwordconfirmation){
            return false;
        }else {
            return true;
        }

    }

    displayErrors = errors => errors.map((error,i) => <p key={i}>{error.message}</p>);

    

    handleChange = event =>{
        this.setState({[event.target.name]: event.target.value });

    }

    handleSubmit = event => {
        event.preventDefault(); 
        if(this.isFormValid()) {
            this.setState({ errors: [], loading: true});
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(createdUser => {
            console.log(createdUser);
            createdUser.user.updateProfile({
                displayName: this.state.username,
                photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
            }).then(() =>{
                this.saveUser(createdUser).then(() => {
                    console.log('user saved');
                    this.setState({loading: false});

                });
                 
            }).catch(err => {
                console.error(err);
                this.setState({ errors: this.state.errors.concat(err), loading: false});
            })
            }).catch(err => {
            console.error(err);
            this.setState({ errors: this.state.errors.concat(err), loading: false});
        });
    }
    };
saveUser = createdUser => {
    return this.state.usersRef.child(createdUser.user.uid).set({
        name: createdUser.user.displayName,
        avatar: createdUser.user.photoURL
    });


}


    handleInputError = (errors,inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    render(){
        const { username, email , password, passwordconfirmation, errors, loading } = this.state;
        return (
            <Grid textAlign = "center" verticalAlign="middle" className = "app">
                <Grid.Column style = {{ maxWidth: 450}}>
                    <Header as='h1' icon color = 'black' textAlign="center">
                        <Icon name = 'puzzle piece' color = 'black' />
                        Register for DevChat 🤖
                    </Header>
                    <Form size= "large" onSubmit= {this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name ="username" icon = "user" value = {username}
                            iconPosition ="left" placeholder = "username" onChange = {this.handleChange} type = "text" />
                            <Form.Input fluid name ="email" icon = "mail" value = {email} className = {this.handleInputError(errors, 'email')}
                            iconPosition ="left" placeholder = "Email address" onChange = {this.handleChange} type = "email" />
                            <Form.Input fluid name ="password" icon = "lock" value = {password}
                            iconPosition ="left" placeholder = "password" onChange = {this.handleChange} type = "password" className = {this.handleInputError(errors, 'password')} />
                            <Form.Input fluid name ="passwordconfirmation" icon = "repeat" value = {passwordconfirmation}
                            iconPosition ="left" placeholder = "confirm your password"  onChange = {this.handleChange} type = "password" className = {this.handleInputError(errors, 'password')} />
                            <Button disabled = {loading} className = {loading ? 'loading' : ''} color = "black" fluid size = "large">Submit</Button>

                        </Segment>

                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {this.displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a user? <Link to ="/login">Login.</Link>  </Message>
                </Grid.Column>
            </Grid>
        );
    }
}
export default Register;
