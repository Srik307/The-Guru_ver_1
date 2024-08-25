import React, { useState, useEffect, startTransition } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have installed @expo/vector-icons
import { Retrieveit } from '../controllers/LocalStorage';
import { useSchedule } from '../datastore/data';
import IonIcons from 'react-native-vector-icons/Ionicons';

const TaskManager = ({navigation}) => {
  const {schedules,setSchedule}=useSchedule();
  const [routinesForDate,setRoutineForDate]=useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleDateSelect = (day) => {
    console.log('Selected Date:', day.dateString); // Debugging
    console.log(schedules);
    setSelectedDate(day.dateString);
    setRoutineForDate(schedules[day.dateString]);
    console.log('Routines for Selected Date:', routinesForDate); // Debugging
  };


  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('RoutineDetails', { routinemeta:item,type:item.cate,selectedDate:selectedDate})}>
    <View style={styles.taskContainer}>
      <Text style={styles.itemText}>{item.r_name}</Text>
      <IonIcons
          name={item.completed?"checkmark-circle":"ellipse-outline"}
          size={24}
          color={item.completed?"green":"blue"} /></View>
    </TouchableOpacity>
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Calendar
        onDayPress={handleDateSelect}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: 'orange' },
        }}
        />
        <FlatList
          data={routinesForDate}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.taskList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  taskContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  startButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  taskList: {
    marginTop: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#555',
    marginTop: 5,
  },
});

export default TaskManager;
