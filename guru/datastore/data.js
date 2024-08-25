import {create} from 'zustand';
import { Storeit } from '../controllers/LocalStorage';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (authState) => set({ isAuthenticated: authState }),
}));

export const ip='192.168.190.220';

export const useDataStore=create((set)=>({
    token:"",
    user:{
        name: '',
        email: '',
        age: '',
        profession: '',
        sex: '',
        routines:['1','2','3']
      },
    setUser: (userData) => set({ user: userData }),
    setToken:(token)=>set({token:token})
}));


export const useSchedule=create((set)=>({
    schedules:{},
    setSchedule: (schedule) => {set({ schedules: schedule });
       Storeit("@schedule",schedule);},
}));
