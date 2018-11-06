import React from 'react';
import {
  ActivityIndicator,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Logout from '../stores/bethelWebStore/logout';
import TopTabBar from '../components/topTabBar';

@inject('AccountStore')
@observer
export default class Account extends React.Component {

  state = {
    logoutFocused: false
  }

  componentWillMount(){
    this.props.AccountStore.getAccount();
  }

  logout = async () => {
    await Logout();
    this.props.navigation.navigate('Login');
  }

  // Render any loading content that you like here
  render() {
    let {firstName, lastName, screenName, email} = this.props.AccountStore;
    return (
      <ScrollView style={{backgroundColor: '#111'}}>
        <TopTabBar navigation={this.props.navigation} currentRoute="Account" />
        <View style={{padding:30}}>
          <Text style={{fontSize: 100, fontWeight: 'bold', margin: 50, color: '#bbb'}}>Account</Text>
            {
              email ?
              <Text style={styles.aspectStyle}>Logged in as <Text style={styles.highlightedText}>{email}</Text></Text>
              : null
            }
            {
              firstName ? 
              <Text style={styles.aspectStyle}>Name: <Text style={styles.highlightedText}>{firstName} {lastName}</Text></Text>
              : null
            }
            {
              screenName ? 
              <Text style={styles.aspectStyle}>Screen Name: <Text style={styles.highlightedText}>{screenName}</Text></Text>
              : null
            }

            <TouchableOpacity
              onPress={this.logout}
              onFocus={()=>this.setState({logoutFocused: true})}
              onBlur={()=>this.setState({logoutFocused: false})}
            >
              <View style={[{padding:30, margin: 30, width: 300, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}, this.state.logoutFocused ? styles.shadow : null]}>
                <Text style={{color: 'white', fontSize: 40}}>Logout</Text>
              </View>
            </TouchableOpacity>      
        </View>
        
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  aspectStyle: {
    margin: 30,
    color: '#ccc',
    fontSize: 40
  },
  highlightedText: {
    color: 'white',
    fontWeight: 'bold'
  },
  shadow: {
    shadowColor: '#666', 
    shadowOpacity: .75, shadowOffset: {width: 0,height: 10}, shadowRadius: 40
  }
});