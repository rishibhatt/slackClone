import React from 'react';
import uuidv4 from 'uuid/v4';
import { Button, Input, Segment } from 'semantic-ui-react';
import firebase from '../../firebase';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

class MessageForm extends React.Component {

    state  = {
        uploadState:'',
        uploadTask:   null,
        storageRef: firebase.storage().ref(),
        percentUploaded:0,
        message : '',
        channel : this.props.currentChannel,
        user : this.props.currentUser,
        loading : false,
        errors:[],
        modal: false
    };
    

    openModal = () => this.setState({
        modal: true

    }) ;
    closeModal = () => this.setState({
        modal: false

    }) ;
    createMessage = (fileUrl = null) => {
        const message = {
            timestamp :  firebase.database.ServerValue.TIMESTAMP,
            user : {
                id: this.state.user.uid,
                name : this.state.user.displayName,
                avatar : this.state.user.photoURL

            },
            
        };
        if (fileUrl !== null) {
            message['image'] = fileUrl;

        }else{
            message['content'] = this.state.message;
        }
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
    };

    uploadFile= (file,metadata) => {
        const pathToUpload= this.state.channel.id;
        const ref = this.props.messagesRef;
        const filePath = `chat/path/${uuidv4()}.jpg`;


        this.setState({
            uploadState: 'uploading',
            uploadTask: this.state.storageRef.child(filePath).put(file,metadata)
        },
         () => {
             this.state.uploadTask.on('state_changed', snap => {
                 const percentUploaded = Math.round(snap.bytesTransferred / snap.totalBytes) * 100;
                 this.setState({percentUploaded});
                 this.props.isProgressBarVisible(percentUploaded);
                 this.setState({percentUploaded});

             },
              err=> {
                  console.error(err);
                  this.setState({
                      errors: this.State.errors.concat(err),
                      uploadState: 'error',
                      uploadTask: null
                  })
              },
              () => {
                  this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadUrl => {
                      this.sendFileMessage(downloadUrl, ref,pathToUpload);

                  })
                   .catch(err => {
                       console.error(err);
                       this.setState({
                           errors: this.State.errors.concat(err),
                           uploadState: 'error',
                           uploadTask: null
                        })
                    })
                }
            )
        }
        )

    };

    sendFileMessage = (fileUrl , ref, pathToUpload) => {
        ref.child(pathToUpload)
           .push()
           .set(this.createMessage(fileUrl))
           .then(() => {
               this.setState({ uploadState: 'done'})
           })
           .catch(err => {
               console.error(err);
               this.setState({
                   errors: this.state.errors.concat(err)
               })

           })
    }

    render(){
        const { errors, message , loading, modal, percentUploaded, uploadState} = this.state;
    
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
                        disabled = { uploadState === "uploading"}
                        onClick = {this.openModal}
                        content = "Upload media"
                        labelPosition = "right"
                        icon = "cloud upload"
                        />
                    </Button.Group>
                    <FileModal 
                        modal  = {modal}
                        closeModal = {this.closeModal}
                        uploadFile = {this.uploadFile}
                        />
                        <ProgressBar uploadState = {uploadState}
                            percentUploaded = {percentUploaded} />

            </Segment>
        );
    }
    
}

export default MessageForm;
