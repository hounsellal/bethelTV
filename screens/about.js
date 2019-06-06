import React from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import TopTabBar from '../components/topTabBar';

export default class Account extends React.Component {

  // Render any loading content that you like here
  render() {
    return (
      <ScrollView style={{backgroundColor: '#111'}}>
        <TopTabBar navigation={this.props.navigation} currentRoute="About" />
        <View style={{padding:60, flexDirection: 'column'}}>
            <Text style={{fontSize: 100, fontWeight: 'bold', margin: 50, color: '#bbb'}}>About</Text>
            <Text style={styles.textStyle}>Version: 1.0.3</Text>
            <Text style={styles.textStyle}>Build: 16</Text>
            <Text style={styles.textStyle}>App Copyright: Toronto, Canada. Built by Al Hounsell and the PrayerMail Team (www.prayermail.co). Search for "PrayerMail" on the App Store.</Text>
            <Text style={{fontSize: 50, color: '#ccc', margin: 30}}>Disclaimer</Text>
            <Text style={styles.textStyle}>This app is in no way associated with Bethel Media. All Bethel stuff is copyrighted and belongs to them. You need a BethelTV account in order to use this app. The app simply retrieves in the background the web pages, images and videos you already have access to under your BethelTV account, and reformats the content to look nice on AppleTV.</Text>
        </View>
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 40,
    color: '#bbb'
  }
});