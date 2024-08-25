import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function SignupPage({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Ensure the image format is correct */}
      <Image 
        source={require('../assets/i1.png')}  // Ensure this file is a PNG or the correct format
        style={styles.image} 
      />
      <Text style={styles.headerText}>New To Application</Text>
      <Text style={styles.signupText}>Signup Here</Text>
      
      <TextInput 
        placeholder="Enter Email"
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput 
        placeholder="Enter password"
        secureTextEntry
        style={styles.input}
      />
      <TextInput 
        placeholder="Confirm password"
        secureTextEntry
        style={styles.input}
      />
      
      <TouchableOpacity 
        style={styles.signupButton}
        onPress={() => navigation.navigate('Welcome')}  // Correct navigation call
      >
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>or</Text>
      
      <TouchableOpacity>
        <Text style={styles.alreadyHaveAccountText}>
          If you already have an account Click here to <Text style={styles.signupLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8b449',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  signupText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  signupButton: {
    backgroundColor: '#ff8400',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    color: '#333',
    marginBottom: 20,
  },
  alreadyHaveAccountText: {
    color: '#333',
  },
  signupLink: {
    color: '#ff8400',
    fontWeight: 'bold',
  },
});
