import { Customer, GoldLoan } from './types';

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "CUST12345",
    name: "Rahul Sharma",
    phone: "+91 98765 43210",
    kycStatus: "Verified",
    activeLoansCount: 1,
    totalPledgedWeight: 48.25,
    totalLoanAmount: 245000,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
  },
  {
    id: "CUST12346",
    name: "Priya Patel",
    phone: "+91 98765 43211",
    kycStatus: "Verified",
    activeLoansCount: 2,
    totalPledgedWeight: 92.50,
    totalLoanAmount: 480000,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop"
  },
  {
    id: "CUST12347",
    name: "Amit Verma",
    phone: "+91 98765 43212",
    kycStatus: "Pending",
    activeLoansCount: 0,
    totalPledgedWeight: 0,
    totalLoanAmount: 0,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop"
  },
  {
    id: "CUST12348",
    name: "Vikram Singh",
    phone: "+91 98765 43213",
    kycStatus: "Verified",
    activeLoansCount: 1,
    totalPledgedWeight: 35.80,
    totalLoanAmount: 175000,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop"
  }
];

export const INITIAL_LOANS: GoldLoan[] = [
  {
    id: "LN9081",
    customerName: "Rahul Sharma",
    customerId: "CUST12345",
    amount: 245000,
    interestRate: 1.0,
    weight: 48.25,
    purity: "22K",
    pledgedItem: "Gold Necklace (22k - 48.250 gm)",
    dueDate: "2026-09-15",
    status: "Active"
  },
  {
    id: "LN9082",
    customerName: "Priya Patel",
    customerId: "CUST12346",
    amount: 300000,
    interestRate: 1.2,
    weight: 58.00,
    purity: "22K",
    pledgedItem: "Gold Bangles (4 pcs - 58.00 gm)",
    dueDate: "2026-10-10",
    status: "Active"
  },
  {
    id: "LN9083",
    customerName: "Priya Patel",
    customerId: "CUST12346",
    amount: 180000,
    interestRate: 1.2,
    weight: 34.50,
    purity: "24K",
    pledgedItem: "Pure Gold Bar (34.50 gm)",
    dueDate: "2026-05-12",
    status: "Overdue"
  },
  {
    id: "LN9084",
    customerName: "Vikram Singh",
    customerId: "CUST12348",
    amount: 175000,
    interestRate: 1.1,
    weight: 35.80,
    purity: "18K",
    pledgedItem: "Gold Chain & Pendant (35.80 gm)",
    dueDate: "2026-11-20",
    status: "Active"
  },
  {
    id: "LN9070",
    customerName: "Rajesh Kumar",
    customerId: "CUST12341",
    amount: 95000,
    interestRate: 1.5,
    weight: 20.00,
    purity: "22K",
    pledgedItem: "Gold Rings (3 pcs)",
    dueDate: "2026-04-10",
    status: "Closed"
  }
];

export const GOLD_RATES = {
  "24K": 7450, // per gram (realistic 2026 INR gold rate)
  "22K": 6830,
  "18K": 5585,
};

export const FAQ_ITEMS = [
  {
    question: "How does the automatic interest calculation work?",
    answer: "SuvarnaLoan ERP automatically calculates monthly simple or compound interest based on custom schemes (fixed, slab-based, or penalty-enhanced). It runs daily cron jobs to flag overdue loans and auto-generates payment reminders."
  },
  {
    question: "Is our jewellery shop data safe and private?",
    answer: "Absolutely. We use end-to-end industry-grade encryption, ISO 27001 compliant cloud databases, and hourly automated encrypted backups. You can also enforce role-based access control (RBAC) so employees can only see required features."
  },
  {
    question: "Can we manage multiple branches from a single account?",
    answer: "Yes! SuvarnaLoan ERP supports multi-branch management. You can track cash flows, gold inventory, vaults, and ledger audits across all branches in real-time from a centralized dashboard."
  },
  {
    question: "What hardware is required for the system?",
    answer: "Our cloud-native platform runs on any device (Desktop, Tablet, or Mobile) via modern web browsers. We also support direct integration with digital weighing scales and thermal bill printers."
  }
];
