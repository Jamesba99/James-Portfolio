import React, { Component } from 'react';
import { Text, View, Button, ToastAndroid, SafeAreaView, TouchableOpacity, StyleSheet, Alert, FlatList, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//All imports for this screen
class UserInfo extends Component{
  //builds the props contructor while also declaring the variables
    constructor(props){
      super(props);
      this.state = {
        isLoading: true,
        usr_id: '',
        first_name: "",
        last_name: "",
        email: "",
        favourite_locations:"",
        userDeets: [],
        userDetails: ""
      };
}
//componentDidMount allows everything in the function to be done in the backgeround
  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.getUserData();
          this.checkLoggedIn();
      });
  }
// unsubscribed to clear the memory to stop clogedge
  componentWillUnmount (){
    this.unsubscribe();
}
/**
 getUserData will find all the location information of all the coffee shops
 Also the X-Authorization token is taken from async storage to prove to the server that the user is logged in
 Once the data has been pulled from /find the response is transfered into JSON format as long as a 200 response is obrained
 if another response is returned a else if to the correct response will return
 finally responseJson is then set to the correct format needed for this screen
**/
    getUserData = async () => {
      let token = await AsyncStorage.getItem('@session_token');
      let id = await AsyncStorage.getItem('id');

      return fetch("http://10.0.2.2:3333/api/1.0.0/user/"+(id), {
          method: 'get',
          headers:{
            "X-Authorization": token
          },
      })
      .then((response)=> {
        if(response.status === 200){
          return response.json()
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
        this.setState({
          isLoading: false,
          userDeets: responseJson,
          userDetails: responseJson,
          favourite_locations: responseJson.favourite_locations

        })
        console.log();
      })
      .catch((error) => {
        console.log(error);
        ToastAndroid.show("You are not logged in!",ToastAndroid.SHORT);
      })
    }
// checks if the user is logged in if not will not allow the user to use drawer navigation to get to this page
  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('LoginScreen');
    }
  };

  /**
  Render function which allows customisation on the screen
  starts off with conditional rendering to help if a slow network request to stop the user thinking the app has froze
  once the screen content has loaded the use of TouchableOpacity allows the user to navigate to other pages
  **/
  render(){
    console.log()
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
            <Text style={ customStyle.titleText }> My Account </Text>
            <Text style={customStyle.titleText}> ----------------- </Text>
            <Text style={ customStyle.resultsText }> User reference number: { this.state.userDetails.user_id} </Text>
            <Text style={ customStyle.resultsText }> Forename: { this.state.userDetails.first_name } | Surname: { this.state.userDetails.last_name } </Text>
            <Text style={ customStyle.resultsText }> Email: { this.state.userDetails.email } </Text>
            <Text style={ customStyle.resultsText }> Favourite Locations: </Text>
            <FlatList
              data={ this.state.favourite_locations }
              renderItem={({item}) => (
                <View style={ customStyle.ratingTitleText }>
                  <Text style={ customStyle.buttonText }> { item.location_name }, { item.location_town}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity
                  style={customStyle.button1}
                  onPress={() =>navigation.navigate('EditReviews')}>
                  <Text style={customStyle.buttonText}>See your Reviews</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={customStyle.button1}
                  onPress={() =>navigation.navigate('EditUSerDetails')}>
                  <Text style={customStyle.buttonText}>Update Account Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={customStyle.button1}
                  onPress={() =>navigation.navigate('FavouriteAlocation')}>
                  <Text style={customStyle.buttonText}>Edit Favorite Locations</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={customStyle.button1}
                  onPress={() =>navigation.navigate('HomeScreen')}>
                  <Text style={customStyle.buttonText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={customStyle.button1}
                  onPress={() =>navigation.navigate('LogoutScreen')}>
                  <Text style={customStyle.buttonText}>Logout</Text>
              </TouchableOpacity>
        </SafeAreaView>
      );
    }
  }
}
// style sheet to allow customisation of the different buttons,views,flatlists and TouchableOpacity
const customStyle = StyleSheet.create({ // styles the text on the screen
  container:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#41393E'
  },
  titleText: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 50,
    fontWeight:"bold"
  },
  buttonText:{
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:'bold',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button1:{
    height: 0.001,
    width: '100%',
    padding: 30,
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
  }

});

export default UserInfo;
