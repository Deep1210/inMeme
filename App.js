/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import Navigator from './app/routes';

class App extends Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Navigator/>
      </View>
    )
  }
}


export default App;
