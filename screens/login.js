/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator} from 'react-native';
import { inject } from 'mobx-react/native';
import login from '../stores/bethelWebStore/login';


@inject('VideosStore')
export default class Login extends Component {

    state = {loginFocused: false, loggingIn: false}
    login = async () => {
        //let loginResponse = 
        this.setState({loggingIn: true});
        let csrf = null;
        if(this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.csrf) csrf = this.props.navigation.state.params.csrf;
        let res = await login({email: this.state.email, password: this.state.password, csrf});


        if(res.loggedIn) {
            this.setState({loggingIn: false}, ()=>{
                this.props.VideosStore.setVideos(res.videos);
                this.props.navigation.navigate('Main');
            })
            
        } else {
            Alert.alert("Incorrect email or password");
            this.setState({loggingIn: false});
        }
    }

  render() {
    return (
      <View style={styles.container}>

        <Image source={require('../images/bethelLogoMuted.png')} style={{width:300, height: 200, resizeMode: 'contain'}} />

        {
            this.state.loggingIn ?
            <ActivityIndicator size="large" />
            :
        

            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.title}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => this.setState({email: text})}
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    //keyboardType="email-address"
                />

                <Text style={styles.title}>Password</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    onChangeText={text => this.setState({password: text})}
                    textContentType="password"
                    onSubmitEditing={this.login}
                    returnKeyType="go"
                />

                <TouchableOpacity
                    onPress={this.login}
                    onFocus={()=>this.setState({loginFocused: true})}
                    onBlur={()=>this.setState({loginFocused: false})}
                >
                    <View style={[{marginTop: 20, width: 600, height: 100, backgroundColor: '#000', alignItems:'center', justifyContent: 'center'}, this.state.loginFocused ? styles.shadow : null]} >
                        <Text style={{color: 'white', fontSize: 40}}>Sign In</Text>
                    </View>

                </TouchableOpacity>
            </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  title: {
      fontSize: 50,
      color: '#bbb',
      fontWeight: 'bold'
  },
  input: {
      width: '50%', 
      borderColor: 'gray', 
      height: 80, 
      margin: 20,
      fontSize: 50
    },
    shadow: {
        shadowColor: '#666', 
        shadowOpacity: .75, shadowOffset: {width: 0,height: 10}, shadowRadius: 40
    }
});
