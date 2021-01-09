import React from 'react';
import { Button, Input, Segment } from 'semantic-ui-react';
import firebase from '../../firebase';

class MessageForm extends React.Component {

    state  = {
        message : '',
        channel : this.props.currentChannel,
        user : this.props.currentUser,
        loading : false,
        errors:[]
    }

    createMessage = () => {
        const message = {
            timestamp :  firebase.database.ServerValue.TIMESTAMP,
            user : {
                id: this.state.user.uid,
                name : this.state.user.displayName,
                avatar : this.state.user.photoURL

            },
            content : this.state.message
        };
        return message;
    }

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };
    sendMessge = () => {
        const {messagesRef} = this.props;
        const {message , channel} = this.state;

        if (message) {
            this.setState({ loading : true});
            messagesRef.child(channel.id).push().set(this.createMessage())
                .then(() => { 
                    this.setState({ loading : false, message : '' , errors : []})
                })
                .catch(err => {
                    console.error(err);
                    this.setState({
                        loading: false,
                        errors : this.state.errors.concat(err)
                    })
                } )       }else {
                    this.setState({
                        errors : this.state.errors.concat({ message : 'Add a message'})
                    })
                }
    }
    render(){
        const { errors, message , loading} = this.state;
    
        return (
            <Segment className = "message__form">
                <Input fluid 
                    name = "message"
                    style = {{marginBottom : "0.7em"}}
                    label = {<Button icon = {'add'} />}
                    labelPosition = "left"
                    value = {message}
                    onChange = {this.handleChange}
                    placeholder = "write your message" />
                <Button.Group icon widths = "2">
                    <Button 
                        onClick = {this.sendMessge}
                        color = "orange"
                        disabled = {loading}
                        content = "Add Reply"
                        labelPosition = "left"
                        className = {errors.some(error => error.message.includes('message')) ? 'error' : ''}
                        icon = "edit"
                        />
                    <Button 
                        color = "teal"
                        content = "Upload media"
                        labelPosition = "right"
                        icon = "cloud upload"
                        />


                </Button.Group>

            </Segment>
        );
    }
    
}

export default MessageForm;
