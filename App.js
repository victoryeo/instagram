import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import * as firebase from 'firebase'
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import MainScreen from './components/Main'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))

var firebaseConfig = {
  apiKey: "AIzaSyBRcV3jJyDK79WycLFXN05-G7EOuU94Rg8",
  authDomain: "instagram-dev-4d6fa.firebaseapp.com",
  projectId: "instagram-dev-4d6fa",
  storageBucket: "instagram-dev-4d6fa.appspot.com",
  messagingSenderId: "1017703141186",
  appId: "1:1017703141186:web:44e5c07621298770d582db",
  measurementId: "G-43F66WB2P5"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const Stack = createStackNavigator()

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      loggedIn: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user)=> {
      if (!user) {
        this.setState({
          loaded: true,
          loggedIn: false
        })
      } else {
        this.setState({
          loaded: true,
          loggedIn: true
        })
      }
    })
  }

  render() {
    const {loaded, loggedIn} = this.state
    if (!loaded) {
      return(
        <View style={{ flex: 1, justifyContent: 'center'}}>
          <Text>Loading...</Text>
        </View>
      )
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown:false}} />
            <Stack.Screen name="Register" component={RegisterScreen}  />

          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
      <Provider store={store}>
        <MainScreen />
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
