import { defineStore } from 'pinia';
import type { Agent, Package } from '~/types';

export type TransactionType = 'package' | 'custom';

export interface Transaction {
  id: string;
  productName: string;
  wheelchairId: string;
  agentName: string;
  startDate: string;
  endDate: string;
  period: string;
  price: string;
  status: 'pending' | 'ongoing' | 'completed' | 'returned';
  hasGuide: boolean;
  addon: string;
  deliveryLocation: string;
}

interface TransactionState {
  // Booking progress
  type: TransactionType | null;
  selectedPackage: Package | null;
  selectedAgent: Agent | null;
  customOptions: {
    duration: number;
    withGuide: boolean;
    startDate: string | null;
    startTime: string | null;
  };

  // List of real transactions
  transactions: Transaction[];
}

export const useTransactionStore = defineStore('transaction', {
  state: (): TransactionState => ({
    // Booking part
    type: null,
    selectedPackage: null,
    selectedAgent: null,
    customOptions: {
      duration: 1,
      withGuide: false,
      startDate: null,
      startTime: null,
    },

    // Transaction part
    transactions: []
  }),

  getters: {
    // Booking status
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
        const basePrice = 130000;
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
    },

    // Transaction data
    getTransactionById: (state) => {
      return (id: string) => state.transactions.find(t => t.id === id);
    },

    getOngoingTransactions: (state) => {
      return state.transactions.filter(t => t.status === 'pending' || t.status === 'ongoing');
    },

    getHistoryTransactions: (state) => {
      return state.transactions.filter(t => t.status === 'completed' || t.status === 'returned');
    },
    
  },

  actions: {
    // Booking Actions
    selectPackage(packageItem: Package) {
      this.type = 'package';
      this.selectedPackage = packageItem;
      this.customOptions = {
        duration: 1,
        withGuide: false,
        startDate: null,
        startTime: null,
      };
    },

    selectAgent(agent: Agent) {
      this.selectedAgent = agent;
      if (!this.selectedPackage) {
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
        startTime: null,
      };
    },

    // Transaction Actions
    async fetchTransactions() {
      // Simulate fetch from API
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Simulated dummy data
            this.transactions = [
            {
              id: 'T0001',
              productName: 'Kursi Roda Breezy BasiX²',
              wheelchairId: 'KR001',
              agentName: 'Agen A',
              startDate: '19 Februari 2025',
              endDate: '21 Februari 2025',
              period: '19 Feb - 21 Feb',
              price: 'Rp 100.000',
              status: 'ongoing',
              hasGuide: true,
              addon: 'Add On: Guide',
              deliveryLocation: 'Hotel Makkah Amanah'
            },
            {
              id: 'T0002',
              productName: 'Kursi Roda Breezy Home',
              wheelchairId: 'KR002',
              agentName: 'Agen B',
              startDate: '20 Februari 2025',
              endDate: '23 Februari 2025',
              period: '20 Feb - 23 Feb',
              price: 'Rp 150.000',
              status: 'pending',
              hasGuide: false,
              addon: '',
              deliveryLocation: 'Hotel Sofyan Makkah'
            },
            {
              id: 'T0003',
              productName: 'Kursi Roda Premium Plus',
              wheelchairId: 'KR003',
              agentName: 'Agen C',
              startDate: '22 Februari 2025',
              endDate: '24 Februari 2025',
              period: '22 Feb - 24 Feb',
              price: 'Rp 200.000',
              status: 'completed',
              hasGuide: true,
              addon: 'Add On: Guide',
              deliveryLocation: 'Hotel Le Meridien'
            },
            {
              id: 'T0004',
              productName: 'Kursi Roda Standard',
              wheelchairId: 'KR004',
              agentName: 'Agen A',
              startDate: '25 Februari 2025',
              endDate: '26 Februari 2025',
              period: '25 Feb - 26 Feb',
              price: 'Rp 80.000',
              status: 'returned',
              hasGuide: false,
              addon: '',
              deliveryLocation: 'Hotel Grand Makkah'
            },
            {
              id: 'T0005',
              productName: 'Kursi Roda Deluxe',
              wheelchairId: 'KR005',
              agentName: 'Agen D',
              startDate: '1 Maret 2025',
              endDate: '3 Maret 2025',
              period: '1 Mar - 3 Mar',
              price: 'Rp 175.000',
              status: 'ongoing',
              hasGuide: true,
              addon: 'Add On: Guide',
              deliveryLocation: 'Hotel Pullman Makkah'
            },
            {
              id: 'T0006',
              productName: 'Kursi Roda Deluxe',
              wheelchairId: 'KR005',
              agentName: 'Agen D',
              startDate: '1 Maret 2025',
              endDate: '3 Maret 2025',
              period: '1 Mar - 3 Mar',
              price: 'Rp 175.000',
              status: 'ongoing',
              hasGuide: true,
              addon: 'Add On: Guide',
              deliveryLocation: 'Hotel Pullman Makkah'
            },
            {
              id: 'T0007',
              productName: 'Kursi Roda Deluxe',
              wheelchairId: 'KR005',
              agentName: 'Agen D',
              startDate: '1 Maret 2025',
              endDate: '3 Maret 2025',
              period: '1 Mar - 3 Mar',
              price: 'Rp 175.000',
              status: 'ongoing',
              hasGuide: true,
              addon: 'Add On: Guide',
              deliveryLocation: 'Hotel Pullman Makkah'
            }
            
            ];
          resolve();
        }, 800);
      });
    },

    async confirmWheelchairPickup(id: string) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const transaction = this.transactions.find(t => t.id === id);
          if (transaction) {
            transaction.status = 'ongoing';
          }
          resolve();
        }, 500);
      });
    },

    async completeTransaction(id: string) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const transaction = this.transactions.find(t => t.id === id);
          if (transaction) {
            transaction.status = 'completed';
          }
          resolve();
        }, 500);
      });
    },

    async cancelTransaction(id: string) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.transactions = this.transactions.filter(t => t.id !== id);
          resolve();
        }, 500);
      });
    }
  },

  persist: true
});
