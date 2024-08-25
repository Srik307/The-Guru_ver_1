import React, {useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have installed @expo/vector-icons
import { useNavigation } from '@react-navigation/native';
import { useSchedule,useAuthStore, useDataStore} from '../datastore/data';
import { Retrieveit } from '../controllers/LocalStorage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const {schedules,setSchedule}=useSchedule();
  const {user,setuser}=useDataStore();
  const {authenticted,setIsAuthenticated}=useAuthStore();
  const [tasks,setTasks]=useState([]);
  useEffect(() => {
    const LoadSchedule = async () => {
      try {
        const schedule1 = await Retrieveit("@schedule");
        console.log("neeee",schedule1);
        
        if (schedule1 !== null) {
          let date=new Date().toISOString().split('T')[0];
          console.log(schedule1[date]);
          
          setTasks(schedule1[date]||[]);
          setSchedule(schedule1);
        }
      }
      catch (error) {
        console.error('Error loading schedule:', error);
      }
    }
    LoadSchedule();
  }
  , []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={require('../assets/i2.jpeg')}
            style={styles.image}
          />
          
          {/* Profile and other icon */}
          <TouchableOpacity onPress={()=>navigation.navigate("Profile")} style={styles.profileIcon}>
            <Ionicons name="person-circle-outline" size={40} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.otherIcon}             onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={30} color="white" />
          </TouchableOpacity>
          
          {/* Wishing text, username, and quote */}
          <View style={styles.overlayTextContainer}>
            <Text style={styles.wishingText}>Good Morning,</Text>
            <Text style={styles.usernameText}>{user.name}</Text>
            <Text style={styles.quoteText}>“Believe you can and you're halfway there.”</Text>
          </View>
        </View>

        {/* Mood Container */}
        <View style={styles.moodContainer}> 
          <Text style={styles.moodText}>How was Your Day?</Text>
          <View style={styles.moodButtons}>
            {['Amaze!', 'Good', 'Avg', 'Bad', 'Worst'].map((mood, index) => (
              <TouchableOpacity key={index} style={styles.moodButton}>
                <Text>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.checklistTitle}>Activity Checklist</Text>
        {tasks.length==0 && <Text>No tasks for today</Text>}
        {tasks.map((task) => (
          <View key={task.r_id} style={styles.taskContainer}>
            <Text style={styles.taskTitle}>Task {task.r_id}</Text>
            <Text style={styles.taskDescription}>{task.r_name}</Text>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  profileIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  otherIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  overlayTextContainer: {
    position: 'absolute',
    top: '50%',
    alignItems: 'center',
  },
  wishingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  quoteText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  moodContainer: {
    backgroundColor: '#ffda8b',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  moodText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  moodButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  taskContainer: {
    backgroundColor: '#ffda8b',
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  startButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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

export default HomeScreen;
