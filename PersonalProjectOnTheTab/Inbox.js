import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ToastAndroid, Image,SafeAreaView,ScrollView } from 'react-native';


class Inbox extends Component{
  render(){
    return(
        <SafeAreaView style={styles.container}>
          <Text style={styles.text}>Inbox</Text>
        </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    backgroundColor: '#E8E1EF',
    flex: 2,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  text:{
    color: '#9BB291',
    fontSize: 40,
    justifyContent: 'center',
    textAlign: 'center'
  },
  textInput:{
    padding:5,
    borderWidth:1,
    margin:5,
  },
})

export default Inbox;
