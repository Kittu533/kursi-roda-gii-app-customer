// import { defineStore } from 'pinia';
// import { persistedState } from './persistedState';

// interface AppState {
//   isOnboarded: boolean;
//   user: {
//     isLoggedIn: boolean;
//     data: any | null;
//   };
// }

// export const useAppStore = defineStore('app', {
//   state: (): AppState => ({
//     isOnboarded: false,
//     user: {
//       isLoggedIn: false,
//       data: null
//     }
//   }),
  
//   actions: {
//     setOnboarded(value: boolean) {
//       this.isOnboarded = value;
//     },
    
//     login(userData: any) {
//       this.user.isLoggedIn = true;
//       this.user.data = userData;
//     },
    
//     logout() {
//       this.user.isLoggedIn = false;
//       this.user.data = null;
//     }
//   },
  
//   persist: {
//     storage: persistedState.localStorage
//   }
// });