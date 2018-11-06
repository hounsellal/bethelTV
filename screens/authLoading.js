import React from 'react';
import {
  ActivityIndicator,
  View,
  Text
} from 'react-native';
import checkLoggedIn from '../stores/bethelWebStore/checkLoggedIn';
import {inject} from 'mobx-react/native';

@inject('VideosStore')
export default class AuthLoadingScreen extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loggedIn: false
        }
    }
  
    componentWillMount(){
        this.checkLoggedIn();
    }

    checkLoggedIn = async () => {
        let check = await checkLoggedIn();
        this.setState({loggedIn: check.loggedIn});
        if(check.loggedIn){
            this.props.VideosStore.setVideos(check.videos);
            this.props.navigation.navigate('Main');
        } else {
            this.props.navigation.navigate("Login", {csrf: check.csrf});
        }
    }

  // Render any loading content that you like here
  render() {
      let loggedInText = this.state.loggedIn ? "Yes" : "No";
    return (
      <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#111'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}