import type { Category, Restaurant } from '../types/restaurant';
import { MockDataProvider } from './mockData';

// Field mask for Places API requests -- only request fields we display
// Per API-02: minimize response size and billing cost
export const PLACES_FIELD_MASK = [
  'displayName', 'rating', 'priceLevel', 'location', 'formattedAddress', 'types', 'id'
] as const;

export interface RestaurantProvider {
  searchNearby(lat: number, lng: number, category?: Category, radius?: number): Promise<Restaurant[]>;
}

let mapsLoaded = false;

async function loadGoogleMapsApi(apiKey: string): Promise<void> {
  if (mapsLoaded) return;
  if (document.querySelector('script[src*="maps.googleapis.com"]')) {
    mapsLoaded = true;
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => { mapsLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    document.head.appendChild(script);
  });
}

export class PlacesApiClient implements RestaurantProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchNearby(lat: number, lng: number, _category?: Category, searchRadius?: number): Promise<Restaurant[]> {
    await loadGoogleMapsApi(this.apiKey);

    const { Place } = await google.maps.importLibrary('places') as google.maps.PlacesLibrary;

    const radius = searchRadius ?? 1000;
    const results = await this.doSearch(Place, lat, lng, radius);

    return results;
  }

  private async doSearch(
    Place: typeof google.maps.places.Place,
    lat: number, lng: number, radius: number
  ): Promise<Restaurant[]> {
    const request: google.maps.places.SearchNearbyRequest = {
      fields: ['displayName', 'rating', 'priceLevel', 'location', 'formattedAddress', 'types', 'id'],
      locationRestriction: {
        center: new google.maps.LatLng(lat, lng),
        radius,
      },
      includedPrimaryTypes: ['restaurant'],
      language: 'ko',
    };

    const { places } = await Place.searchNearby(request);
    return (places || []).map(place => this.mapToRestaurant(place, lat, lng)).filter(Boolean) as Restaurant[];
  }

  private mapToRestaurant(place: google.maps.places.Place, userLat: number, userLng: number): Restaurant | null {
    if (!place.displayName || !place.location) return null;

    const placeLocation = place.location as google.maps.LatLng;

    return {
      id: place.id || crypto.randomUUID(),
      name: place.displayName,
      rating: place.rating ?? 0,
      priceLevel: this.mapPriceLevel(place.priceLevel),
      location: {
        lat: placeLocation.lat(),
        lng: placeLocation.lng(),
      },
      address: place.formattedAddress || '',
      distance: this.calculateDistance(userLat, userLng, placeLocation.lat(), placeLocation.lng()),
      types: place.types || [],
      category: this.inferCategory(place.types || []),
    };
  }

  private mapPriceLevel(level: google.maps.places.PriceLevel | null | undefined): number {
    if (level == null) return 2;
    const mapping: Record<string, number> = {
      'FREE': 1,
      'INEXPENSIVE': 1,
      'MODERATE': 2,
      'EXPENSIVE': 3,
      'VERY_EXPENSIVE': 4,
    };
    return mapping[String(level)] ?? 2;
  }

  private inferCategory(types: string[]): Category {
    const typeStr = types.join(',').toLowerCase();
    // Korean — match specific Google Places types
    if (typeStr.includes('korean_restaurant') || typeStr.includes('korean_barbecue')) return 'korean';
    // Chinese
    if (typeStr.includes('chinese_restaurant') || typeStr.includes('hot_pot_restaurant') || typeStr.includes('dim_sum')) return 'chinese';
    // Japanese
    if (typeStr.includes('japanese_restaurant') || typeStr.includes('sushi_restaurant') || typeStr.includes('ramen_restaurant')) return 'japanese';
    // Western
    if (typeStr.includes('italian_restaurant') || typeStr.includes('french_restaurant') || typeStr.includes('american_restaurant') || typeStr.includes('pizza_restaurant') || typeStr.includes('hamburger_restaurant') || typeStr.includes('steak_house') || typeStr.includes('mexican_restaurant') || typeStr.includes('brunch_restaurant') || typeStr.includes('sandwich_shop')) return 'western';
    // Asian other
    if (typeStr.includes('asian_restaurant') || typeStr.includes('thai_restaurant') || typeStr.includes('vietnamese_restaurant') || typeStr.includes('indian_restaurant')) return 'other';
    return 'other';
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }
}

export function getRestaurantProvider(): RestaurantProvider {
  const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
  if (apiKey) {
    return new PlacesApiClient(apiKey);
  }
  return new MockDataProvider();
}
