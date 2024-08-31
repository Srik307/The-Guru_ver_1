import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import { Video } from 'expo-av';
import { Audio as ExpoAudio } from 'expo-av'; // Ensure this import is correct

import { Retrieveit } from '../controllers/LocalStorage';
import AudioComp from '../components/Audio';
import VideoComp from '../components/Video';
import { useSchedule } from '../datastore/data';
import { format } from 'date-fns';
import {ip} from "../datastore/data";
import { addSRoutine } from '../controllers/Operations';
import { useDataStore } from '../datastore/data';

export default function RoutineDetailsScreen({ route, navigation }) {
  const { routinemeta,type,selectedDate} = route.params;
  const { schedules, setSchedule } = useSchedule();
  const [routine, setRoutine] = useState(null);
  const {user,setUser}=useDataStore();
  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        if(type=="SR"){return setRoutine(routinemeta);}
        const routine = await Retrieveit(routinemeta.r_id);
        console.log(routinemeta);
        console.log(routine,"routine");
        setRoutine(routine);
      } catch (error) {
        console.error('Error fetching routine:', error);
      }
    };
    fetchRoutine();
  }, [routinemeta.r_id]);

  const completeRoutine = () => {
    console.log("hi");
    const updatedSchedules = { ...schedules };
    let date = format(new Date(), 'yyyy-MM-dd');
    if (selectedDate==date && updatedSchedules[date]) {
      const routineIndex = updatedSchedules[date].findIndex(r => r.r_id === routinemeta.r_id);
      if (routineIndex !== -1) {
        updatedSchedules[date][routineIndex].completed = true;
        routinemeta.completed = true;
        setSchedule(updatedSchedules);
        alert('Routine completed!');
        console.log(updatedSchedules,"updated");
      }
    }
    else{
      console.log(routinemeta,"routine meta",routine);
      
      alert("You can't perform this now!!!");
    }
  };

  const addSuggestedRoutine = async () => {
    try { 
        const token=await Retrieveit('token');
        const {newuser,newschedule} = await addSRoutine(user,routine,token);
        console.log(newuser,"newUser");
        setUser(newuser);
        setSchedule(newschedule);
        alert("Suggested Routine Added");
        navigation.navigate('Routines');
    } catch (error) {
        console.error(error);
    }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {routine != null && (
        <>
          <Text style={styles.title}>{routine.name}</Text>
          <Text>{routine.des}</Text>
          {routine.img && <Image source={{ uri: `${`${ip}/uploads${routine.img.src}`}?t="020"` || "" }} style={styles.image} />}
          {routine.vi ? (
            <VideoComp rep={routine.vi.fr} source={`${ip}/uploads${routine.vi.src}`} />
          ) : (
            <Text></Text>
          )}
          {routine.au && 
            <AudioComp rep={routine.au.fr} source={`${ip}/uploads${routine.au.src}`}/>
          }
          {type=="SR"?<>
            <Text>Streak:{routine.streak||""} Days</Text>
          </>:
          <>
          <Text>Start:{routine.startDate||""}</Text>
          <Text>End:{routine.endDate||""}</Text></>
          }
        </>
      )}
      {routinemeta.completed!=undefined?(
      <Button  title="Mark as Complete " onPress={completeRoutine} disabled={routine && routinemeta.completed} />
      ):<></>
    }
    {type=="SR"?<Button title="Add to My Routines" onPress={addSuggestedRoutine} />
    :<></>}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});