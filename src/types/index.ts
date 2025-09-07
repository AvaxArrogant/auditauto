export interface Vehicle {
  id: number;
  image: string;
  title: string;
  category: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  features: string[];
  owner: string;
  description: string;
  year: number;
  make: string;
  model: string;
  transmission: string;
  fuel: string;
  seats: number;
  doors: number;
  available: boolean;
  ownerId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isHost: boolean;
  joinDate: string;
  rating: number;
  reviewCount: number;
}

export interface Booking {
  id: number;
  vehicleId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  pickupLocation: string;
  returnLocation: string;
}

export interface SearchFilters {
  location: string;
  pickupDate: string;
  returnDate: string;
  vehicleType: string;
  priceRange: [number, number];
  transmission: string;
  fuel: string;
  seats: string;
}

export interface DVLADriverInfo {
  drivingLicenceNumber: string;
  firstNames: string;
  lastName: string;
  dateOfBirth: string;
  licenseStatus: string;
  licenseType: string;
  validUntil: string;
  penaltyPoints: number;
  hasValidCarLicense: boolean;
}
export interface DVLAVehicleInfo {
  registrationNumber: string;
  make: string;
  model?: string;
  yearOfManufacture: number;
  fuelType: string;
  colour: string;
  engineCapacity?: number;
  co2Emissions?: number;
  taxStatus: string;
  taxDueDate?: string;
  motStatus: string;
  motExpiryDate?: string;
  euroStatus?: string;
  markedForExport: boolean;
}

export interface CAPHPIVehicleReport {
  vehicle: {
    vehicleId: string;
    registration: string;
    make: string;
    model: string;
    year: number;
    fuelType: string;
    transmission: string;
    engineSize: number;
  };
  valuation?: {
    retailValue: number;
    tradeValue: number;
    partExchangeValue: number;
    currency: string;
  };
  insurance?: {
    group: string;
    securityRating: string;
    theftRating: number;
  };
  history?: {
    stolen: 'clear' | 'alert' | 'unknown';
    writeOff: 'clear' | 'alert' | 'unknown';
    finance: 'clear' | 'outstanding' | 'unknown';
    previousKeepers: number;
  };
}