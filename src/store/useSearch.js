import { create } from 'zustand';

const useSearch = create((set) => ({
  query: '',
  results: [],
  loading: false,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setLoading: (loading) => set({ loading }),
  search: async (query) => {
    set({ loading: true });
    try {
      const response = await fetch(`http://192.168.29.92:3002/product/admin/prod/search?q=${query}`);
      const data = await response.json();
      set({ results: data.data.products, loading: false });
    } catch (error) {
      console.error('Search error:', error);
      set({ results: [], loading: false });
    }
  },
  clearSearch: () => set({ query: '', results: [], loading: false })
}));

export default useSearch;