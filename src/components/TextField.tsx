import React from 'react';
import {View, TextInput, StyleSheet, TextInputProps} from 'react-native';

export const TextField = (props: TextInputProps) => {
  return (
    <View style={styles.borderedView}>
      <TextInput style={styles.input} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  borderedView: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 5,
  },
  input: {
    width: '100%',
  },
});

export default TextField;
