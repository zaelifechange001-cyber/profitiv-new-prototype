export interface Campaign {
  id: string;
  title: string;
  target: number;
  views: number;
  rewardPool: string;
  status: 'live' | 'completed' | 'paused';
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  type: 'tiv' | 'cash';
}

export interface MarketplaceListing {
  id: string;
  seller: string;
  tiv: number;
  price: number;
  status: 'available' | 'sold';
}

export const generateId = () => {
  return 'id' + Math.random().toString(36).slice(2, 9);
};
