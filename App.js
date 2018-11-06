/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import AuthSwitch from './navigator/authSwitch';
import { Provider, observer } from 'mobx-react/native';

import VideosStore from './stores/videosStore';
import AccountStore from './stores/accountStore';

const stores = {VideosStore, AccountStore};

@observer
export default class App extends Component {
  render() {
    return (
      <Provider {...stores}>
        <AuthSwitch />
      </Provider>
    );
  }
}
