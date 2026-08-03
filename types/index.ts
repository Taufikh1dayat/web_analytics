export interface StatCardData {
  id: string;
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  timeFrame: string;
  iconName: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  profit: number;
  expenses: number;
}

export interface UserTrendData {
  date: string;
  activeUsers: number;
  newUsers: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
}

export interface CoffeeMenuProduct {
  id: string;
  name: string;
  category: 'Coffee' | 'Non-Coffee' | 'Pastry' | 'Snack';
  price: number;
  image: string;
  rating: number;
  isBestSeller?: boolean;
  description: string;
  stock: number;
}

export interface CartItem {
  product: CoffeeMenuProduct;
  temperature: 'Hot' | 'Ice';
  sugarLevel: 'Normal (100%)' | 'Less (50%)' | 'No Sugar (0%)';
  quantity: number;
  notes?: string;
  subtotal: number;
}

export interface Transaction {
  id: string;
  customerName: string;
  avatarUrl: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing' | 'Failed';
  date: string;
  category: string;
  items?: {
    name: string;
    quantity: number;
    price: number;
    variant?: string;
  }[];
  paymentMethod?: 'QRIS' | 'Cash' | 'E-Wallet' | 'Credit Card';
}

export interface DateRangeFilterState {
  from?: Date;
  to?: Date;
}
