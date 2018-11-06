import React, {Component} from 'react';
import {
  ActivityIndicator,
  View,
  Text, 
  TouchableOpacity,
  LayoutAnimation
} from 'react-native';
import { observer, inject } from 'mobx-react/native';

@inject('VideosStore')
class TopTabLink extends Component {
    state = {selected: false}

    onSelect = () => {
        
        this.props.selectTab(this.props.name);
        this.setState({selected: true});
    }

    onDeSelect = () => {
        
        this.props.deSelectTab(this.props.name);
        this.setState({selected: false});
    }

    onPress = () => {
        if(this.props.resetVideos) this.props.VideosStore.resetCurrentList();
        this.props.navigation.navigate(this.props.location, this.props.params)
    }

    render(){
        let selected = this.state.selected;
        return (
            <TouchableOpacity onPress={this.onPress}
                onFocus={this.onSelect}
                onBlur={this.onDeSelect}
                style={{flex: 1}}
                //hasTVPreferredFocus={this.props.name === this.props.currentRoute}

            >
              <View style={{flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: selected ? 50 : 40, color: selected ? 'white' : '#ccc', fontWeight: selected ? 'bold' : null}}>
                  {this.props.name}
                </Text>
              </View>
            </TouchableOpacity>
        )
    }
}

export default class TopTabBar extends Component {
    state = {
        barSelected: false,
        tabSelected: {}
    }

    selectTab = (which) => {
        let currentTabs = this.state.tabSelected;
        currentTabs[which] = true;
        LayoutAnimation.configureNext({
            duration: 150,
            create: {
              type: LayoutAnimation.Types.linear
            },
            update: {
              type: LayoutAnimation.Types.linear,
            },
          });
        this.setState({barSelected: true, tabSelected: currentTabs});
    }

    deSelectTab = (which) => {
        let currentTabs = this.state.tabSelected;
        delete currentTabs[which];

            currentTabs = this.state.tabSelected;
            if(!Object.keys(currentTabs).length){
                LayoutAnimation.configureNext({
                  duration: 300,
                  create: {
                    type: LayoutAnimation.Types.easeInEaseOut
                  },
                  update: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                  },
                });
                this.setState({barSelected: false});
            }
    }

    render(){
        let selected = this.state.barSelected;
        return (
            <View style={{flexDirection: 'row', height: selected ? 200 : 100, flex: 1, backgroundColor: 'black'}}>
              <TopTabLink selectTab={this.selectTab} deSelectTab={this.deSelectTab} navigation={this.props.navigation} name="Watch" location="Home" currentRoute={this.props.currentRoute} />
              <TopTabLink selectTab={this.selectTab} deSelectTab={this.deSelectTab} currentRoute={this.props.currentRoute} resetVideos={true} navigation={this.props.navigation} name="Search" location="SubVideos" params={{showSearch: true}} />
              <TopTabLink selectTab={this.selectTab} deSelectTab={this.deSelectTab} currentRoute={this.props.currentRoute} navigation={this.props.navigation} name="Account" location="Account" />
              <TopTabLink selectTab={this.selectTab} deSelectTab={this.deSelectTab} currentRoute={this.props.currentRoute} navigation={this.props.navigation} name="About" location="About" />
            </View>
        )
    }
}