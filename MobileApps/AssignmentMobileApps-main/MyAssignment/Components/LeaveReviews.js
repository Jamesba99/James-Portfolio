import React, { Component } from 'react';
import { Text, View, Button, ToastAndroid, SafeAreaView, TouchableOpacity, StyleSheet, Alert, FlatList, StatusBar} from 'react-native';
import {ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
All import variables for this screen
**/

/**
 this is the edit reviews screen  for the app - will allow the user to edit and delete reviews
**/

class ViewReviews extends Component{
  /**
  builds the props contructor while also declaring the variables needed for this screen
  sets the loading as true for later use
  **/
    constructor(props){
      super(props);
      this.state = {
        loc_id: "",
        overall_rating: "",
        price_rating: "",
        quality_rating: "",
        clenliness_rating: "",
        review_body: "",
        isLoading: true,
        listData: [],
        reviewError: "",
        nameValidate: "",
      };
    }
    /**
    componentDidMount allows everything in the function to be done in the background
    **/
    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
      });
      this.getFindInformation();
    }

  // unsubscribed to clear the memory to stop clogage
    componentWillUnmount (){
      this.unsubscribe();
    }
/**
getFindInformation will find all the reviews by the user
Once the data has been pulled from /find the response is transferred into JSON as long as there is a 200 response
If another response is returned a else if to the corrasponding response will return with a toast explaining why
Finally responseJson is then set to the required format and and applied to a variable in state
**/
    getFindInformation = async () => {
      let token = await AsyncStorage.getItem('@session_token');
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
        })
      })
      .catch((error)=> {
        console.log(error);
        ToastAndroid.show(error,ToastAndroid.SHORT);
      })
    }
/**
addReviews is a funtion that will add a new review to the server
Token is pulled from async storage to help complete the post network request and prove that the user is logged in
let variables is created to parse the data to correct format
the post request is sent to the server to /review to show that the user has liked that review
Then if the server responds with 201 meaning the review has been left while being toasted that the like has been added
With other responses (400,401,403,404,500) being caught and printed and toasted to the user to keep them infomormed with whats going on
**/

  addReviews = async () => {
    let sendVariables = {
      overall_rating: parseInt(this.state.overall_rating),
      price_rating: parseInt(this.state.price_rating),
      quality_rating: parseInt(this.state.quality_rating),
      clenliness_rating: parseInt(this.state.clenliness_rating),
      review_body: this.state.review_body
   };

    let token = await AsyncStorage.getItem('@session_token')
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review",{
      method: 'post',
      headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
      },
      body: JSON.stringify(sendVariables)
    })
    console.log(token)
    .then((response) => {
        if(response.status === 201){
          this.props.navigation.navigate('ViewReviews')
            ToastAndroid.show("Review has been added ",ToastAndroid.SHORT);
          return response.json()
          ToastAndroid.show("Review has been added ",ToastAndroid.SHORT);
        }else if(response.status === 400){
            throw 'Bad Request';
        }else if(response.status === 401){
            throw '401 Unauthorized';
            console.log(response);
        }else if (response.status === 404){
            throw 'Not found';
        }else if (response.status === 500){
            throw 'server error';
        }else{
          throw 'something went wrong';
        }
        })

        console.log(responseJson)
        .then((responseJson) => {
          ToastAndroid.show("Review has been added ",ToastAndroid.SHORT);
          this.setState({
            isLoading: false,
            listData: responseJson
          })
          console.log("review added", responseJson);
          ToastAndroid.show("Review has NOT been added ",ToastAndroid.SHORT);

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
        ToastAndroid.show("You are not logged in!",ToastAndroid.SHORT)
    }
  };


  /**
  Render function which allows customisation on the screen
  Once the correct fields are entered the information entered is set to state then the add review button will call the LeaveReviews function
  An if state ment will start off with conditional rendering will show the user a loading prompt to show the page is loading then-
  - once it has loaded the contents of the page will be displayed
  **/


  render(){
    const navigation = this.props.navigation;

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
          <Text style={customStyle.text}> Loading.... </Text>
      </View>
      );
    }else{
    return(
        <View style={customStyle.container}>
            <Text style={customStyle.text}>Leave a Review!</Text>
            <Text style={customStyle.titleText}>-----------------------------</Text>
            <Text style={customStyle.titleText}>Click a Cafe to Review</Text>
              <FlatList
                data = {this.state.listData}
                renderItem = {({item}) => (
                  <TouchableOpacity
                    onPress={() => this.setState({loc_id: item.location_id})}
                    >
                    <Text style={customStyle.buttonText}>{item.location_name}, {item.location_town}</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item,index) => index.toString()}
              />
              <TextInput
                placeholder= "Enter the overall rating of this coffee"
                onChangeText={(overall_rating) => this.setState ({overall_rating})}
                backgroundColor="#C7E8F3"
                value={this.state.overall_rating}
                style ={customStyle.textInput}
              />
              <TextInput
                placeholder= "Enter the overall rating of the price for this coffee"
                onChangeText={(price_rating) => this.setState ({price_rating})}
                backgroundColor="#C7E8F3"
                value={this.state.price_rating}
                style ={customStyle.textInput}
              />
              <TextInput
                placeholder= "Enter the overall rating of the quality of this coffee"
                onChangeText={(quality_rating) => this.setState ({quality_rating})}
                backgroundColor="#C7E8F3"
                value={this.state.quality_rating}
                style ={customStyle.textInput}
              />
              <TextInput
                placeholder= "Enter the overall rating of the clenliness_rating"
                onChangeText={(clenliness_rating) => this.setState ({clenliness_rating})}
                backgroundColor="#C7E8F3"
                value={this.state.clenliness_rating}
                style ={customStyle.textInput}
              />
              <TextInput
                placeholder= "What was good/bad about this coffee (review body)"
                onChangeText={(review_body) => this.setState({review_body})}
                backgroundColor="#C7E8F3"
                value={this.state.review_body}
                style ={customStyle.textInput}

              />
              <TouchableOpacity
                style={customStyle.button1}
                onPress={()=> {
                  this.addReviews()

                  ToastAndroid.show("Review has been added ",ToastAndroid.SHORT);
                  this.props.navigation.navigate("HomeScreen")
                }}>
                <Text style={customStyle.touchOpacityText}> Post Review!</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={customStyle.button1}
                onPress={()=> navigation.goBack()}>
                <Text style={customStyle.touchOpacityText}> Back </Text>
              </TouchableOpacity>
        </View>
    );
  }
  }
}
// style sheet to allow customisation of the different buttons,views,flatlists and TouchableOpacity
const customStyle = StyleSheet.create({ // styles the text on the screen
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#41393E'
  },
  text: {
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    fontSize: 50,
    fontWeight: 'bold'
  },
  titleText: {
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    fontSize: 35,
    fontWeight: 'bold'
  },
  textInput:{
    padding:5,
    alignItems: 'center',
    borderWidth:1,
    margin:5
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
  //  alignItems: 'center',
    flex: 1,
    marginTop: StatusBar.currentHeight || 1,
    width: '100%',
    fontSize: 30,
    fontWeight:'bold',
    color: '#C7E8F3',
    backgroundColor: '#8E4162'
    //justifyContent: 'center'
  },
  textInput:{
    width: '100%',
    padding:5,
    borderWidth:1,
    margin:5
  },
  touchOpacityText:{
    color: '#C7E8F3',
    alignItems: 'center',
    flex: 1,
    fontSize: 15,
    fontWeight:'bold',
  }

});

export default ViewReviews;
