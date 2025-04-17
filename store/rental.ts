import { defineStore } from 'pinia';

interface Location {
  name: string;
  address: string;
}

interface DailyRentalDetails {
  type: 'daily';
  startDate: Date | null;
  endDate: Date | null;
  location: Location;
}

interface HourlyRentalDetails {
  type: 'hourly';
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  location: Location;
}

type RentalDetails = DailyRentalDetails | HourlyRentalDetails;

interface RentalState {
  rentalDetails: RentalDetails | null;
}

export const useRentalStore = defineStore('rental', {
  state: (): RentalState => ({
    rentalDetails: null
  }),
  
  actions: {
    setRentalDetails(details: RentalDetails) {
      this.rentalDetails = details;
    },
    
    clearRentalDetails() {
      this.rentalDetails = null;
    }
  },
  
  getters: {
    getRentalType: (state) => state.rentalDetails?.type,
    getLocation: (state) => state.rentalDetails?.location,
    
    getFormattedStartDate: (state) => {
      if (!state.rentalDetails) return '';
      
      const date = state.rentalDetails.type === 'daily' 
        ? state.rentalDetails.startDate 
        : state.rentalDetails.date;
        
      if (!date) return '';
      
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    
    getFormattedEndDate: (state) => {
      if (!state.rentalDetails || state.rentalDetails.type !== 'daily') return '';
      
      const date = state.rentalDetails.endDate;
      if (!date) return '';
      
      return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    },
    
    getFormattedStartTime: (state) => {
      if (!state.rentalDetails || state.rentalDetails.type !== 'hourly' || !state.rentalDetails.startTime) return '';
      
      return state.rentalDetails.startTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    },
    
    getFormattedEndTime: (state) => {
      if (!state.rentalDetails || state.rentalDetails.type !== 'hourly' || !state.rentalDetails.endTime) return '';
      
      return state.rentalDetails.endTime.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    }
  }
});