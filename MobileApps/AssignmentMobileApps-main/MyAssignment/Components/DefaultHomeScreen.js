import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ToastAndroid, Image,SafeAreaView,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SeeLocalCoffee from './SeeLocalCoffee';
/**
All import variables for this screen
**/
/**
 this is the homescreen for the app - will be shown after logging in
**/
class HomeScreen extends Component{
/**
builds the props contructor while also declaring the variables
**/
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      listData: []
    }
  }
/**
componentDidMount allows everything in the function to be done in the background
this.checkedloggedIn will call the function check logged in as the user opens the app to make-
- sure they don't get access to this screen while not logged in
**/
  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getData();
  }
/**
unsubscribed to clear the memory to stop clogage
**/
  componentWillUnmount (){
    this.unsubscribe();
  }
/**
 GetData will find all the location information of all the coffee shops
 Also the X-Authorization token is taken from async storage to prove to the server that the user is logged in
 Once the data has been pulled from /find the response is transfered into JSON format as long as a 200 response is returned
 if another response is returned a else if to the correct response will return with a toast explaining why
 finally responseJson is then set to the required format and and applied to a variable in state
**/
  getData = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/find",{
        'headers' : {
          'X-Authorization': value
        }
    })
      .then((response) => {
          if(response.status === 200){
              return response.json()
          }else if(response.status === 401){

          }else{
              throw 'Something went wrong';
          }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          listData: responseJson
        })

      })
      .catch((error) => {
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
  starts off with conditional rendering to help if a slow network request to stop the user thinking the app has froze
  once the screen content has loaded the use of TouchableOpacity allows the user to navigate to other pages
  **/
  render(){
    const navigation = this.props.navigation; // declaring the navigation constant
    if(this.state.isLoading){
      return(
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#41393E'
          }}>
          <Text style={{fontSize: 50, fontWeight: 'bold', color: '#C7E8F3'}}> Loading.... </Text>
      </View>
      );
    }else{
      return(
          <SafeAreaView style={customStyle.container}>
            <ScrollView>
              <Text style={customStyle.titleText}>CoffiDa Reviews</Text>
              <Text style={customStyle.titleText}> ----------------- </Text>
              <Image
                style={customStyle.stretch}
                source={require('./images/coffee.jpg')}
              />
              <TouchableOpacity
                  style={customStyle.button1}
                    onPress={() =>navigation.navigate('LeaveReviews')}>
                  <Text style={customStyle.buttonText}>Leave Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={customStyle.button1}
                  onPress={() =>navigation.navigate('ViewReviews')}>
                  <Text style={customStyle.buttonText}>View Reviews</Text>
              </TouchableOpacity>
                <TouchableOpacity
                  style={customStyle.button1}
                  onPress={() =>navigation.navigate('SeeLocalCoffee')}
                  >
                  <Text style={customStyle.buttonText}>See Local coffee</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={customStyle.button1}
                  onPress={() =>navigation.navigate('UserInfo')}>
                  <Text style={customStyle.buttonText}>My Account</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={customStyle.button1}
                  onPress={() =>navigation.navigate('LogoutScreen')}>
                  <Text style={customStyle.buttonText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
      );
    }
  }
}
/**
style sheet to allow customisation of the different buttons,views,flatlists and TouchableOpacity
**/
const customStyle = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#41393E',
  },
  titleText: {
    color: '#C7E8F3',
    fontSize: 50,
    fontWeight:"bold"
  },
  buttonText:{
    color: '#C7E8F3',
    fontSize: 25,
    fontWeight:'bold',
    //justifyContent: 'center'
  },
  button1:{
    height: 10,
    width: '100%',
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: '#8E4162',
    margin:2
  },
  stretch: {
    width: '100%',
    height: 250,
    resizeMode: 'stretch'
  }
});

export default HomeScreen;
