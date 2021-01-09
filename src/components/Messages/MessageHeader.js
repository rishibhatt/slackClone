import React from 'react';
import { Header, Icon, Input, Segment } from 'semantic-ui-react';

class MessageHeader extends React.Component {
    render(){
        return (
            
            <Segment clearing>
                {/* channel title */}
                <Header fluid = "true" as = "h2" floated = "left" style = {{marginBottom :0 }}>
                   
                   <span>
                        Channel
                        <Icon name = {"star outline"} color = "black" />

                   </span>
                   <Header.Subheader>2 Users</Header.Subheader>
                </Header>
                   {/*channel search input*/}                
                <Header floated = "right">
                    <Input 
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
