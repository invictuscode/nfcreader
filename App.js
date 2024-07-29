import React from 'react';
import { View, StyleSheet } from 'react-native';
import NFCReader from './components/NFCReader';

export default function App() {
  return (
    <View style={styles.container}>
      <NFCReader />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});