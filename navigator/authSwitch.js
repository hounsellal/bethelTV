import React from 'react';
import { createSwitchNavigator } from 'react-navigation';

import MainStack from './mainStack';
import Login from '../screens/login';
import AuthLoading from '../screens/authLoading';

export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  AuthLoading: AuthLoading,
  Login: Login,
  Main: MainStack,
});