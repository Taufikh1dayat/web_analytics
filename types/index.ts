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

export interface Transaction {
  id: string;
  customerName: string;
  customerEmail: string;
  avatarUrl: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing' | 'Failed';
  date: string;
  category: string;
}

export interface DateRangeFilterState {
  from?: Date;
  to?: Date;
}
