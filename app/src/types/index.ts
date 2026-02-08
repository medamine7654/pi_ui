// Types for RentAdmin Dashboard

export type UserRole = 'admin' | 'host' | 'guest';
export type UserStatus = 'active' | 'suspended' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  joinedAt: string;
  lastActive: string;
  reportsCount: number;
  bookingsCount: number;
  listingsCount: number;
  cancellationRate: number;
  riskScore: number;
}

export type ServiceStatus = 'approved' | 'pending' | 'hidden' | 'suspended';

export interface Service {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  status: ServiceStatus;
  price: number;
  category: string;
  location: string;
  createdAt: string;
  bookingsCount: number;
  rating: number;
  reportsCount: number;
  images: string[];
}

export type ToolStatus = 'available' | 'rented' | 'maintenance' | 'hidden' | 'suspended';

export interface Tool {
  id: string;
  name: string;
  description: string;
  hostId: string;
  hostName: string;
  status: ToolStatus;
  pricePerDay: number;
  stock: number;
  category: string;
  location: string;
  createdAt: string;
  rentalsCount: number;
  reportsCount: number;
  images: string[];
}

export type BookingStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  type: 'service' | 'tool';
  itemId: string;
  itemName: string;
  guestId: string;
  guestName: string;
  hostId: string;
  hostName: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  totalAmount: number;
  createdAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export type ReportReason = 'inappropriate_content' | 'fraud' | 'spam' | 'misrepresentation' | 'safety_concern' | 'other';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export interface Report {
  id: string;
  targetType: 'user' | 'service' | 'tool';
  targetId: string;
  targetName: string;
  reporterId: string;
  reporterName: string;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface FraudAlert {
  id: string;
  type: 'cancellation_spike' | 'negative_reviews' | 'listing_spam' | 'suspicious_activity';
  userId: string;
  userName: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  isRead: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalHosts: number;
  totalGuests: number;
  totalServices: number;
  totalTools: number;
  totalBookings: number;
  totalToolRentals: number;
  pendingReports: number;
  flaggedAccounts: number;
  monthlyRevenue: number;
  cancellationRate: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface Activity {
  id: string;
  type: 'user_registered' | 'booking_created' | 'booking_cancelled' | 'report_submitted' | 'service_created' | 'tool_created' | 'user_suspended';
  description: string;
  userId?: string;
  userName?: string;
  timestamp: string;
}
