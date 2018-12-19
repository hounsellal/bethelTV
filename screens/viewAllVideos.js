import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, Image, ImageBackground, Alert, LayoutAnimation} from 'react-native';
import { observer, inject } from 'mobx-react/native';
import getVideoUrl from '../stores/bethelWebStore/getVideoUrl';
import Video from 'react-native-video';

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

    render(){
        let {item, index} = this.props;
        let selected = this.state.selected;
        return (
            <TouchableOpacity 
                onPress={()=>this.props.openSubVideos(item.href, item.name)} hasTVPreferredFocus={index === 0}
                onFocus={this.focusItem}
                onBlur={this.unFocusItem}
            > 
                <ImageBackground source={{uri: item.image}} style={[styles.imageCard, selected ? styles.selectedImageCard : null]}>
                    <View style={{backgroundColor: selected ? 'white' : '#222', padding: 20}}>
                      <Text style={{fontSize: 40, color: selected ? 'black' : 'white'}}>{item.name}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
  imageCard: {width: 300, height: 400, margin: 30, justifyContent: 'flex-end', borderRadius: 10, resizeMode: 'cover', overflow: 'hidden', backgroundColor:'#444'},
  selectedImageCard: {width: 360, height: 460, margin: 0}
});

@inject('VideosStore')
@observer
export default class ViewAllVideos extends Component {

    openSubVideos = async(href, title) => {
      this.props.VideosStore.populateCurrentList(href);
      this.props.VideosStore.setTitle(title);
      this.props.navigation.navigate('SubVideos');
    }

    render(){
        let videos = this.props.VideosStore.viewAllList;
        let title = this.props.VideosStore.viewAllTitle;
        return (
            <View style={{flex: 1, width: '100%', paddingHorizontal: 30, backgroundColor: '#111'}}>
                <ScrollView contentContainerStyle={{paddingBottom: 30}}>
                    <Text style={{fontSize: 100, fontWeight: 'bold', margin: 50, color: '#bbb'}}>{title}</Text>
                    <FlatList
                        data={videos.slice()}
                        removeClippedSubviews={false}
                        contentContainerStyle={{flexDirection: 'column', justifyContent: 'center'}}
                        numColumns={5}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={
                            ({item, index}) => {
                                return (
                                    <VideoCard item={item} index={index} openSubVideos={this.openSubVideos} />
                                )
                            }
                        }
                    />
                </ScrollView>         
            </View>
        )
    }
}