// store/product.ts
import { defineStore } from "pinia";

// Definisi tipe Product
export interface Product {
  id: string;
  productName: string;
  pricePerDay: number;
  quantity: number;
}

export const useProductsStore = defineStore("products", {
  state: () => ({
    isLoading: false,
    error: null as string | null,
    availableProducts: [] as Product[],
    selectedProducts: [] as Product[],
    selectedDates: {
      startDate: null as string | null,
      endDate: null as string | null,
    },
  }),

  actions: {
    async fetchProductsByDateRange(params: { startDate: string; endDate: string }) {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await fakeFetchAvailableProducts(params.startDate, params.endDate);

        this.availableProducts = response.products;
      } catch (err: any) {
        this.error = err.message || "Gagal memuat produk";
      } finally {
        this.isLoading = false;
      }
    },

    incrementQuantity(productId: string) {
      const product = this.availableProducts.find(p => p.id === productId);
      if (product) {
        product.quantity++;
      }
    },

    decrementQuantity(productId: string) {
      const product = this.availableProducts.find(p => p.id === productId);
      if (product && product.quantity > 0) {
        product.quantity--;
      }
    },

    setStartDate(date: string | null) {
      this.selectedDates.startDate = date;
    },

    setEndDate(date: string | null) {
      this.selectedDates.endDate = date;
    },
  },

  getters: {
    // Produk yang dipilih berdasarkan quantity > 0
    selectedProducts(state): Product[] {
      return state.availableProducts.filter(p => p.quantity > 0);
    },
  },
});

// Simulasi fetch API produk
async function fakeFetchAvailableProducts(startDate: string, endDate: string) {
  return new Promise<{ products: Product[] }>((resolve) => {
    setTimeout(() => {
      resolve({
        products: [
          { id: "1", productName: "Kursi Roda", pricePerDay: 50000, quantity: 0 },
          { id: "2", productName: "Walker", pricePerDay: 30000, quantity: 0 },
          { id: "3", productName: "Tongkat", pricePerDay: 20000, quantity: 0 },
        ],
      });
    }, 1500); // Simulasi loading 1.5 detik
  });
}
