import React, { Component } from "react";
import {Text,View,Button,ToastAndroid,SafeAreaView,TouchableOpacity,StyleSheet,FlatList,TextInput,Image, ScrollView} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RNCamera } from 'react-native-camera';
//All import variables for this screen

import EditReviews from './EditReviews';
// imports the contents of editReviews to help display props and data from the previous screen

// the class acts a function to recieve props for the screen
// this screen will be the screen that allows the user to view the reviews in depth
class ViewPhotos extends Component{

  //builds the props contructor while also declaring the variables
    constructor(props){
      super(props);
      this.state = {
        isLoading: true,
        review_id: "",
        location_id: "",
        image: null
      };
    }
/**
componentDidMount allows everything in the function to be done in the background
this.checkedloggedIn will call the function check logged in as the user opens the app to make-
- sure they don't get access to this screen while not logged in
**/
      componentDidMount(){
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
            this.getPhotos();
          });
      }
  // unsubscribed to clear the memory to stop clogage
    componentWillUnmount (){
    this.unsubscribe();
  }
/**
getPhoto is a funtion that will get the photos from the reviews that were taken on the camera
location_id and review_id is transfered from edit reviews
Then the session token is pulled from async storage to make sure that the server knows the user is logged in
Once the data has been pulled from /photo the response is transferred into JSON as long as there is a 200 response
if another response is returned (400,401,403,404,500)a else if to the correct response will return with a toast explaining why
finally responseJson is then set to the required format and and applied to a variable in state

**/
    getPhotos = async () => {
      let token = await AsyncStorage.getItem('@session_token');
      const { review_id } = this.props.route.params;
      const { location_id} = this.props.route.params;

      return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(location_id)+"/review/"+(review_id)+"/photo", {
          method: 'get',
          headers:{
            "X-Authorization": token
          },
      })
      .then((response)=> {
        if(response.status === 200){
          return response
          console.log()
          }else if(response.status === 400){
            throw 'Bad Request';
          }else if(response.status === 401){
              throw '401 Unauthorized';
              console.log(response);
          }else if (response.status === 404){
              throw 'No Photo was found';
          }else if (response.status === 500){
              throw 'server error';
          }
      })
      .then((response) =>{
        console.log(response);
        this.setState({
          isLoading: false,
          image: response.url
        })
      })
      .catch((error)=> {
        console.log(error);
        ToastAndroid.show(error,ToastAndroid.SHORT);
      })
    }
/**
deletePhoto is a funtion that will delete the users photo from their review
Then the session token is pulled from async storage to make sure the server knows the user is logged in
the delete request is sent to the server showing that this photo has been  to be deleted and redirected to editReviews
Then there is responses with 200 meaning the deleted review has succsessfully been deleted sending the user back to editReviews
With other responses (400,401,403,404,500) being caught and printed and toasted to the user to keep them infomormed with whats going on
**/
    deletePhoto = async () => {
      let token = await AsyncStorage.getItem('@session_token');
      return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id)+"/photo", {
        method: 'delete',
          headers:{
            "X-Authorization": token
          },
        })
        .then((response) => {
          this.props.navigation.navigate("EditReviews")
          if(response.status === 200){
          ToastAndroid.show("Photo Deleted",ToastAndroid.SHORT);
          }else if(response.status === 400){
              throw 'Bad Request';
          }else if(response.status === 401){
              throw '401 Unauthorized';
              console.log(response);
          }else if(response.status === 403){
              throw '403 forbidden'
              console.log(response);
          }else if (response.status === 404){
              throw 'Not found';
              console.log(response);
          }else if (response.status === 500){
              throw 'server error';
              console.log(response);
          }else{
            throw 'something went wrong';
            console.log(response);
          }
      })
    }
  /***
  checks if the user is logged in if not will not allow the user to use drawer navigation to get to this page
  ***/
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('LoginScreen');
    }
  };
  /**
  Render function which allows customisation on the screen
  Constants are made for all the props that are being used on this screen they are made by using route.params which-
  - brings the variable from the previous screen 'editReviews'
  the delete photo button will set the ID to tell the server to assign that ID to the request
  **/
  render(){

    const { review_id } = this.props.route.params;
    const { location_id} = this.props.route.params;
    const { location_town } = this.props.route.params;
    const { location_name } = this.props.route.params;
    const { overall_rating }= this.props.route.params;
    const { price_rating } = this.props.route.params;
    const { quality_rating } = this.props.route.params;
    const { clenliness_rating } = this.props.route.params;
    const { review_body } = this.props.route.params;

    console.log(this.state.image)

    const navigation = this.props.navigation;

    return(
      <SafeAreaView style={ customStyle.container}>
        <ScrollView>
          <Text style={ customStyle.titleText }> View A Photo of:</Text>
          <Text style={ customStyle.locationText }> {location_name}, { location_town }</Text>
          <Text style={ customStyle.buttonText }> Overall Rating : { overall_rating }</Text>
          <Text style={ customStyle.buttonText }> Price Rating : { price_rating }</Text>
          <Text style={ customStyle.buttonText }> Quality Rating : { quality_rating }</Text>
          <Text style={ customStyle.buttonText }> Clenliness Rating : { clenliness_rating }</Text>
          <Text style={ customStyle.buttonText }> Review Body : </Text>
          <Text style={ customStyle.buttonText }> { review_body }</Text>
          <Text style={ customStyle.buttonText }> Photo Attached of Review:</Text>
          <View style={{ margin: 50 }}>
            <Image
              style={customStyle.logo}
              source={{uri: this.state.image}}
            />
          </View>
          <TouchableOpacity
            style={customStyle.button1}
            onPress={() => {
              this.deletePhoto()
              this.setState({
                loc_id: location_id,
                rev_id: review_id
              })
            }}>
            <Text style={ customStyle.touchOpacityText}> Delete This Photo!</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={customStyle.button1}
            onPress={() => {
                this.props.navigation.navigate("HomeScreen")
            }}>
            <Text style={ customStyle.touchOpacityText}> Home </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={customStyle.button1}
            onPress={() => {
                navigation.goBack()
            }}>
            <Text style={ customStyle.touchOpacityText}> Go Back!</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
// style sheet to allow customisation of the different buttons,views,flatlists and TouchableOpacity
const customStyle = StyleSheet.create({ // styles the text on the screen
  container:{
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
    backgroundColor: '#41393E'
  },
  titleText: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 55,
    fontWeight:"bold"
  },
  locationText: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 40,
    fontWeight:"bold"
  },
  buttonText:{
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:'bold',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  button1:{
    height: 10,
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: '#8E4162',
  },
  stretch: {
    width: 150,
    height: 150,
    resizeMode: 'stretch'
  },
  resultsText:{
    textAlignVertical: 'top',
    margin:5,
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:'bold',
    backgroundColor: '#8E4162',
    borderColor:'#C7E8F3'
  },
  touchOpacityText: { // styles the text colour and style
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  touchOpacityEditInfo: { // styles the text colour and style
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  logo: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    width: 300,
    height: 300,

},
});
export default ViewPhotos;
