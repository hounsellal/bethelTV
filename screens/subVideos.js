import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, ScrollView, Image, ImageBackground, Alert, LayoutAnimation, ActivityIndicator} from 'react-native';
import { observer, inject } from 'mobx-react/native';
import getVideoUrl from '../stores/bethelWebStore/getVideoUrl';
import Video from 'react-native-video';
import moment from 'moment';
import TopTabBar from '../components/topTabBar';

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

    getThumbnail = (item) => {
        let tn = null;
        if(item.thumbnail) tn = item.thumbnail.url;
        else if(item.authors && item.authors.edges && item.authors.edges.length) tn = item.authors.edges[0].node.thumbnail.url;
        else if(item.defaultThumbnail) tn = item.defaultThumbnail.url;
        else return tn;

        if(tn && tn.startsWith("//")) tn = tn.replace("//", "https://");
        return tn;
    }

    render(){
        let {item, focus} = this.props;
        let date = (item.node && item.node.publicDatetime) ? moment(item.node.publicDatetime * 1000).format("MMMM D, YYYY") : null;
        let selected = this.state.selected;
        if(item.loadMore){
            return (
                <TouchableOpacity onPress={this.props.loadMore}
                    onFocus={this.focusItem}
                    onBlur={this.unFocusItem}
                >
                    <View style={[{width: 300, height: 400, backgroundColor: this.props.adding ? '#111' : selected ? 'white' : '#222', padding: 30, margin: 30, borderRadius: 10, justifyContent: 'center', alignItems: 'center'}, this.state.selected ? styles.selectedImageCard : null]}>
                        {
                            this.props.adding ? <ActivityIndicator size="large" /> :
                            <Text style={{color: selected ? '#333' : '#666', fontWeight: 'bold', fontSize: 50}}>Load More</Text>
                        }
                    </View>
                </TouchableOpacity>
            )
        } else {
            return (
                <TouchableOpacity 
                    onPress={()=>this.props.openVideo(item.node.url)} hasTVPreferredFocus={focus}
                    onFocus={this.focusItem}
                    onBlur={this.unFocusItem}
                > 
                    <ImageBackground source={{uri: this.getThumbnail(item.node)}} style={[styles.imageCard, this.state.selected ? styles.selectedImageCard : null]}>
                        <View style={{backgroundColor: selected ? 'white':'#222', padding: 20}}>
                          <Text style={{fontSize: 30, color: selected ? 'black' : 'white'}}>{item.node.name}</Text>
                          <Text style={{fontSize: 25, color: '#999'}}>{date}</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            )
        }
        
    }
}

const styles = StyleSheet.create({
  imageCard: {width: 300, height: 400, margin: 30, justifyContent: 'flex-end', borderRadius: 10, resizeMode: 'cover', overflow: 'hidden'},
  selectedImageCard: {width: 360, height: 460, margin: 0}
});

@inject('VideosStore')
@observer
export default class SubVideos extends Component {

    constructor(props){
        super(props);
        this.state = {
            videoUrl: null,
            currentFocus: 0,
            searchButtonSelected: false
        }
    }

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

    loadMore = async() => {
        this.setState({currentFocus: this.props.VideosStore.currentList.length});
        this.props.VideosStore.addToList();
    }

    onSearch = async() => {
        this.props.VideosStore.search(this.state.searchTerm);
    }

    videoError = (error) => {
        Alert.alert("Network Error", "BethelTV seems to be experiencing difficulties at the moment. Please try back again. Please check the website to see if you experience a similar difficulty. If no, please send an email to hi@prayermail.co and we will look into it.", [
            {text: 'OK', onPress: () => this.video.dismissFullscreenPlayer()},
          ])
        
        
    }

    render(){
        let videos = this.props.VideosStore.currentList;
        let title = this.props.VideosStore.title;
        let loadMore = this.props.VideosStore.hasNextPage;
        let data = loadMore ? [...videos.slice(), {loadMore: true}] : videos.slice();
        let adding = this.props.VideosStore.addingToCurrentList;
        let loading = this.props.VideosStore.loadingCurrentList;
        let showSearch = this.props.navigation.state && this.props.navigation.state.params && this.props.navigation.state.params.showSearch;
        return (
            <View style={{flex: 1, width: '100%', backgroundColor: '#111'}}>
                
                <ScrollView contentContainerStyle={{paddingBottom: 30}}>
                    {
                        showSearch &&
                        <View>
                            <TopTabBar navigation={this.props.navigation} currentRoute="Search" />
                            <View style={{width: '100%', flexDirection: 'row'}}>
                                <View style={{padding: 30, flex: 4}}>
                                    <TextInput
                                        style={{height: 100, fontSize: 50, color: '#ddd'}}
                                        onChangeText={text => this.setState({searchTerm: text})}
                                        onSubmitEditing={this.onSearch}
                                        returnKeyType='search'
                                    />
                                </View>
                                <View style={{flex: 1, padding: 30}}>
                                    <TouchableOpacity
                                        onPress={this.onSearch}
                                        onFocus={()=>this.setState({searchButtonSelected: true})}
                                        onBlur={()=>this.setState({searchButtonSelected: false})}
                                    >
                                        <View style={{height: 100, backgroundColor: this.state.searchButtonSelected ? '#444' : 'black', borderRadius: 20, alignItems: 'center', justifyContent: 'center'}}>
                                            <Text style={{color: 'white', fontSize: 50}}>
                                                Search
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    }
                    <View style={{paddingHorizontal: 30}}>
                        <Text style={{fontSize: 100, fontWeight: 'bold', margin: 50, color: '#bbb'}}>{title}</Text>
                        {
                            loading ? <ActivityIndicator style={{marginTop: 150}} size="large" /> :
                            <FlatList
                                data={data}
                                removeClippedSubviews={false}
                                contentContainerStyle={{flexDirection: 'column', justifyContent: 'center'}}
                                numColumns={5}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={
                                    ({item, index}) => {
                                        return (
                                            <VideoCard adding={adding} loadMore={this.loadMore} item={item} focus={index === this.state.currentFocus} openVideo={this.openVideo} />
                                        )
                                    }
                                }
                            />
                        }
                    </View>
                    
                    
                </ScrollView>
                {
                    this.state.videoUrl ?
                    <Video
                      ref={r => { this.video = r }}
                      source={{uri: this.state.videoUrl}}
                      //fullscreen={true}
                      style={{
                       width:0, height: 0
                      }}
                      //onError={this.videoError}
                    />
                    : null
                }
                

                
            </View>
        )
    }
}