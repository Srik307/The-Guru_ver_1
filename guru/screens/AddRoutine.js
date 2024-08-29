import { View, Text, TextInput, TouchableOpacity, Button, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewRoutine } from '../controllers/Operations';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';
import { Retrieveit } from '../controllers/LocalStorage';
import { useSchedule, useDataStore } from '../datastore/data';
import DateTimePicker from '@react-native-community/datetimepicker';

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

  const { schedule, setSchedule } = useSchedule();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();
  const { user, setUser } = useDataStore();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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
          const token = await Retrieveit('token');
          const { newuser, newschedule } = await createNewRoutine(user, state, formData, token);
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

  const showDatePicker = (type) => {
    if (type === 'start') {
      setShowStartDatePicker(true);
    } else {
      setShowEndDatePicker(true);
    }
  };

  const onChangeDate = (event, selectedDate, type) => {
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);

    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];

      if (type === 'start') {
        handleInputChange('setStartDate', formattedDate);
      } else {
        handleInputChange('setEndDate', formattedDate);
      }
    }
  };

  const showDurationPicker = () => {
    setShowTimePicker(true);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);

    if (selectedTime) {
      const minutes = selectedTime.getMinutes();
      handleInputChange('setSelectedDuration', minutes);
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
        <Text style={styles.label}>Duration (in minutes)</Text>
        <TouchableOpacity style={styles.input} onPress={showDurationPicker}>
          <Text>{state.duration ? `${state.duration} minutes` : 'Select Duration'}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={new Date(0, 0, 0, 0, state.duration)}
            mode="time"
            display="default"
            onChange={onChangeTime}
            minuteInterval={1}
          />
        )}
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
            onValueChange={(value) => handleInputChange('setSelectedTimeSlot', value)}
          >
            <Picker.Item label="Select Time Slot" value="" />
            <Picker.Item label="Morning" value="Morning" />
            <Picker.Item label="Afternoon" value="Afternoon" />
            <Picker.Item label="Evening" value="Evening" />
            <Picker.Item label="Night" value="Night" />
          </Picker>
        </View>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity style={styles.input} onPress={() => showDatePicker('start')}>
          <Text>{state.startDate ? state.startDate : 'Select Start Date'}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => onChangeDate(event, selectedDate, 'start')}
          />
        )}
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity style={styles.input} onPress={() => showDatePicker('end')}>
          <Text>{state.endDate ? state.endDate : 'Select End Date'}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => onChangeDate(event, selectedDate, 'end')}
          />
        )}
        <Text style={styles.label}>Days of the Week</Text>
        <View style={styles.daysContainer}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayButton,
                state.days.includes(index) && styles.dayButtonActive
              ]}
              onPress={() => changeActive(index)}
            >
              <Text>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Upload Image</Text>
        <TouchableOpacity style={styles.fileButton} onPress={() => selectFile('photo')}>
          <Text>{state.img.src ? 'Image Selected' : 'Select Image'}</Text>
        </TouchableOpacity>
        {state.img.src && <Image source={{ uri: state.img.src }} style={styles.imagePreview} />}
        <Text style={styles.label}>Upload Video</Text>
        <TouchableOpacity style={styles.fileButton} onPress={() => selectFile('video')}>
          <Text>{state.vi.src ? 'Video Selected' : 'Select Video'}</Text>
        </TouchableOpacity>
        {state.vi.src && (
          <Video
            source={{ uri: state.vi.src }}
            style={styles.videoPreview}
            useNativeControls
            resizeMode="contain"
          />
        )}
        <Text style={styles.label}>Upload Audio</Text>
        <TouchableOpacity style={styles.fileButton} onPress={() => selectFile('audio')}>
          <Text>{state.audio.src ? 'Audio Selected' : 'Select Audio'}</Text>
        </TouchableOpacity>
        <Button title="Submit" color="orange" onPress={addRoutine} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20
  },
  container: {
    padding: 20
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  dayButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  dayButtonActive: {
    backgroundColor: 'orange',
    borderColor: 'orange'
  },
  fileButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20
  },
  imagePreview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20
  },
  videoPreview: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20
  }
});

export default AddRoutineScreen;
