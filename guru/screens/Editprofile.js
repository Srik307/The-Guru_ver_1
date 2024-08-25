import React, { useState, useEffect } from 'react';

import { View, TextInput, TouchableOpacity, Image, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView 
 ,Button
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDataStore } from '../datastore/data';
import {ip} from "../datastore/data";



const EditProfile = ({ navigation }) => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2OWY0NWJlZjJmYzZiYjllMjNlNWYwZSIsImVtYWlsIjoibXIuc3JpazMwN0BnbWFpbC5jb20iLCJpYXQiOjE3MjI0OTA4MDh9.GF8hDo2qDwyDITNQ28KNG5VmQv_7ycRwOc3fqMBLJs4';
  const {user,setUser}=useDataStore();
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${ip}/api/user/getuser`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + token
          }
        });
        if (!response.ok) {
          console.log(response.statusText);
          throw new Error('Error fetching user data');
        }
        const data = await response.json();
        console.log(data.user);
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      // Save updated user data to the backend
      try {
        const formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('age', user.age);
        formData.append('profession', user.profession);
        formData.append('sex', user.sex);
        if (image) {
          try {
            console.log(user._id);
            
            const filePath = image.uri;
            const file = {
              uri: filePath,
              name: `${user._id}_profile.jpg`,
              type: 'image/jpeg'
            };
            formData.append('profileImage', file);
          } catch (error) {
            console.error('Error reading image file:', error);
            return;
          }
        }

        const response = await fetch(`${ip}/api/user/update`, {
          method: 'POST',
          headers: {
            'authorization': 'Bearer ' + token
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Error updating user data');
        }
        const responseData = await response.json();
        console.log("User data updated successfully:", responseData);
        let photo=responseData.photo;
        console.log(`${ip}/uploads${photo}`);
        setUser({...user,photo:`${photo}`});
      } catch (error) {
        console.log('Error updating user data:', error.message);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5a623' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
      <TouchableOpacity onPress={isEditing?pickImage:()=>{}}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.profileImage} />
        ) : (
          user.photo ? (
            <Image source={{uri:`${ip}/uploads/${user.photo}?t=${new Date().getTime()}`}}style={styles.profileImage} />
          ) : (<View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Pick an Image</Text>
          </View>)
        )}
      </TouchableOpacity>
      {isEditing ? (
        <>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={user.email}
            onChangeText={(text) => handleInputChange('email', text)}
          />
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={user.age}
            onChangeText={(text) => handleInputChange('age', text)}
          />
          <Text style={styles.label}>Profession</Text>
          <TextInput
            style={styles.input}
            value={user.profession}
            onChangeText={(text) => handleInputChange('profession', text)}
          />
          <Text style={styles.label}>Sex</Text>
          <TextInput
            style={styles.input}
            value={user.sex}
            onChangeText={(text) => handleInputChange('sex', text)}
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.bio}>{user.age}</Text>
          <Text style={styles.label}>Profession</Text>
          <Text style={styles.bio}>{user.profession}</Text>
          <Text style={styles.label}>Sex</Text>
          <Text style={styles.bio}>{user.sex}</Text>
        </>
      )}
      <Button title={isEditing ? "Save" : "Edit Profile"} onPress={toggleEditMode} />
    </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 30, // Adjust the padding as needed
  },
  container: {
    backgroundColor: '#f5a623',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default EditProfile;
