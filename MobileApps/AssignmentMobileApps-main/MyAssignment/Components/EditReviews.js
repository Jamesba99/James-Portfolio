import React, { Component } from "react";
import {Text,View,Button,ToastAndroid,SafeAreaView,TouchableOpacity,StyleSheet,FlatList,TextInput, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RNCamera } from 'react-native-camera';

/**
All import variables for this screen
**/

/**
 this is the edit reviews screen  for the app - will allow the user to edit and delete reviews
**/
class EditReviews extends Component{
  /**
  builds the props contructor while also declaring the variables needed for this screen
  sets the loading as true for later use
  **/
    constructor(props){
      super(props);
      this.state = {
        isLoading: true,
        usr_id: "",
        reviews:[],
        userDeets: [],
        userDetails: "",
        overall_rating: "",
        price_rating: "",
        quality_rating:"",
        clenliness_rating:"",
        review_body:"",
        location_id: "",
        like: ""
      };


/**
componentDidMount allows everything in the function to be done in the background
this.checkedloggedIn will call the function check logged in as the user opens the app to make-
- sure they don't get access to this screen while not logged in
**/
    }
    componentDidMount(){
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.getUserData();
            this.checkLoggedIn();
      });
    }
    /**
    unsubscribed to clear the memory to stop clogage
    **/
  componentWillUnmount(){
    this.unsubscribe();
  }
/**
getUserData will find all the reviews by the user
ID and Token is pulled from async storage to help complete the get network request and prove that the user is logged in
Once the data has been pulled from /user/id the response is transferred into JSON as long as there is a 200 response
if another response is returned a else if to the correct response will return with a toast explaining why
finally responseJson is then set to the required format and and applied to a variable in state
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
          isLoading: false,
          userDeets: responseJson,
          userDetails: responseJson,
          reviews: responseJson.reviews,

        })
      })
      .catch((error)=> {
        console.log(error);
        ToastAndroid.show(error,ToastAndroid.SHORT);
      })
    }

/**
UpdateUserReview is a funtion that will update the users review when the correct button and credentials are entered
ID and Token is pulled from async storage to help complete the patch network request and prove that the user is logged in
let variables is created to parse the data to correct format
the patch request is sent to the server while stringyifing the sendVariables variable
Then there is responses with 200 meaning the updated review has succsessfully been patched and the user is sent to the homescreen
With other responses being caught and printed to the user to keep them infomormed with whats going on
**/

  updateUserReview = async () => {
      let sendVariables ={
          overall_rating: parseInt(this.state.overall_rating),
          price_rating: parseInt(this.state.price_rating),
          quality_rating: parseInt(this.state.quality_rating),
          clenliness_rating: parseInt(this.state.clenliness_rating),
          review_body: this.state.review_body
        }
      console.log(sendVariables);
      let token = await AsyncStorage.getItem('@session_token');
      let id = await AsyncStorage.getItem('id');

      return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+ (this.state.loc_id)+ "/review/"+(this.state.rev_id) , {
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
            ToastAndroid.show("Review updated",ToastAndroid.SHORT);
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
        console.log(error);
      })
    }
/**
deleteReview is a funtion that will delete the users review when the correct button is pressed
Then the session token is pulled from async storage to make sure the server knows the user is logged in
the delete request is sent to the server showing that this review needs to be deleted
Then there is responses with 200 meaning the deleted review has succsessfully been deleted sending the user back to userInfopage
With other responses being caught and printed and toasted to the user to keep them infomormed with whats going on
**/
    deleteReview = async () => {
      let token = await AsyncStorage.getItem('@session_token');
      return fetch("http://10.0.2.2:3333/api/1.0.0/location/"+(this.state.loc_id)+"/review/"+(this.state.rev_id), {
        method: 'delete',
          headers:{
            "X-Authorization": token
          },
        })
        .then((response) => {
          this.props.navigation.navigate("UserInfo")
          if(response.status === 200){
          ToastAndroid.show("Review Deleted",ToastAndroid.SHORT);
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
likeAReview is a funtion that will post a like for a review
Then the session token is pulled from async storage to make sure the server knows the user is logged in
the post request is sent to the server to /like to show that the user has liked that review
Then if the server responds with 200 meaning the post review has succsessfully been liked sending the user back to userInfopage-
-while being toasted that the like has been added
With other responses (400,401,403,404,500) being caught and printed and toasted to the user to keep them infomormed with whats going on
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
            this.props.navigation.navigate('UserInfo');
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
              ToastAndroid.show("Review has been added ",ToastAndroid.SHORT);
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
        this.props.navigation.navigate("UserInfo")
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
    console.log(this.state.reviews)
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
          <Text style={ customStyle.titleText }> My Reviews </Text>
          <FlatList
            data={ this.state.reviews }
            renderItem={({item}) => (
              <View style={ customStyle.ratingTitleText }>
                <Text style={ customStyle.buttonText }>-------------------------------------------------</Text>
                  <Text style={ customStyle.buttonText }> { item.review.review_id} </Text>
                  <Text style={ customStyle.buttonText }> { item.location.location_name }, { item.location.location_town}</Text>
                  <Text style={ customStyle.buttonText }> Overall Rating: { item.review.overall_rating }</Text>
                  <Text style={ customStyle.buttonText }> Price Rating: { item.review.price_rating }</Text>
                  <Text style={ customStyle.buttonText }> Quality Rating: { item.review.quality_rating }</Text>
                  <Text style={ customStyle.buttonText }> Clenliness Rating: { item.review.clenliness_rating }</Text>
                  <Text style={ customStyle.buttonText }> Review body: { item.review.review_body }</Text>
                  <Text style={ customStyle.buttonText }> Number of likes: { item.review.likes }</Text>
                  <Text style={ customStyle.buttonText }> Photo: </Text>
                  <Image
                    style={customStyle.logo}
                    source={{uri: item.location.photo_path}}
                  />
                  <TouchableOpacity
                    style={customStyle.like}
                    onPress={() => {
                        this.likeAReview()
                        this.setState({
                          loc_id: item.location.location_id,
                          rev_id: item.review.review_id
                        })
                    }}>
                    <Text  style={ customStyle.likeFont}> Like!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={customStyle.unLike}
                    onPress={() => {
                      this.unlikeAReview()
                      this.setState({
                        loc_id: item.location.location_id,
                        rev_id: item.review.review_id
                      })
                    }}>
                    <Text style={ customStyle.unlikeFont}> Unlike!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={customStyle.button1}
                    onPress={() =>{
                        this.props.navigation.navigate("CameraScreen", {
                          review_id: item.review.review_id,
                          location_id: item.location.location_id
                        })
                      }}>
                    <Text style={ customStyle.touchOpacityEditInfo}> Add A Photo!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={customStyle.button1}
                    onPress={() =>{
                      this.props.navigation.navigate("ViewPhotos",{
                        location_town: item.location.location_town,
                        location_name: item.location.location_name,
                        review_id: item.review.review_id,
                        location_id: item.location.location_id,
                        overall_rating: item.review.overall_rating ,
                        price_rating: item.review.price_rating ,
                        quality_rating: item.review.quality_rating ,
                        clenliness_rating: item.review.clenliness_rating ,
                        review_body: item.review.review_body
                        })
                      }}>
                    <Text style={ customStyle.touchOpacityEditInfo}> View Photo for this Review</Text>
                  </TouchableOpacity>
                  <Text style={ customStyle.buttonText }>-------------------------------------------------</Text>
                  <Text style={ customStyle.buttonText }>Not Satisfied? Update this Review!</Text>
                  <TextInput
                      placeholder="Overall Rating"
                      onChangeText={(overall_rating) => this.setState({overall_rating})}
                      value={ this.state.overall_rating}
                      backgroundColor="#C7E8F3"
                      style={{padding:5, borderWidth:1, margin:5, width: '100%'}}
                  />
                  <TextInput
                      placeholder="Price Rating"
                      onChangeText={(price_rating) => this.setState({price_rating})}
                      value={ this.state.price_rating}
                      backgroundColor="#C7E8F3"
                      style={{padding:5, borderWidth:1, margin:5, width: '100%'}}
                  />
                  <TextInput
                      placeholder="Quality Rating"
                      onChangeText={(quality_rating) => this.setState({quality_rating})}
                      value={ this.state.quality_rating}
                      backgroundColor="#C7E8F3"
                      style={{padding:5, borderWidth:1, margin:5, width: '100%'}}
                  />
                  <TextInput
                      placeholder="clenliness Rating"
                      onChangeText={(clenliness_rating) => this.setState({clenliness_rating})}
                      value={ this.state.clenliness_rating}
                      backgroundColor="#C7E8F3"
                      style={{padding:5, borderWidth:1, margin:5 , width: '100%'}}
                  />
                  <TextInput
                      placeholder=" review_body"
                      onChangeText={(review_body) => this.setState({review_body})}
                      value={ this.state.review_body}
                      backgroundColor="#C7E8F3"
                      style={{padding:5, borderWidth:1, margin:5, width: '100%'}}
                  />
                  <TouchableOpacity
                    style={customStyle.button1}
                    onPress={() => {
                        this.updateUserReview()
                        ToastAndroid.show("Review updated",ToastAndroid.SHORT);
                        this.setState({
                          loc_id: item.location.location_id,
                           rev_id: item.review.review_id
                         })
                    }}>
                    <Text style={customStyle.touchOpacityEditInfo}>Update!</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={customStyle.button1}
                    onPress={() => {
                        this.deleteReview()
                        this.setState({
                          loc_id: item.location.location_id,
                          rev_id: item.review.review_id
                        })
                    }}>
                    <Text style={customStyle.touchOpacityEditInfo}>Delete!</Text>
                  </TouchableOpacity>
                </View>
            )}
            keyExtractor={(item, index) => index.toString()}
            />
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
    backgroundColor: '#BF9ACA'
  },
  touchOpacityEditInfo: { // styles the text colour and style
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C7E8F3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 1,
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
  preview: {
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
logo: {
  flex:1,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 10,
  width: 300,
  height: 300,
}
});

export default EditReviews;
