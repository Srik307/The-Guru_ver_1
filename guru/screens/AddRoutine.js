import { View, Text, TextInput, TouchableOpacity,Button, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewRoutine } from '../controllers/Operations';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';
import { Retrieveit } from '../controllers/LocalStorage';
import {useSchedule,useDataStore} from '../datastore/data';

const initialState = {
  name: '',
  duration: 0,
  slot: '',
  type: '',
  days: [],
  des: '',
  img: { src: '', file: null },
  vi: { fr: 0, src: '', file: null },
  audio: { src: '', file: null },
  streak: 0,
  cate: 'UR',
  startDate: '',
  endDate: ''
};


const reducer = (state, action) => {
  switch (action.type) {
      case 'setSelectedValue':
          return { ...state, name: action.value };
      case 'setSelectedfreq':
          return { ...state, freq: action.value };
      case 'setSelectedEnd':
          return { ...state, streak: action.value.toString() };
      case 'setSelectedDes':
          return { ...state, des: action.value };
      case 'setSelectedDuration':
          return { ...state, duration: action.value };
      case 'setSelectedTimeSlot':
          return { ...state, slot: action.value };
      case 'setdays':
          return { ...state, days: action.value };
      case 'setStartDate':
          return { ...state, startDate: action.value };
      case 'setEndDate':
          return { ...state, endDate: action.value };
      case 'setImageSrc':
          return { ...state, img: { src: action.value.uri, file: action.value.file } };
      case 'setVideoSrc':
          return { ...state, vi: { ...state.vi, src: action.value.uri, file: action.value.file } };
      case 'setAudioSrc':
          return { ...state, audio: { src: action.value.uri, file: action.value.file } };
      default:
          return state;
  }
};

const AddRoutineScreen = () => {

  const {schedule,setSchedule}=useSchedule();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();
  const {user, setUser} = useDataStore();

  const handleInputChange = (type, value) => {
      dispatch({ type: type, value: value });
  };

  const addRoutine = async (category) => {
      try {
          const formData = new FormData();
          formData.append('name', state.name);
          formData.append('duration', state.duration.toString());
          formData.append('slot', state.slot);
          formData.append('freq', state.freq);
          formData.append('days', JSON.stringify(state.days));
          formData.append('des', state.des);
          formData.append('startDate', state.startDate);
          formData.append('endDate', state.endDate);
          formData.append('streak', state.streak.toString());
          formData.append('cate', 'UR');
          console.log(state);
          
          if (state.img.file) {
              formData.append('img', {
                  uri: state.img.src,
                  name: 'image.jpg',
                  type: 'image/jpeg'
              });
          }

          if (state.vi.file) {
              formData.append('vi', {
                  uri: state.vi.src,
                  name: 'video.mp4',
                  type: 'video/mp4'
              });
          }

          if (state.audio.file) {
              formData.append('audio', {
                  uri: state.audio.src,
                  name: 'audio.mp3',
                  type: 'audio/mpeg'
              });
          }
          const token=await Retrieveit('token');
          const {newuser,newschedule} = await createNewRoutine(user, state,formData,token);
          setUser(newuser);
          setSchedule(newschedule);
          alert("Routine Added");
          navigation.navigate('Routines');
      } catch (error) {
          console.error(error);
          alert('Failed to add routine');
      }
  };

  const changeActive = (index) => {
      let newDays;
      if (state.days.includes(index)) {
          newDays = state.days.filter((i) => i !== index);
      } else {
          newDays = [...state.days, index];
      }
      console.log(state);
      
      
      dispatch({ type: 'setdays', value: newDays });
  };

  const selectFile = async (type) => {
      try {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
              return;
          }

          let result;
          if (type === 'photo') {
              result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
              });
          } else if (type === 'video') {
              result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 1,
              });
          } else if (type === 'audio') {
            result = await DocumentPicker.getDocumentAsync({
              type: 'audio/*',
          });
          }

          if (!result.canceled) {
              const source = { uri: result.assets[0].uri, file: result.assets[0] };
              if (type === 'photo') {
                  handleInputChange('setImageSrc', source);
              } else if (type === 'video') {
                  handleInputChange('setVideoSrc', source);
              } else if (type === 'audio') {
                  handleInputChange('setAudioSrc', source);
              }
          }
      } catch (error) {
          console.error('Error selecting file: ', error);
      }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.label}>Routine Name</Text>
       <TextInput
                    style={styles.input}
                    placeholder='Enter Routine Name'
                    onChangeText={(value) => handleInputChange('setSelectedValue', value)}
                />
        <Text style={styles.label}>Description</Text>
        <TextInput
                    style={styles.input}
                    placeholder='Enter description'
                    multiline
                    onChangeText={(value) => handleInputChange('setSelectedDes', value)}
                />
        <Text style={styles.label}>Duration</Text>
        <TextInput
                    style={styles.input}
                    placeholder='Enter Duration'
                    keyboardType='numeric'
                    onChangeText={(value) => handleInputChange('setSelectedDuration', parseInt(value))}
                />
        <Text style={styles.label}>Repeat Count</Text>
        <TextInput
                    style={styles.input}
                    placeholder='Enter Repetition Count'
                    keyboardType='numeric'
                    onChangeText={(value) => handleInputChange('setSelectedfreq', value)}
                />
        <Text style={styles.label}>Time Slot</Text>
        <View style={styles.pickerContainer}>
          <Picker
                    selectedValue={state.slot}
                    style={styles.picker}
                    onValueChange={(itemValue) => handleInputChange('setSelectedTimeSlot', itemValue)}
          >
            <Picker.Item label="Select Time Slot" value="" />
            <Picker.Item label="Morning" value="morning" />
            <Picker.Item label="Afternoon" value="afternoon" />
            <Picker.Item label="Evening" value="evening" />
            <Picker.Item label="Night" value="night" />
          </Picker>
        </View>

        <Text style={styles.label}>Start Date</Text>
        <TextInput
                    style={styles.input}
                    placeholder='Enter Start Date-(YYYY-MM-DD)'
                    onChangeText={(value) => handleInputChange('setStartDate', value)}
                    keyboardType='numeric'
                />
        <Text style={styles.label}>End Date</Text>
        <TextInput
                    style={styles.input}
                    placeholder='Enter End Date-(YYYY-MM-DD)'
                    onChangeText={(value) => handleInputChange('setEndDate', value)}
                    keyboardType='numeric'
                />
        <Text style={styles.label}>Days</Text>
        <View style={styles.daysContainer}>
                          <View style={styles.daysContainer}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayButton,
                                state.days.includes(index) && styles.activeDayButton
                            ]}
                            onPress={() => changeActive(index)}
                        >
                            <Text style={styles.dayButtonText}>{day}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
        </View>

        <Text style={styles.label}>Image</Text>
        <TouchableOpacity style={styles.mediaButton} onPress={() => selectFile('photo')} >
          <Text style={styles.mediaButtonText}>Select Image</Text>
        </TouchableOpacity>
        {state.img.src ? (
                    <Image source={{ uri: state.img.src }} style={{ width: 100, height: 100 }} />
                ) : null}

        <Text style={styles.label}>Video</Text>

        <TouchableOpacity style={styles.mediaButton} onPress={() => selectFile('video')}>
          <Text style={styles.mediaButtonText}>Select Video</Text>
        </TouchableOpacity>
        {state.vi.src ? (
                    <Video
                        source={{ uri: state.vi.src }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        style={{ width: 300, height: 300 }}
                    />
                ) : null}

        <Text style={styles.label}>Audio</Text>
        <TouchableOpacity style={styles.mediaButton} onPress={() => selectFile('audio')}>
          <Text style={styles.mediaButtonText}>Select Audio</Text>
        </TouchableOpacity>
        {state.audio.src ? (
                    <Text style={styles.audioPreview}>{state.audio.src.split('/').pop()}</Text>
                ) : null}

        <TouchableOpacity style={styles.submitButton} onPress={() => addRoutine('cr')} >
          <Text style={styles.submitButtonText}>Add Routine</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9a825',
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15
},
dayButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5
},
activeDayButton: {
    backgroundColor: '#fd8b17',
},
dayButtonText: {
    color: '#000'
},
  media: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  mediaButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  mediaButtonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  mediaText: {
    marginBottom: 10,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddRoutineScreen;
