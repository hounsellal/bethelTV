import {createStackNavigator} from 'react-navigation';

import Home from '../screens/home';
import VideoPlayer from '../screens/videoPlayer';
import SubVideos from '../screens/subVideos';
import Account from '../screens/account';
import About from '../screens/about';
import ViewAllVideos from '../screens/viewAllVideos';

const MainStack = createStackNavigator({
    Home: { screen: Home },
    ViewAllVideos: {screen: ViewAllVideos},
    SubVideos: {screen: SubVideos},
    VideoPlayer: { screen: VideoPlayer},
    Account: {screen: Account},
    About: {screen: About}
}, {navigationOptions: {
    header: null
}});

export default MainStack;