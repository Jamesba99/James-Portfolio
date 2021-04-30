import React, { Component } from 'react';
import { Text, View, Button, Alert, PermissionsAndroid,  StyleSheet, TextInput, ToastAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
/**
All import variables for this screen
**/
/**
 This async function gets the users location from the users phone with a prompt popping up
 Then gives the option to either ask them later, ok or cancel
 Once it is granted a pop up will show the user that the location is has been accepted
**/
async function requestLocationPermission(){
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      { title: 'Local Permission',
      message:
        'this app requires your location',
      buttonNeutral: 'Ask me later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    ToastAndroid.show("location persmission Granted",ToastAndroid.SHORT);
      console.log('Location Persmission Granted');
      return true;
    } else {
      console.log('Location permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
}
/**
 this is the favourite location screen for the app - will allow the user to favourite and unfavourite a location
**/
class SeeLocalCoffee extends Component{
  /**
  componentDidMount allows everything in the function to be done in the background
  this.checkedloggedIn will call the function check logged in as the user opens the app to make-
  - sure they don't get access to this screen while not logged in
  Also initiates the location functions
  **/

  componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
      this.findCoordinates();
      this.getLocationData();
    });
  }

  componentWillUnmount (){
      this.unsubscribe();
  }
  constructor(props){
    super(props);
    this.state = {
      location: null,
      locationPermission: false,
      isLoading: true,
      destination: "",
      listData:[],
      lat: "",
      lon: "",
      myLocation:{
        latitude: 0,
        longitude: 0,
      }
    }
  }
/**
if the user has not given permission then the screen will ask the user by calling requestLocationPermission
If the permission has been granted then the getCurrentPosition is called
which makes variables for location, lat, and lng
it then sets teh state of the latitude and longitude
while enabling high accuracy
**/
  findCoordinates= () => {
      console.log("state", this.state);
      if(!this.state.locationPermission){
        console.log("asking for permission");
        this.state.locationPermission = requestLocationPermission();
    }

    Geolocation.getCurrentPosition((position) => {
        const location = JSON.stringify(position);
        const lat = JSON.stringify(position.coords.latitude);
        const lng = JSON.stringify(position.coords.longitude);
        this.setState({myLocation:{
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        }});
        console.log(lat);
        console.log(lng);
        console.log(location);
      },(error) => {
        Alert.alert(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maxiumAge: 1000
      });
  }


  /**
   getLocationData will find all the location information of all the coffee shops
   Also the X-Authorization token is taken from async storage to prove to the server that the user is logged in
   Once the data has been pulled from /find the response is transfered into JSON format as long as a 200 response is obrained
   if another response is returned a else if to the correct response will return
   finally responseJson is then set to the correct format needed for this screen
  **/
    getLocationData = async () => {
      let token = await AsyncStorage.getItem('@session_token');
      let id = await AsyncStorage.getItem('id');
      return fetch("http://10.0.2.2:3333/api/1.0.0/find", {
          method: 'get',
          headers: {
            "X-Authorization": token
          },
      })
      .then((response)=> {
        if(response.status === 200){
          return response.json()
          console.log(response)
          }else if(response.status === 400){
            throw 'Bad Request';
          }else if(response.status === 401){
              throw '401 Unauthorized';
              console.log(response);
          }else if (response.status === 404){
              throw 'Not found';
          }else if (response.status === 500){
              throw 'server error';
          }
      })
      .then((responseJson) =>{
        console.log(responseJson);
        this.setState({
          isLoading: false,
          listData: responseJson

        });
      })
      .catch((error)=> {
        console.log(error);
        ToastAndroid.show(error,ToastAndroid.SHORT);
      })
    }
    /***
    checks if the user is logged in if not will not allow the user to use drawer navigation to get to this page
    ***/
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('LoginScreen');
          ToastAndroid.show("You are not logged in!",ToastAndroid.SHORT);
    }
  };
  /**
Render function which allows customisation on the screen
Using the google maps Key a map will be generated with a zoom of 0.005
from pulling the lat and long from /find a marker will be set to every coffee shop location
because the response is returned as a string parse float allows for accurate lat and long values givign a precise location
Also the users location is also shown
  **/
  render(){
    const navigation = this.props.navigation;
      return(
        <View style={customStyles.map}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={customStyles.map}
            region={{
              latitude: this.state.myLocation.latitude,
              longitude: this.state.myLocation.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005
            }}
          >
          {this.state.listData.map((marker, index) => (
          <Marker
            key={marker.location_id}
            coordinate={{"latitude" : parseFloat(marker.latitude), "longitude" : parseFloat(marker.longitude)}}
            title={marker.location_name}
            description={"Delicious coffee here!"}
          />
          ))}
          <Marker
            coordinate={this.state.myLocation}
            title="Your Location "
            description="Where you currently are"
            />
          </MapView>
            <Button
             color='#8E4162'
              title="Back"
              onPress={() =>navigation.goBack()}
            />
        </View>
      );
  }
}
/**
style sheet to allow customisation of the different buttons,views,flatlists and TouchableOpacity
**/
const customStyles = StyleSheet.create({

   container: {
     height: 400,
     width: 400,
     justifyContent: 'flex-end',
     alignItems: 'center',
   },
   map: {
     flex: 2,
     height: 400,
     width: '100%',
   },
  });
export default SeeLocalCoffee;
