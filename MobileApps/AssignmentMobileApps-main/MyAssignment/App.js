import 'react-native-gesture-handler';

import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
//all screen imports - allows navigation between screens
import HomeScreen from './Components/DefaultHomeScreen';
import Register from './Components/Register';
import Login from './Components/Login';
import LogoutScreen from './Components/Logout';
import LeaveReviews from './Components/LeaveReviews';
import SeeLocalCoffee from './Components/SeeLocalCoffee';
import ViewReviews from './Components/ViewReviews';
import UserInfo from './Components/UserInfo';
import FlatListOutput from './Components/FlatListOutput';
import EditUSerDetails from './Components/EditUSerDetails';
import EditReviews from './Components/EditReviews';
import FavouriteAlocation from './Components/FavouriteAlocation'
import CameraScreen from "./Components/CameraScreen"
import ViewPhotos from "./Components/ViewPhotos"
/**
Drawer navigation is used because it allows fast changing of screens
while also allowing stack screen caperbilities bringing the best of both navigation to the app
'options={' allows a different name to appear on the drawer rather than the name of the class
export app will then export whats on this page onto the emulator
**/
const Drawer = createDrawerNavigator();

class App extends Component{
  render(){
    return(
      <NavigationContainer>
        <Drawer.Navigator>

            <Drawer.Screen name="LoginScreen"component={Login}options={{title:"Login ",}}/>
            <Drawer.Screen name="HomeScreen" component={HomeScreen}options={{title:"Home Screen!"}} />
            <Drawer.Screen name="Register" component={Register} options={{title:"Register For An Account!"}} />
            <Drawer.Screen name="LeaveReviews" component={LeaveReviews}options={{title:"Leave A Review"}}/>
            <Drawer.Screen name="ViewReviews" component={ViewReviews}options={{title:"View A Review"}}/>
            <Drawer.Screen name="SeeLocalCoffee" component={SeeLocalCoffee}options={{title:"See Local Coffee Near You"}}/>
            <Drawer.Screen name="UserInfo" component={UserInfo}options={{title:"My Account"}}/>
            <Drawer.Screen name="LogoutScreen" component={LogoutScreen}options={{title:"Logout!"}}/>
            <Drawer.Screen name="FlatListOutput" component={FlatListOutput}options={{title:"   "}}/>
            <Drawer.Screen name="EditUSerDetails" component={EditUSerDetails}options={{title:"   "}}/>
            <Drawer.Screen name="EditReviews" component={EditReviews}options={{title:"   "}}/>
            <Drawer.Screen name="FavouriteAlocation"  component={FavouriteAlocation}options={{title:"   "}}
            />
            <Drawer.Screen name="CameraScreen" component={CameraScreen}options={{title:"   "}}/>
            <Drawer.Screen name="ViewPhotos" component={ViewPhotos} options={{title:"   "}}/>
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }
}

export default App; // exports the apps
