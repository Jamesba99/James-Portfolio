import React, { Component } from 'react';
import { Text, View, Button, ToastAndroid, TextInput, SafeAreaView, TouchableOpacity, StyleSheet, Alert, FlatList, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//All import variables for this screen


// the class acts a function to recieve props for the screen
// this screen will be the screen that allows the user to edit their user details
class EditUSerDetails extends Component{

  //builds the props contructor while also declaring the variables
    constructor(props){
      super(props);
      this.state = {
        isLoading: true,
        first_name: "",
        last_name: "",
        email: "",
        userEmail: "",
        firstName: "",
        lastName: "",
        password: ""

      };
    }
/**
componentDidMount allows everything in the function to be done in the background
**/
    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.getUserData();
          this.checkLoggedIn()
    });

    }
    // unsubscribed to clear the memory to stop clogage
    componentWillUnmount (){
    this.unsubscribe();
    }
/**
getUserData will get all the user information
ID and Token is pulled from async storage to help complete the get network request and prove that the user is logged in
Once the data has been pulled from /user/id the response is transferred into JSON as long as there is a 200 response
If another response is returned (400,401,404,500) a else if to the correct response will return with a toast explaining why
Finally responseJson is then set to the required format and and applied to a variable in state
Any errors are toasted to the user
**/
    getUserData = async () => {
      let token = await AsyncStorage.getItem('@session_token');
      let id = await AsyncStorage.getItem('id');

      return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+ (id), {
          method: 'get',
          headers:{
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
          isLoading:false,
          firstName: responseJson.first_name,
          lastName: responseJson.last_name,
          userEmail: responseJson.email,
          password: responseJson.password
        });
        console.log(this.state.firstName);
        console.log(this.state.lastName);
        console.log(this.state.userEmail);
      })
      .catch((error)=>{
        console.log(error);
        ToastAndroid.show(error,ToastAndroid.SHORT);
      })
    }

/**
UpdateUserDetails is a funtion that will update the users details when the correct button and credentials are entered
ID and Token is pulled from async storage to help complete the patch network request and prove that the user is logged in
let variables is created to parse the data to correct format
the patch request is sent to the server while stringyifing the sendVariables variable
Then there is responses with 200 meaning the updated review has succsessfully been patched and the user is sent to the homescreen
With other responses (400,401,404,500) being caught and printed to the user to keep them infomormed with whats going on
**/
  updateUserDetails = async () => {

    let sendVariables = {
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      email: this.state.email,
      password: this.state.password
    }

    console.log(sendVariables)

    let token = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem('id');

    return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+ (id) , {
      method: 'patch',
        headers:{
          'Content-Type': 'application/json',
          "X-Authorization": token
        },
        body: JSON.stringify(sendVariables)
    })
    .then((response) => {

      if(response.status === 200){
          return response
          console.log(response);
          ToastAndroid.show(responseJson,ToastAndroid.SHORT);
      }else if(response.status === 400){
        throw 'Bad Request';
      }else if(response.status === 401){
          throw '401 Unauthorized';
          console.log(response);
      }else if (response.status === 403){
          throw 'forbidden'
          console.log(response);
      }else if (response.status === 404){
          throw 'Not found';
      }else if (response.status === 500){
          throw 'server error';
      }
    })
    .then((responseJson) =>{
      console.log(responseJson);
      this.props.navigation.navigate("HomeScreen")
    })
    .catch((error) => {
      console.log(error)
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
once the screen content has loaded the use of TouchableOpacity allows the user to navigate to other pages
When the correct button is pressed the function which is part of that button will be called
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
        <SafeAreaView style={ customStyle.container }>
          <View>
            <Text style={ customStyle.titleText }> My Account </Text>
            <Text style={ customStyle.resultsText }> Forename: {this.state.firstName} | Surname: {this.state.lastName} </Text>
            <Text style={ customStyle.resultsText }> Email: {this.state.userEmail} </Text>

            <TextInput
                placeholder="Enter your first name"
                onChangeText={(first_name) => this.setState ({first_name})}
                backgroundColor="#C7E8F3"
                value={this.state.first_name}
                style={{padding:5, borderWidth:1, margin:5}}
            />
            <TextInput
                placeholder="Enter your second name"
                onChangeText={(last_name) => this.setState ({last_name})}
                backgroundColor="#C7E8F3"
                value={this.state.last_name}
                style={{padding:5, borderWidth:1, margin:5}}
            />
            <TextInput
                placeholder="Enter your email"
                onChangeText={(email) => this.setState ({email})}
                backgroundColor="#C7E8F3"
                value={this.state.email}
                style={{padding:5, borderWidth:1, margin:5}}
            />
            <TextInput
                placeholder="Enter a Password"
                onChangeText={(password) => this.setState ({password})}
                backgroundColor="#C7E8F3"
                secureTextEntry
                value={this.state.password}
                style={{padding:5, borderWidth:1, margin:5}}
            />
            <TouchableOpacity
                style={customStyle.button1}
                onPress={()  =>this.updateUserDetails() }>
                <Text style={customStyle.buttonText }> Update User Details </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={customStyle.button1}
                onPress={() =>navigation.navigate('HomeScreen')}>
                <Text style={customStyle.buttonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={customStyle.button1}
                onPress={() =>navigation.goBack()}>
                <Text style={customStyle.buttonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }
    }
}
/**
style sheet to allow customisation of the different buttons,views,flatlists and TouchableOpacity
**/
const customStyle = StyleSheet.create({ // styles the text on the screen
  container:{
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#41393E'
  },
  titleText: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 50,
    fontWeight:"bold"
  },
  buttonText:{
    color: '#C7E8F3',
    fontSize: 25,
    fontWeight:'bold',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button1:{
    height: 30,
    width: 345,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: '#8E4162',
    margin:1
  },
  resultsText:{
    textAlignVertical: 'top',
    margin:5,
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:'bold',
    backgroundColor: '#8E4162',
    borderColor:'#C7E8F3'
  }

});

export default EditUSerDetails;
