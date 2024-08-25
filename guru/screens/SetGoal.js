import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SetGoal = ({ navigation }) => {  // Receive navigation as a prop
  const [selectedOptions, setSelectedOptions] = useState([false, false, false]);

  const handleOptionPress = (index) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = !newSelectedOptions[index];
    setSelectedOptions(newSelectedOptions);

    // Navigate to the Editprofile screen
    navigation.navigate('Editprofile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>1. Add the question</Text>
      {selectedOptions.map((isSelected, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.option, isSelected && styles.optionSelected]}
          onPress={() => handleOptionPress(index)}
        />
      ))}
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => navigation.navigate('Editprofile')} // Navigate when the button is pressed
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFBF5C',
    padding: 20,
    justifyContent: 'center',
  },
  question: {
    fontSize: 16,
    marginBottom: 20,
  },
  option: {
    height: 50,
    backgroundColor: '#FF914D',
    borderRadius: 10,
    marginBottom: 20,
  },
  optionSelected: {
    backgroundColor: '#4CAF50',
  },
  nextButton: {
    height: 50,
    backgroundColor: '#FF914D',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: 100,
    alignSelf: 'flex-end',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SetGoal;
