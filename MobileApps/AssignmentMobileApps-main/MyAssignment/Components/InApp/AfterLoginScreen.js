

import React, { Component } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class AfterLoginScreen extends Component {

  componentDidMount(){
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount (){
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };


  render(){
    return(
      <View
        style={{
          flex:1,
          flexDirection: 'column',
          jusitfyContent: 'center',
          alignItems: 'center'
        }}>
        <Text> AFTER LOG IN SCREEN </Text>
        </View>
    )
  }
}
export default AfterLoginScreen;
