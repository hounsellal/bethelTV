/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Image, ImageBackground, ActivityIndicator, LayoutAnimation, Alert} from 'react-native';
import { observer, inject } from 'mobx-react/native';
import TopTabBar from '../components/topTabBar';
import getVideoUrl from '../stores/bethelWebStore/getVideoUrl';
import Video from 'react-native-video';
import moment from 'moment';

class VideoCard extends Component {

  state = {selected: false}

  focusItem = () => {
    LayoutAnimation.configureNext({
      duration: 50,
      create: {
        type: LayoutAnimation.Types.linear
      },
      update: {
        type: LayoutAnimation.Types.linear,
      },
    });
    this.setState({selected: true});
  }

  unFocusItem = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });
    this.setState({selected: false});
  }

  render() {
    let {card} = this.props;
    let {selected} = this.state;
    if(card.viewAll && !card.viewAllSubVideos){
      return(
        <TouchableOpacity
          onPress={()=>this.props.openViewAll(card.href, card.viewAllTitle)}
          onFocus={this.focusItem}
          onBlur={this.unFocusItem}
        >
          <View style={[styles.viewAllCard, selected ? styles.selectedViewAllCard : null]}>
            <Text style={{fontSize: 50, color: selected ? '#333' : 'white'}}>{card.name}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    else if(card.image){
      return(
        <TouchableOpacity 
          onPress={()=>this.props.openSubVideos(card.href, card.name)}
          onFocus={this.focusItem}
          onBlur={this.unFocusItem}
        >
          <ImageBackground source={{uri: card.image}} style={[styles.imageCard, selected ? styles.selectedImageCard : null]}>
            {
              card.name ?
              <View style={{backgroundColor: selected ? 'white' : '#222', padding: 20}}>
                <Text style={{fontSize: 30, color: selected ? 'black' : 'white'}}>{card.name}</Text>
                <Text style={{fontSize: 25, color: '#999'}}>{card.date}</Text>
              </View>
              : null
            }
          </ImageBackground>
        </TouchableOpacity>
      )
    } else {
      return (
        <TouchableOpacity
          onPress={()=>this.props.openSubVideos(card.href, card.viewAllTitle ? card.viewAllTitle : card.name)}
          onFocus={this.focusItem}
          onBlur={this.unFocusItem}
        >
          <View style={[styles.textCard, selected ? styles.selectedTextCard : null]}>
            <Text style={{fontSize: 50, color: selected ? 'black' : 'white'}}>{card.name}</Text>
            <Text style={{fontSize: 25, color: '#999'}}>{card.date}</Text>
          </View>
        </TouchableOpacity>
        
      )
    }
  }
}

@inject('VideosStore')
@observer
export default class Home extends Component {

  state = {videoUrl: null}

  openVideo = async(url) => {
      let vidUrl = await getVideoUrl(url);
      if(vidUrl) {
          //this.props.navigation.navigate('VideoPlayer', {url: vidUrl});
          this.setState({videoUrl: vidUrl}, ()=>{
              setTimeout(()=>{
                  this.video.presentFullscreenPlayer()
              }, 200)

          });

      } else {
          Alert.alert("Please upgrade your BethelTV account to access this content.");
      }
  }

  openSubVideos = async(href, title) => {
    if(href.startsWith("/watch")){
      this.openVideo(href);
    } else {
      this.props.VideosStore.populateCurrentList(href);
      this.props.VideosStore.setTitle(title);
      this.props.navigation.navigate('SubVideos');
    }
  }

  openViewAll = async(href, title) => {
    this.props.VideosStore.populateViewAllList(href);
    this.props.VideosStore.setViewAllTitle(title);
    this.props.navigation.navigate('ViewAllVideos');
  }

  videoError = (error) => {
      Alert.alert("Network Error", "BethelTV seems to be experiencing difficulties at the moment. Please try back again. Please check the website to see if you experience a similar difficulty. If no, please send an email to hi@prayermail.co and we will look into it.", [
          {text: 'OK', onPress: () => this.video.dismissFullscreenPlayer()},
        ])


  }

  render() {
    let videos = this.props.VideosStore.videos;
    return (
      <View style={styles.container}>
        {
          videos ?
          <ScrollView>
            <TopTabBar navigation={this.props.navigation} currentRoute="Watch" />
            <View style={{paddingHorizontal: 30, paddingBottom: 30}}>
              <Image source={require('../images/bethelLogoMuted.png')} style={{marginLeft: 30, width:300, height: 200, resizeMode: 'contain'}} />
                {
                    Object.keys(videos).map(vidKey => {
                      
                      let category = videos[vidKey].videos;
                      let viewAllLink = videos[vidKey].viewAll;
                      let viewAllSubVideos = videos[vidKey].viewAllSubVideos;
                      if(category){
                        return (
                          <View key={vidKey}>
                            <Text style={{fontSize: 75, margin: 20, marginLeft: 50, fontWeight: 'bold', color: '#bbb'}}>{vidKey}</Text>
                            <ScrollView horizontal={true}>
                              <FlatList
                                  data={[...category.items, {name: 'View All', href: viewAllLink, viewAllSubVideos, viewAllTitle: vidKey, viewAll: true}]}
                                  removeClippedSubviews={false}
                                  keyExtractor={(item, index) => index.toString()}
                                  contentContainerStyle={{flexDirection: 'row'}}
                                  renderItem={
                                      ({item}) => 
                                      <VideoCard card={item} openSubVideos={this.openSubVideos} openViewAll={this.openViewAll} />
                                  }
                              />
                            </ScrollView>
                          </View>
                        )
                      }
                      
                    })
                  }
            </View>
            
          </ScrollView>
          :
          <ActivityIndicator />
        }

        {
            this.state.videoUrl ?
            <Video
              ref={r => { this.video = r }}
              source={{uri: this.state.videoUrl}}
              //fullscreen={true}
              //onError={this.videoError}
              style={{
               width:0, height: 0
              }}
            />
            : null
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
    backgroundColor: '#111',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  imageCard: {width:300, height: 400, margin: 30, justifyContent: 'flex-end', borderRadius: 10, resizeMode: 'cover', overflow: 'hidden', backgroundColor: '#444'},
  textCard: {padding: 20, backgroundColor: '#222', width: 300, margin: 30, height: 400, borderRadius: 10},
  selectedImageCard: {width: 360, height: 460, margin: 0},
  selectedTextCard: {width:360, height: 460, margin: 0, backgroundColor: 'white'},
  viewAllCard: {width:300, height: 400, margin: 30, backgroundColor: '#333', borderRadius: 10, padding:20},
  selectedViewAllCard: {width: 360, height: 460, margin: 0, backgroundColor: 'white'}
});
