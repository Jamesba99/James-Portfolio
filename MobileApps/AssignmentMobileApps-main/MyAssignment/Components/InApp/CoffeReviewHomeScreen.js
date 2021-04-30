import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

class HomeScreen extends Component{

  render(){
   /**
   if the user clicks the navigation button it will stack the appropriate screen
   **/
    const navigation = this.props.navigation; // declaring the navigation constant

    return(
        <View style={styles.container}>
          <Text style={styles.text}>CoffeeRewviewHomePage</Text>
          <Text/>
          <Button
            title="Register"
            onPress={() =>navigation.navigate('Register')} // opens the about screen if clicked
          />
          <Text/>
          <Button
            title="Login"
            onPress={() =>navigation.navigate('Login')} // opens the stack contact screen
          />
        </View>
    );
  }
}
const styles = StyleSheet.create({ // styles the text on the screen
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'brown'
  },
  text: { // styles the text colour and style
    color: 'white',
    fontSize: 25
  }
});

export default HomeScreen;
