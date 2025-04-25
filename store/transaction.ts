import { defineStore } from 'pinia';
import type { Agent, Package } from '~/types';

export type TransactionType = 'package' | 'custom';

interface TransactionState {
  type: TransactionType | null;
  selectedPackage: Package | null;
  selectedAgent: Agent | null;
  customOptions: {
    duration: number;
    withGuide: boolean;
    startDate: string | null;
    startTime: string | null;
  };
}

export const useTransactionStore = defineStore('transaction', {
  state: (): TransactionState => ({
    type: null,
    selectedPackage: null,
    selectedAgent: null,
    customOptions: {
      duration: 1, // default 1 day
      withGuide: false,
      startDate: null,
      startTime: null
    }
  }),
  
  actions: {
    selectPackage(packageItem: Package) {
      this.type = 'package';
      this.selectedPackage = packageItem;
      // Reset custom options when selecting a package
      this.customOptions = {
        duration: 1,
        withGuide: false,
        startDate: null,
        startTime: null
      };
    },
    
    selectAgent(agent: Agent) {
      this.selectedAgent = agent;
      if (!this.selectedPackage) {
        // If no package is selected, this is a custom booking
        this.type = 'custom';
      }
    },
    
    updateCustomOptions(options: Partial<TransactionState['customOptions']>) {
      this.customOptions = {
        ...this.customOptions,
        ...options
      };
    },
    
    resetTransaction() {
      this.type = null;
      this.selectedPackage = null;
      this.selectedAgent = null;
      this.customOptions = {
        duration: 1,
        withGuide: false,
        startDate: null,
        startTime: null
      };
    }
  },
  
  getters: {
    isPackageBooking: (state) => state.type === 'package',
    isCustomBooking: (state) => state.type === 'custom',
    hasSelectedAgent: (state) => state.selectedAgent !== null,
    transactionSummary: (state) => {
      if (state.type === 'package' && state.selectedPackage) {
        return {
          title: state.selectedPackage.name,
          price: state.selectedPackage.discountedPrice,
          originalPrice: state.selectedPackage.originalPrice,
          timeRange: state.selectedPackage.timeRange,
          agentName: state.selectedAgent?.name || 'Belum dipilih'
        };
      } else if (state.type === 'custom') {
        // Calculate custom price based on duration and options
        const basePrice = 130000; // Base price per day
        const guidePrice = state.customOptions.withGuide ? 50000 : 0;
        const totalPrice = basePrice * state.customOptions.duration + guidePrice;
        
        return {
          title: 'Sewa Kursi Roda Custom',
          price: totalPrice,
          originalPrice: null,
          duration: `${state.customOptions.duration} hari`,
          withGuide: state.customOptions.withGuide,
          startDate: state.customOptions.startDate,
          startTime: state.customOptions.startTime,
          agentName: state.selectedAgent?.name || 'Belum dipilih'
        };
      }
      
      return null;
    }
  },
  
  persist: true // Persist the store to localStorage
});