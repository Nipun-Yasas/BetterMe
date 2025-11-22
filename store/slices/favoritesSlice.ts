import { ItemData } from '@/components/ui/item-card';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  items: ItemData[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<ItemData>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex >= 0) {
        // Remove if already exists
        state.items.splice(existingIndex, 1);
      } else {
        // Add if doesn't exist
        state.items.push(action.payload);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
