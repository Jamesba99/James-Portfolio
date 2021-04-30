import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, ToastAndroid, SafeAreaView, TouchableOpacity } from 'react-native';
import {ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
All import variables for this screen
**/

/**
 this is the logout for the app - will be shown after if the user wants to logout
**/
class LogoutScreen extends Component {
  constructor(props){
      super(props);
  }
  /**
  componentDidMount allows everything in the function to be done in the background
  **/
  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
    });
  }
  /**
  unsubscribed to clear the memory to stop clogage
  **/
  componentWillUnmount(){
    this.unsubscribe()
  }
  /**
  Logout function will log the user out of the server and then take the user to the login screen 'loginscreen'
  A network request is posted to tell the server to log the user out by firstly getting the session token-
  -then removing it from Async storage
  If they match a 200 response is returned the user has succesfully logged out and sent to the login screen
  If another response is returned the error is caught and a toast is displayed why
  **/
  logoutUser = async () => {
    let token = await AsyncStorage.getItem('@session_token');
    await AsyncStorage.removeItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/user/logout",{
        method: 'post',
        headers: {
          "X-Authorization": token
        }
    })
    .then((response)=> {
      if(response.status === 200){
        ToastAndroid.show("Succesfully  gone!", ToastAndroid.SHORT);
        this.props.navigation.navigate("LoginScreen");
      }else if(response.status === 401){
          ToastAndroid.show("you werent logged in", ToastAndroid.SHORT);
      }else{
          throw 'Something went wrong';
      }
    })
    .catch((error)=> {
      console.log(error);
      ToastAndroid.show(error,ToastAndroid.SHORT);
    })
  }
  /**
  Render function which allows customisation on the screen
  once the screen content has loaded the user will have to click a TouchableOpacity logout button to initiate the logout function
  **/
  render(){
    const navigation = this.props.navigation;
      return(
        <SafeAreaView style={customStyle.container}>
        <ScrollView>
        <Text style={ customStyle.titleText }> Thank You for using</Text>
          <Text style={ customStyle.titleText }> CoffiDa Reviews  </Text>
          <Text style={customStyle.titleText}> ---------------------- </Text>
          <Text style={ customStyle.titleText }> Are You Sure You Want</Text>
          <Text style={ customStyle.titleText }>         To Logout? </Text>
            <TouchableOpacity
              style={customStyle.button1}
              onPress={() => this.logoutUser()}
              >
              <Text style={customStyle.buttonText}>Logout!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={customStyle.button1}
              onPress={() => navigation.goBack()}
              >
              <Text style={customStyle.buttonText}>No - Back!</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      );
  }


}
const customStyle = StyleSheet.create({ // styles the text on the screen
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#41393E'
  },
  titleText: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 40,
    fontWeight:"bold",
    flex:1,
    justifyContent: 'center',
  },
  text: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 50,
    fontWeight:"bold",
    justifyContent: 'center'
  },
  textInput:{
    padding:5,
    borderWidth:1,
    margin:5
  },
  button1:{
    height: 100,
    width: '100%',
    padding: 10,
    alignItems: 'center',
    borderWidth: 10,
    borderColor: '#8E4162',

  },
  buttonText:{
    color: '#C7E8F3',
    fontSize: 30,
    fontWeight:'bold',
    justifyContent: 'center'
  }
});


export default LogoutScreen;
