export interface Customer {
  id: string;
  name: string;
  phone: string;
  kycStatus: 'Verified' | 'Pending' | 'Rejected';
  activeLoansCount: number;
  totalPledgedWeight: number; // in grams
  totalLoanAmount: number;
  avatar: string;
}

export interface GoldLoan {
  id: string;
  customerName: string;
  customerId: string;
  amount: number;
  interestRate: number; // monthly %
  weight: number; // grams
  purity: '24K' | '22K' | '18K';
  pledgedItem: string;
  dueDate: string;
  status: 'Active' | 'Overdue' | 'Closed';
}

export interface DemoBooking {
  name: string;
  phone: string;
  email: string;
  shopName: string;
  date: string;
  time: string;
}
