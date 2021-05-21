import React, { Component } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ToastAndroid, Image,SafeAreaView,ScrollView, TextInput } from 'react-native';


class SearchAndDiscover extends Component{
  render(){
    return(
        <SafeAreaView style={styles.container}>
          <Text style={styles.text}>Find local pubs and bars</Text>
          <TextInput
            placeholder='Find Local Pubs and Bars'
            backgroundColor= 'white'
            style={styles.textInput}
          />
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

export default SearchAndDiscover;
