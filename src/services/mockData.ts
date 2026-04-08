import type { Category, Restaurant } from '../types/restaurant';

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'mock-1',
    name: '\uae40\uce58\ucc0c\uac1c\uc9d1',
    rating: 4.3,
    priceLevel: 1,
    location: { lat: 37.4985, lng: 127.0272 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \uac15\ub0a8\ub300\ub85c 328',
    types: ['korean', 'restaurant'],
    category: 'korean',
  },
  {
    id: 'mock-2',
    name: '\ud55c\uc19f\ub3c4\uc2dc\ub77d',
    rating: 3.8,
    priceLevel: 1,
    location: { lat: 37.4975, lng: 127.0280 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \uc5ed\uc0bc\ub85c 180',
    types: ['korean', 'restaurant'],
    category: 'korean',
  },
  {
    id: 'mock-3',
    name: '\ubcf8\uc8fd',
    rating: 4.0,
    priceLevel: 2,
    location: { lat: 37.4982, lng: 127.0265 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \ud14c\ud5e4\ub780\ub85c 112',
    types: ['korean', 'restaurant'],
    category: 'korean',
  },
  {
    id: 'mock-4',
    name: '\ud64d\ucf69\ubc18\uc810',
    rating: 4.1,
    priceLevel: 2,
    location: { lat: 37.4990, lng: 127.0290 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \uac15\ub0a8\ub300\ub85c 340',
    types: ['chinese', 'restaurant'],
    category: 'chinese',
  },
  {
    id: 'mock-5',
    name: '\uc591\uc790\uac15',
    rating: 4.5,
    priceLevel: 3,
    location: { lat: 37.4970, lng: 127.0260 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \uc5ed\uc0bc\ub85c 166',
    types: ['chinese', 'restaurant'],
    category: 'chinese',
  },
  {
    id: 'mock-6',
    name: '\uc2a4\uc2dc\ub85c',
    rating: 4.2,
    priceLevel: 2,
    location: { lat: 37.4988, lng: 127.0275 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \uac15\ub0a8\ub300\ub85c 358',
    types: ['japanese', 'restaurant'],
    category: 'japanese',
  },
  {
    id: 'mock-7',
    name: '\uc774\ucc0c\ubc29\ub77c\uba58',
    rating: 4.4,
    priceLevel: 2,
    location: { lat: 37.4972, lng: 127.0285 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \ud14c\ud5e4\ub780\ub85c 130',
    types: ['japanese', 'restaurant'],
    category: 'japanese',
  },
  {
    id: 'mock-8',
    name: '\ub9d8\uc2a4\ud130\uce58',
    rating: 3.9,
    priceLevel: 1,
    location: { lat: 37.4978, lng: 127.0268 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \uac15\ub0a8\ub300\ub85c 310',
    types: ['western', 'restaurant'],
    category: 'western',
  },
  {
    id: 'mock-9',
    name: '\ube55\uc2a4',
    rating: 4.0,
    priceLevel: 3,
    location: { lat: 37.4995, lng: 127.0295 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \uc5ed\uc0bc\ub85c 200',
    types: ['western', 'restaurant'],
    category: 'western',
  },
  {
    id: 'mock-10',
    name: '\uc368\ube0c\uc6e8\uc774',
    rating: 3.7,
    priceLevel: 2,
    location: { lat: 37.4980, lng: 127.0278 },
    address: '\uc11c\uc6b8\ud2b9\ubcc4\uc2dc \uac15\ub0a8\uad6c \ud14c\ud5e4\ub780\ub85c 118',
    types: ['sandwich', 'restaurant'],
    category: 'other',
  },
];

export class MockDataProvider {
  async searchNearby(
    _lat: number,
    _lng: number,
    category?: Category
  ): Promise<Restaurant[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    if (category) {
      return MOCK_RESTAURANTS.filter(r => r.category === category);
    }
    return [...MOCK_RESTAURANTS];
  }
}
