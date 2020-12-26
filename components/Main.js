import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class Main extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  render() {
    return(
      <View style={{ flex: 1, justifyContent: 'center'}}>
        <Text>User logged in ...</Text>
      </View>
    )
  }
}
