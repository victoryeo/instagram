import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser } from '../redux/actions/index'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Tab = createBottomTabNavigator()

const EmptyScreen = () => {
  return(
    <View></View>
  )
}

export class Main extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchUser()
  }

  render() {
    const { currentUser } = this.props
    console.log(currentUser)
    if (currentUser == undefined) {
      return(
        <View></View>
      )
    }
    return(
      <Tab.Navigator initialRouteName="Feed">
        <Tab.Screen name="Feed" component={FeedScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={26}/>
          )
        }} />
        <Tab.Screen name="AddContainer" component={EmptyScreen}
          listeners={({ navigation}) => ({
            tabPress: event => {
              event.preventDefault()
              navigation.navigate("Add")
            }
          })}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
            )
          }}
        />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
          )
        }} />
      </Tab.Navigator>
    )
  }
}

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
