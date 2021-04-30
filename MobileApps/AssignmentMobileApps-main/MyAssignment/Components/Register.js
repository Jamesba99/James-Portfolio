import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, ToastAndroid, SafeAreaView, TouchableOpacity } from 'react-native';
import {ScrollView, TextInput } from 'react-native-gesture-handler';
/**
Makes a class called register to register an account
makes a constructor that will create props for each field that needs to be entered
**/
class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
          first_name: "",
          first_nameError: "",
          last_name: "",
          last_nameError: "",
          email:"",
          EmailError:"",
          password: "",

        }
    }
/**
userSignup function is made with an arrow function pointing towards the server
initiating the post method
Then if the server responds with 200 meaning the post review has succsessfully been liked sending the user back to userInfopage-
-while being toasted that the like has been added
With other responses (400,401,403,404,500) being caught and printed and toasted to the user to keep them infomormed with whats going on

**/
    userSignup = () => {
      return fetch("http://10.0.2.2:3333/api/1.0.0/user",{
          method: 'post',
          headers:{
                'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state)
      })
      .then((response) => {
          if(response.status === 201){
            return response.json()
          }else if(response.status === 400){
              throw 'Email already on the system ';
          }else{
            throw 'Something went wrong';
          }
      })
      .then((responseJson) => {
          console.log("User created with ID: ", responseJson);
          ToastAndroid.show("Account has been created",ToastAndroid.SHORT);
          this.props.navigation.navigate("LoginScreen")
      })
      .catch((error)=> {
          console.log(error);
          ToastAndroid.show(error,ToastAndroid.SHORT);
      })
    }
    /**
creates the input boxes and the input area of them
While navigation buttons are added to help with navigation of the app
**/
/**
creates a letter only when numbers pop up it throws an error
also makes sure that the fields are not empty
**/
    checkFirstName(){
      let rjx=/^[a-zA-z]+$/;
      let isValid=rjx.test(this.state.first_name)
      if(!isValid)
      {
        this.setState({first_nameError:"name cannot be number"})
      }
      else
      {
          this.setState({first_nameError:""})
      }
    }
    checkLastName(){
      let rjx=/^[a-zA-z]+$/;
      let isValid=rjx.test(this.state.last_name)
      if(!isValid)
      {
        this.setState({last_nameError:"name cannot be number"})
      }
      else
      {
          this.setState({last_nameError:""})
      }
    }
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
    This render has four input boxes where the user enters a email, first name , second name and a password then setting it to state
    Once the credentials are entered the login button is pressed which calls the login funtion
    Also has a validater checking if the user has entered the correct format of just letters or just numbers
    **/
    render(){
          const navigation = this.props.navigation;
          return (
            <SafeAreaView style={customStyles.container}>
              <ScrollView>
                  <Text style={customStyles.text}>  Register Now!</Text>
                  <Text style={customStyles.text}>------------------</Text>
                  <Text style={customStyles.subText}>Enter a First Name:</Text>
                  <TextInput
                      placeholder="Enter your first name"
                      onChangeText={(first_name) => this.setState ({first_name})}
                      backgroundColor="#C7E8F3"
                      onBlur={()=>this.checkFirstName()}
                      value={this.state.first_name}
                      style={customStyles.textInput}
                  />
                  <Text style={customStyles.errorMessage}> {this.state.first_nameError}</Text>
                  <Text style={customStyles.subText}>Enter a Last Name:</Text>
                  <TextInput
                      placeholder="Enter your second name"
                      onChangeText={(last_name) => this.setState ({last_name})}
                      backgroundColor="#C7E8F3"
                      onBlur={()=>this.checkLastName()}
                      value={this.state.last_name}
                      style={customStyles.textInput}
                  />
                  <Text style={customStyles.errorMessage}> {this.state.last_nameError}</Text>
                  <Text style={customStyles.subText}>Enter a Email:</Text>
                  <TextInput
                      placeholder="Enter your email"
                      onChangeText={(email) => this.setState ({email})}
                      onBlur={()=>this.emailValidator()}
                      backgroundColor="#C7E8F3"
                      value={this.state.email}
                      style={customStyles.textInput}
                  />
                  <Text style={customStyles.errorMessage}> {this.state.EmailError}</Text>
                  <Text style={customStyles.subText}>Enter a Password:</Text>
                  <TextInput
                      placeholder="Enter your password"
                      onChangeText={(password) => this.setState ({password})}
                      backgroundColor="#C7E8F3"
                      value={this.state.password}
                      minLength={5}
                      secureTextEntry
                      style={customStyles.textInput}
                  />
                  <Text style={customStyles.errorMessage}> {this.state.error}</Text>
                  <TouchableOpacity
                      style={customStyles.button1}
                      onPress={()=> this.userSignup()}>
                      <Text style={customStyles.buttonText}>Create Account!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={customStyles.button1}
                      onPress={()=> navigation.goBack()}>
                      <Text style={customStyles.buttonText}>Go Back!</Text>
                  </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
        )
    }
}

const customStyles = StyleSheet.create({ // styles the text on the screen
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
  subText: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:"bold",
    justifyContent: 'center'
  },
  textInput:{
    padding:5,
    borderWidth:1,
    margin: 1,
    width: '100%'
  },
  button1:{
    height: 60,
    width: '100%',
    padding: 10,
    alignItems: 'center',
    borderWidth: 10,
    borderColor: '#8E4162',

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
 }
});
  export default Register;
