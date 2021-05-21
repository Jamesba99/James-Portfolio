import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, ToastAndroid, SafeAreaView, TouchableOpacity,Image } from 'react-native';
import {ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
/**
All import variables for this screen
**/

/**
the class acts a function to recieve props for the screen
 this is the loginscreen for the app - will be first screen a user sees
**/
class LoginScreen extends Component {
  /**
  builds the props contructor while also declaring the variables
  **/
    constructor(props){
        super(props);
        this.state={
            email: "",
            password: "",
            id: [],
            EmailError:"",
        }
    }
/**
Login function will log the user in to the server and then take the user to the next screen 'homescreen'
Once the user has entered the credentials in the server then checks whether those credentials match the servers
if they match a 200 response is returned
if another response is returned the error is caught and a toast is displayed why
Once a 200 has returned the ID and session token is uploaded to AsyncStorage and the user is sent to the next screen 'homescreen'
**/
    loginUser = async () => {
        return fetch("http://10.0.2.2:3333/api/1.0.0/user/login", {
            method: 'post',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(this.state)
          })
          .then((response) => {
              if(response.status === 200){
                  return response.json()
              }else if(response.status === 400){
                  throw ' invalid email or password';
              }else{
                  throw 'Something went wrong';
              }
          })
          .then(async (responseJson) => {
              console.log(responseJson);
              await AsyncStorage.setItem('@session_token', responseJson.token);
              await AsyncStorage.setItem('id', responseJson.id.toString());
              this.props.navigation.navigate("HomeScreen");
          })
          .catch((error) => {
              console.log(error);
              ToastAndroid.show(error,ToastAndroid.SHORT);
          })
    }
    /**
    creates a letter only validation when numbers pop up it throws an error
    also makes sure that the fields are not empty
    **/
    emailValidator(){
        if(this.state.email=="")
        {
          this.setState({EmailError:"email cannot be empty"})
        }
        else
        {
            this.setState({EmailError:""})
        }
    }
    /**
    Render function which allows customisation on the screen
    This render has two input boxes where the user enters a username and a password and then when entered it is set to state
    Once the credentials are entered the login button is pressed which calls the login funtion
    **/
    render(){
        const navigation = this.props.navigation;
        return(
            <SafeAreaView style={customStyle.container}>
              <ScrollView>
                  <Text style={ customStyle.text }>      Welcome to</Text>
                  <Text style={ customStyle.text }>CoffiDa Reviews!</Text>
                  <Text style={customStyle.text}>    Login to begin </Text>
                    <Text style={customStyle.text}> ----------------- </Text>
                  <Image
                      style={customStyle.stretch}
                      source={require('./images/coffeeReview.jpg')}
                  />
                  <Text style={customStyle.subText}>Enter a Email:</Text>
                  <TextInput
                      placeholder="Enter your email"
                      onChangeText={(email) => this.setState({email})}
                      backgroundColor= '#C7E8F3'
                      value={this.state.email}
                      onBlur={()=>this.emailValidator()}
                      style={customStyle.textInput}
                  />
                  <Text style={customStyle.errorMessage}> {this.state.EmailError}</Text>
                  <Text style={customStyle.subText}>Enter a Password:</Text>
                  <TextInput
                      placeholder="Enter your password"
                      onChangeText={(password) => this.setState({password})}
                      backgroundColor= '#C7E8F3'
                      value={this.state.password}
                      secureTextEntry
                      style={customStyle.textInput}
                  />
                  <Text>     </Text>
                  <TouchableOpacity
                      style={customStyle.button1}
                        onPress={() => this.loginUser()}>
                      <Text style={customStyle.buttonText}>Login!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={customStyle.button1}
                      onPress={() =>navigation.navigate('Register')}>
                      <Text style={customStyle.buttonText}>Don't have an account? register now!</Text>
                  </TouchableOpacity>
                </ScrollView>
              </SafeAreaView>
        );
    }
}
/**
style sheet to allow customisation of the different buttons,views,flatlists and TouchableOpacity
**/
const customStyle = StyleSheet.create({ // styles the text on the screen
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#41393E'
  },
  text: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 40,
    fontWeight:"bold",
    justifyContent: 'center'
  },
  textInput:{
    padding:5,
    borderWidth:1,
    margin:5
  },
  button1:{
      height: 10,
      width: '100%',
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 10,
      borderColor: '#8E4162',
      margin:2,
      fontSize: 20
  },
  subText: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:"bold",
    justifyContent: 'center'
  },
  buttonText:{
    color: '#C7E8F3',
    fontSize: 15,
    fontWeight:'bold',
    //justifyContent: 'center'
  },
  errorMessage:{
  color: 'white',
  marginLeft: 20
  },
  stretch: {
    width: '100%',
    height: 150,
    resizeMode: 'stretch'
  }
});
export default LoginScreen;
