import React, { Component } from 'react';
import { Text, View, Button, ToastAndroid, SafeAreaView, TouchableOpacity, StyleSheet, Alert, FlatList, StatusBar} from 'react-native';
import {ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating, AirbnbRating, RatingProps } from 'react-native-elements';
/**
All import variables for this screen
**/
/**
 this is the ViewReviews for the app - will be shown after the user navigates from home to this screen
**/
class ViewReviews extends Component{
  /**
  builds the props contructor while also declaring the variables
  **/
    constructor(props){
      super(props);
      this.state = {
        isLoading: true,
        locations: null,
        q: '',
        location_reviews: [],
        avg_overall_rating: 0,
        avg_price_rating: 0,
        avg_quality_rating: 0,
        avg_clenliness_rating: 0,
        search_in: 0,
        limit: 20,
        offset: 0,
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
      this.getData("http://10.0.2.2:3333/api/1.0.0/find");
    }
  // unsubscribed to clear the memory to stop clogage
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
    getData = async (url) => {
      let token = await AsyncStorage.getItem('@session_token');
      return fetch(url, {
          headers: {
            "X-Authorization": token
          },
      })
    .then((response) => {
      if (response.status = 200) {
        return response.json();
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

    .then((responseJson) => {
      this.setState({
        isLoading: false,
        locations: responseJson,
        location_reviews: responseJson.location_reviews
      })
      console.log(responseJson)
    })
    .catch((err)=> {
      console.log(err);
      ToastAndroid.show(err,ToastAndroid.SHORT);
    })
  }
  /**
  The querySearch function sets the url set a custom query in the network request
  starts off with setting q being the query additon to the network request
  then a series of if statements run saying if the star rating (that comes later) is set higher than one it will only-
  -show results with states set number or higher
  with the use of '&' which chains allowing more search criteria
  **/
    querySearch = () => {
      let url = "http://10.0.2.2:3333/api/1.0.0/find?"

      if(this.state.q != ''){
        url += "q=" + this.state.q + "&";
      }
      if (this.state.avg_overall_rating > 0){
        url += "overall_rating=" + this.state.avg_overall_rating + "&";
      }
      if (this.state.avg_price_rating > 0){
        url += "price_rating=" + this.state.avg_price_rating  + "&";
      }
      if (this.state.avg_quality_rating > 0){
        url += "quality_rating=" + this.state.avg_quality_rating  + "&";
      }
      if (this.state.avg_clenliness_rating > 0){
        url += "clenliness_rating=" + this.state.avg_clenliness_rating  + "&";
      }
      this.getData(url);
    }
    ratingCompleted(rating, name){
      let stateObject = () => {
        let returnObj = {};
        returnObj[name] = rating;
        return returnObj;
      };
      this.setState( stateObject );
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
      starts off with conditional rendering to help if a slow network request to stop the user thinking the app has froze
      once the screen content has loaded the use of TouchableOpacity allows the user to navigate to other pages
      Also the use of AirB&b stars allow a custom prop that could be used instead of inputting an a number in a text field
      then a search button which initiates the querySearch function
      **/
    render(){
      console.log(this.state.location_reviews);
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
            <Text style={{fontSize: 50, fontWeight: 'bold', color: '#C7E8F3'}}> Loading.... </Text>
        </View>
        );
      }else{
        return(
          <SafeAreaView  style={customStyle.container}>
            <View>
                <Text style={customStyle.titleText}>View Reviews</Text>
                <Text style={customStyle.titleText}> ---------------- </Text>
                <TextInput
                  value={this.state.q}
                  onChangeText={(q) => this.setState({q: q})}
                  placeholder= "Enter your search criteria "
                  backgroundColor="#C7E8F3"
                  style={customStyle.textInput}
                />
                <Text style={customStyle.ratingsTitleText}>Overall Rating </Text>
                <AirbnbRating
                  size={15}
                  reviewColor= '#C7E8F3'
                  reviews={["Awful!", "Bad", "OK", "Good", "Only the Best Results!"]}
                  defaultRating={0}
                  selectedColor="#8E4162"
                  onFinishRating={(rating) => this.ratingCompleted( rating, "avg_overall_rating")}
                />
                <Text style={customStyle.ratingsTitleText}>Price Rating </Text>
                <AirbnbRating
                  size={15}
                  reviewColor= '#C7E8F3'
                  reviews={["Awful!", "Bad", "OK", "Good", "Only the Best Results!"]}
                  defaultRating={0}
                  selectedColor="#8E4162"
                  onFinishRating={(rating) => this.ratingCompleted( rating, "avg_price_rating")}
                />
                <Text style={customStyle.ratingsTitleText}>Quality Rating </Text>
                <AirbnbRating
                  size={15}
                  reviewColor= '#C7E8F3'
                  reviews={["Awful!", "Bad", "OK", "Good", "Only the Best Results!"]}
                  defaultRating={0}
                  selectedColor="#8E4162"
                  onFinishRating={(rating) => this.ratingCompleted( rating, "avg_price_rating")}
                />
                <Text style={customStyle.ratingsTitleText}>Clenliness Rating </Text>
                <AirbnbRating
                  size={15}
                  reviewColor= '#C7E8F3'
                  reviews={["Awful!", "Bad", "OK", "Good", "Only the Best Results!"]}
                  defaultRating={0}
                  selectedColor="#8E4162"
                  onFinishRating={(rating) => this.ratingCompleted( rating, "avg_clenliness_rating")}
                />
                  <TouchableOpacity
                      style={customStyle.button1}
                      onPress={() =>this.querySearch()}>
                      <Text style={customStyle.touchOpacityText}>Search</Text>
                  </TouchableOpacity>
                  <FlatList
                    data={this.state.locations}
                    renderItem={({item}) => (
                        <View style={customStyle.flatListView}>
                          <Text style={customStyle.resultsText}> Coffee Shop: { item.location_name }</Text>
                          <Text style={customStyle.resultsText}> Coffee Shop Town: { item.location_town }</Text>
                          <Text style={customStyle.resultsText}> Overall Rating: { item.avg_overall_rating } </Text>
                          <Text style={customStyle.resultsText}> Price Rating: { item.avg_price_rating } </Text>
                          <Text style={customStyle.resultsText}> Quality Rating Rating: { item.avg_quality_rating } </Text>
                          <Text style={customStyle.resultsText}> Clenliness Rating : { item.avg_clenliness_rating } </Text>
                          <TouchableOpacity
                            style={customStyle.button1}
                            onPress={() => {
                              this.props.navigation.navigate("FlatListOutput", {
                                 location_id: item.location_id,
                                 location_name: item.location_name ,
                                 location_town: item.location_town,
                                 avg_overall_rating: item.avg_overall_rating,
                                 avg_price_rating: item.avg_price_rating,
                                 avg_quality_rating: item.avg_quality_rating,
                                 avg_clenliness_rating: item.avg_clenliness_rating,
                                 location_reviews: item.location_reviews,
                                 overall_rating: item.overall_rating,
                                 })
                            }}>
                            <Text style={customStyle.touchOpacityText}> View Review in Detail</Text>
                          </TouchableOpacity>
                        </View>
                    )}
                    keyExtractor={(item, index) => item.location_id.toString()}
                    />
                    <TouchableOpacity
                        style={customStyle.navButton}
                        onPress={() =>navigation.navigate('HomeScreen')}>
                        <Text style={customStyle.homeTouchOpacity}>Home</Text>
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
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    margin: 2,
    fontSize:40,
    fontWeight: 'bold',
    flexWrap: 'wrap'
  },
  resultsText:{
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:'bold',
    padding: 1
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
    fontSize: 20
  },
  button1:{
    height: 60,
    width: 340,
    padding: 10,
    alignItems: 'center',
    borderWidth: 10,
    borderColor: '#8E4162',
  },
  touchOpacityText: { // styles the text colour and style
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:'bold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeTouchOpacity: {
    color: '#C7E8F3',
    fontSize: 20,
    fontWeight:'bold',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3
  },
  flatListView: { // styles the text colour and style
    flex: 1,
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
    fontSize: 50,
    margin:2
  },
  navButton:{
    height: 5,
    width: 340,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 10,
    borderColor: '#8E4162',
    margin:2,
  },

});
export default ViewReviews;
