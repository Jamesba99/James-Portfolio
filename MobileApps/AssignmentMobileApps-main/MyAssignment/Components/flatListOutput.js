import React, { Component } from 'react';
import { Text, View, Button, ToastAndroid, SafeAreaView, TouchableOpacity, StyleSheet, Alert, FlatList, StatusBar, Image} from 'react-native';
import {ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating } from 'react-native-elements';
/**
All import variables for this screen
this is the flatlistout screen  for the app - will allow the user to to view a review for a cafe in full showing all the reviews
imports the contents of editReviews to help display props and data from the previous screen
**/
import ViewReviews from './ViewReviews';
//builds the props contructor while also declaring the variables
class FlatListOutput extends Component{
    constructor(props){
      super(props);
      this.state = {
        viewLocationReviews: "" ,
        locations: [],
        isLoading: true,
        location_reviews: null,
        location_id: "",
        locationReviews: null,
        like:"",
        getLocation: ""
      }
    }
  /**
  componentDidMount allows everything in the function to be done in the background
  this.checkedloggedIn will call the function check logged in as the user opens the app to make-
  - sure they don't get access to this screen while not logged in
  **/
componentDidMount(){
  this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getLocationData();
  });
}
/**
unsubscribed to clear the memory to stop clogage
**/
componentWillUnmount (){
  this.unsubscribe();
}
  getLocationData = async () => {
    const { location_id } = this.props.route.params;
    let token = await AsyncStorage.getItem('@session_token');
    return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(location_id), {
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
        getLocation: responseJson
      })
    })
    .catch((error)=> {
      console.log(error);
      ToastAndroid.show(error,ToastAndroid.SHORT);
    })
  }
/**
likeAReview is a funtion that will post a like for a review
Then the session token is pulled from async storage to make sure the server knows the user is logged in
the post request is sent to the server to /like to show that the user has liked that review
Then if the server responds with 200 meaning the post review has succsessfully been liked sending the user back to ViewReviews-
-while being toasted that the like has been added
With other responses (400,401,404,500) being caught and printed and toasted to the user to keep them infomormed with whats going on
**/
        likeAReview = async () => {
          let token = await AsyncStorage.getItem('@session_token');
          return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id)+"/like", {
            method: 'post',
              headers:{
                "X-Authorization": token
              },
            })
            .then((response) => {
                  this.props.navigation.navigate('ViewReviews');
                if(response.status === 200){
                  ToastAndroid.show("A like has been added ",ToastAndroid.SHORT);
                  return response
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

                console.log(response)
                .then((response) => {
                  ToastAndroid.show("Like has been added ",ToastAndroid.SHORT);
                  this.setState({
                    isLoading: false,
                    like: response
                  })

                })
                .catch((error) => {
                    console.log(error);
                    ToastAndroid.show(error,ToastAndroid.SHORT);
                })
        }
        /**
        unLikeAReview is a funtion that will delete a like for a review
        Then the session token is pulled from async storage to make sure the server knows the user is logged in
        the delete request is sent to the server to /like to show that the user would like to unliked that review
        Then if the server responds with 200 meaning the post review has succsessfully been unliked sending the user back to userInfopage-
        -while being toasted that the like has been removed
        With other responses (400,401,403,404,500) being caught and printed and toasted to the user to keep them infomormed with whats going on
        **/
        unlikeAReview = async () => {
          let token = await AsyncStorage.getItem('@session_token');
          return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id)+"/like", {
            method: 'delete',
              headers:{
                "X-Authorization": token
              },
            })
          .then((response) => {
            this.props.navigation.navigate('ViewReviews');
            if(response.status === 200){
            ToastAndroid.show("Review unliked",ToastAndroid.SHORT);
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

/**
Render function which allows customisation on the screen
Constants are made for all the props that are being used on this screen they are made by using route.params which-
- brings the variable from the previous screen 'ViewReviews'
**/
  render(){
    const navigation = this.props.navigation;
    const {location_reviews} = this.props.route.params;
    const {location_name} = this.props.route.params;
    const {location_town} = this.props.route.params;
    const {avg_overall_rating}= this.props.route.params;
    const {avg_price_rating} = this.props.route.params;
    const {avg_quality_rating} = this.props.route.params;
    const {avg_clenliness_rating} = this.props.route.params;
    const {review_body} = this.props.route.params;
    const {quality_rating} = this.props.route.params;
    const { location_id }= this.props.route.params;

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
          <Text style={customStyle.titleText}> Review of { this.state.getLocation.location_name }</Text>
          <Text style={customStyle.titleText}> { this.state.getLocation.location_town } </Text>
            <Text style={customStyle.resultsText}> ----------------------- </Text>
          <Text style={customStyle.resultsText}> Overall rating is: { this.state.getLocation.avg_overall_rating }</Text>
          <Text style={customStyle.resultsText}> Price Rating: { this.state.getLocation.avg_price_rating} </Text>
          <Text style={customStyle.resultsText}> Quality Rating: { this.state.getLocation.avg_quality_rating } </Text>
          <Text style={customStyle.resultsText}> Clenliness Rating: { this.state.getLocation.avg_clenliness_rating } </Text>
          <Text style={customStyle.resultsText}> ----------------------- </Text>
          <FlatList
            data={location_reviews}
            renderItem={({item}) => (
              <View style={ customStyle.flatListView }>
                <Text style={ customStyle.resultsText }> User { item.review_id }'s Review: </Text>
                <Text style={ customStyle.resultsText }> Number of Likes : { item.likes } </Text>
                <Text style={ customStyle.resultsText }> Overall Rating : { item.review_overallrating } </Text>
                <Text style={ customStyle.resultsText }> Price Rating : { item.review_pricerating } </Text>
                <Text style={ customStyle.resultsText }> Quality Rating : { item.review_qualityrating } </Text>
                <Text style={ customStyle.resultsText }> Clenliness Rating : { item.review_clenlinessrating } </Text>
                <Text style={ customStyle.resultsText }> Review : {item.review_body} </Text>
                <TouchableOpacity
                  style={customStyle.like}
                  onPress={() => {
                    this.likeAReview()
                    this.setState({
                      loc_id: location_id,
                      rev_id: item.review_id
                    })
                  }}>
                  <Text style={ customStyle.unlikeFont}> Like!</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={customStyle.unLike}
                  onPress={() => {
                    this.unlikeAReview()
                    this.setState({
                      loc_id: location_id,
                      rev_id: item.review_id
                    })
                  }}>
                  <Text style={ customStyle.unlikeFont}> Unlike!</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity
              style={customStyle.button1}
              onPress={() =>navigation.goBack()}>
              <Text style={customStyle.buttonText}>Go Back</Text>
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
    justifyContent: 'center',
    backgroundColor: '#41393E'
  },
  flatLisText: { // styles the text colour and style
    flex: 1,
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    fontSize: 50
  },
  textInput:{
    padding:5,
    alignItems: 'center',
    borderWidth:1,
    margin:5
  },
  titleText: { // styles the text colour and style
  //  flex: 1,
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    fontSize: 30,
    fontWeight: 'bold'
  },
  resultsText:{
    textAlignVertical: 'top',
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:'bold',
  },
  ratingFields:{
    flex: 1,
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    fontSize: 50
  },
  ratingsTitleText : { // styles the text colour and style
    color: '#C7E8F3',
    padding: 1,
    fontWeight: 'bold',
    fontSize: 25
  },
  stretch: {
    flex:1
  },
  buttonText:{
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:'bold',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
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
  },
  unLike:{
    height: 10,
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: '#D21404',
    margin:2,
  },
  like:{
    height: 10,
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: '#74B72E',
    margin:2,
  },
  likeFont:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },
  unlikeFont:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
  },


});
export default FlatListOutput;
