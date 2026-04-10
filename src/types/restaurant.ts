export interface Location {
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;        // 1.0 - 5.0
  priceLevel: number;    // 1-4 (1=cheap, 4=expensive)
  location: Location;
  address: string;
  distance?: number;     // meters from user, computed client-side
  types: string[];       // e.g. ['korean', 'restaurant']
  category: Category;
}

export type Category = 'korean' | 'chinese' | 'japanese' | 'western' | 'other';

export interface CategoryInfo {
  id: Category;
  label: string;         // Korean display name
  emoji: string;
}

export type SortMode = 'popularity' | 'distance';
