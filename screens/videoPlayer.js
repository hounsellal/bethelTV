import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native';
import Video from 'react-native-video';

export default class VideoPlayer extends Component {

    componentDidMount = () => {
      setTimeout(()=>{
        this.video.presentFullscreenPlayer()
      }, 1000)
    }

  render() {
    let url = this.props.navigation.state.params.url;
    return (
        <View style={{flex: 1, width: '100%', backgroundColor: 'black'}}>
            <ActivityIndicator />
            <Video
                ref={r => { this.video = r }}
              source={{uri: url}}
              //fullscreen={true}
              style={{
               width:0, height: 0
              }}
            />
        </View>
      
    );
  }
}