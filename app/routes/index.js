import {Dimensions} from 'react-native'
import { createStackNavigator } from 'react-navigation-stack';
import { Home } from '../screens';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import {DrawerMenu} from '../components';
const SCREEN_HEIGHT = Dimensions.get("window").height
const SCREEN_WIDTH = Dimensions.get("window").width


const DrawerNavigator = createDrawerNavigator({
    Home: { screen: Home.HomeScreen }
},
{
    contentComponent : DrawerMenu,
    drawerWidth:SCREEN_WIDTH
})

const Navigator = createAppContainer(DrawerNavigator)

export default Navigator;