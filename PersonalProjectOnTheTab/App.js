import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons'
import plus from './Components/Images/plus.png'

import Home from './Components/Screens/home'
import SearchAndDiscover from './Components/Screens/SearchAndDiscover'
import AddReviews from './Components/Screens/AddReviews'
import Settings from './Components/Screens/Settings'
import Inbox from './Components/Screens/Inbox'

/***
App colours
Lavender Web = #E8E1EF
Light Cyan = #D9FFF8
Aero Blue = #C7FFDA
Tea Green = #C4F4C7
laurel green = #9BB291
https://fontawesome.com/icons?d=gallery&p=2&q=home
***/
const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBarOptions={{ // All options for the bar orginally hides the bar 
        showLabel: false,
        style: { 
          backgroundColor: '#C4F4C7', // colour of the bar
          position: 'absolute', // position of the bar
          bottom: 35,
          marginHorizontal: 20,
          // Max height
          height: 60,
          borderRadius: 10,
          // shadow
          shadownColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: {
            width: 10,
            height: 10
          },
          paddingHorizontal: 20
        }
      }}>
        <Tab.Screen name ={'Home'} component={Home} options={{
          tabBarIcon: ({ focused }) => (
            <View style ={{
              // centering the icons 
              position: 'absolute',
              top: '50%'
            }}>
              <FontAwesome5 // using the font awsome tab
                name= "home"
                size= {20}
                color={focused ? 'red' : 'grey'}
              ></FontAwesome5>
            </View>
          )
        }} />
        <Tab.Screen name ='SearchAndDiscover' component={SearchAndDiscover} options={{
          tabBarIcon: ({ focused }) => (
            <View style ={{
              // centering the icons
              position: 'absolute',
              top: '50%'
            }}>
              <FontAwesome5 // using the font awsome tab
                name= "search-location"
                size= {20}
                color={focused ? 'red' : 'grey'}
              ></FontAwesome5>
            </View>
          )
        }} />
        <Tab.Screen name ='AddReviews' component={AddReviews} options={{
        tabBarIcon: ({ focused }) => (
          <View style ={{
            // centering the icons
            position: 'absolute',
            top: '50%'
          }}>
            <FontAwesome5 // using the font awsome tab
              name= "plus-square"
              size= {20}
              color={focused ? 'red' : 'grey'}
            ></FontAwesome5>
          </View>
        )
        }}/>
        <Tab.Screen name ='Inbox' component={Inbox} options={{
          tabBarIcon: ({ focused }) => (
            <View style ={{
              // centering the icons 
              position: 'absolute',
              top: '50%'
            }}>
              <FontAwesome5 // using the font awsome tab
                name= "inbox"
                size= {20}
                color={focused ? 'red' : 'grey'}
              ></FontAwesome5>
            </View>
          )
        }} />

        <Tab.Screen name ='Settings' component={Settings} options={{
          tabBarIcon: ({ focused }) => (
            <View style ={{
              // centering the icons 
              position: 'absolute',
              top: '50%'
            }}>
              <FontAwesome5 // using the font awsome tab
                name= "user-cog"
                size= {20}
                color={focused ? 'red' : 'grey'}
              ></FontAwesome5>
            </View>
          )
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}



/***
 * Adding an image
 <TouchableOpacity>
            <View style={{
              width: 55,
              height: 55,
              backgroundColor: 'red',
              borderRadius: '50%',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 30
            }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('AddReviews')}>
                <Image source={plus} style={{
                width: 22,
                height: 22,
                tintColor: 'white' 
                }}></Image>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

**/
