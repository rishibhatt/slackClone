import React from 'react';
import { Header, Icon, Input, Segment } from 'semantic-ui-react';

class MessageHeader extends React.Component {
    render(){

        const { channelName , numUniqueUsers, handleSearchChange,searchLoading, isPrivateChannel} = this.props;
        return (
            
            <Segment clearing>
                {/* channel title */}
                <Header fluid = "true" as = "h2" floated = "left" style = {{marginBottom :0 }}>
                   
                   <span>
                        {channelName}
                       { !isPrivateChannel && < Icon name = {"star outline"} color = "black" />}

                   </span>
                   <Header.Subheader>{numUniqueUsers}</Header.Subheader>
                </Header>
                   {/*channel search input*/}                
                <Header floated = "right">
                    <Input 
                        onChange = {handleSearchChange}
                        loading = {searchLoading}
                        size = "mini"
                        icon = "search"
                        name = "searchTerm"
                        placeholder = "Search Message "
                        />
                </Header>
            </Segment>
        );

    }
   
}

export default MessageHeader;
