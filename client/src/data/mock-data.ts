// Car data types
export interface Car {
  id: string;
  model: string;
  year: number;
  status: "online" | "offline" | "maintenance";
  battery: number;
  range: number;
  charging: boolean;
  temperature: number;
  outsideTemp: number;
  targetTemp: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  image: string;
  subscription: {
    plan: "basic" | "premium" | "ultimate";
    status: "active" | "expired" | "pending";
    nextBillingDate: string;
    price: string;
  };
}

// Device data types
export interface Device {
  id: string;
  carId: string;
  name: string;
  type: string;
  status: "online" | "offline" | "standby";
  location: string;
  lastActive: string;
}

// Alert data types
export interface Alert {
  id: string;
  carId: string;
  type: string;
  severity: "high" | "medium" | "low";
  message: string;
  details: string;
  timestamp: string;
  read: boolean;
}

// Mock car data
export const mockCars: Car[] = [
  {
    id: "car-001",
    model: "Tesla Model S",
    year: 2023,
    status: "online",
    battery: 65,
    range: 210,
    charging: false,
    temperature: 72,
    outsideTemp: 68,
    targetTemp: 72,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      address: "123 Main St, San Francisco, CA"
    },
    image: "https://img.heroui.chat/image/car?w=200&h=200&u=1",
    subscription: {
      plan: "premium",
      status: "active",
      nextBillingDate: "2024-07-15",
      price: "$19.99"
    }
  },
  {
    id: "car-002",
    model: "BMW i4",
    year: 2022,
    status: "offline",
    battery: 32,
    range: 120,
    charging: true,
    temperature: 70,
    outsideTemp: 65,
    targetTemp: 70,
    location: {
      latitude: 37.7833,
      longitude: -122.4167,
      address: "456 Market St, San Francisco, CA"
    },
    image: "https://img.heroui.chat/image/car?w=200&h=200&u=2",
    subscription: {
      plan: "basic",
      status: "active",
      nextBillingDate: "2024-06-28",
      price: "$9.99"
    }
  },
  {
    id: "car-003",
    model: "Rivian R1T",
    year: 2023,
    status: "online",
    battery: 78,
    range: 280,
    charging: false,
    temperature: 74,
    outsideTemp: 72,
    targetTemp: 74,
    location: {
      latitude: 37.7937,
      longitude: -122.3965,
      address: "789 Battery St, San Francisco, CA"
    },
    image: "https://img.heroui.chat/image/car?w=200&h=200&u=3",
    subscription: {
      plan: "ultimate",
      status: "active",
      nextBillingDate: "2024-07-05",
      price: "$29.99"
    }
  }
];

// Mock device data
export const mockDevices: Device[] = [
  {
    id: "dev-001",
    carId: "car-001",
    name: "Front Camera",
    type: "Camera",
    status: "online",
    location: "Front Bumper",
    lastActive: "2024-06-15T10:30:00Z"
  },
  {
    id: "dev-002",
    carId: "car-001",
    name: "Rear Camera",
    type: "Camera",
    status: "online",
    location: "Rear Bumper",
    lastActive: "2024-06-15T10:28:00Z"
  },
  {
    id: "dev-003",
    carId: "car-001",
    name: "Cabin Microphone",
    type: "Audio",
    status: "online",
    location: "Dashboard",
    lastActive: "2024-06-15T10:25:00Z"
  },
  {
    id: "dev-004",
    carId: "car-001",
    name: "GPS Tracker",
    type: "GPS",
    status: "online",
    location: "Under Hood",
    lastActive: "2024-06-15T10:31:00Z"
  },
  {
    id: "dev-005",
    carId: "car-001",
    name: "Motion Sensor",
    type: "Sensor",
    status: "standby",
    location: "Interior",
    lastActive: "2024-06-15T09:45:00Z"
  },
  {
    id: "dev-006",
    carId: "car-002",
    name: "Front Camera",
    type: "Camera",
    status: "offline",
    location: "Front Bumper",
    lastActive: "2024-06-14T18:20:00Z"
  },
  {
    id: "dev-007",
    carId: "car-002",
    name: "GPS Tracker",
    type: "GPS",
    status: "online",
    location: "Under Hood",
    lastActive: "2024-06-15T10:10:00Z"
  },
  {
    id: "dev-008",
    carId: "car-003",
    name: "Front Camera",
    type: "Camera",
    status: "online",
    location: "Front Bumper",
    lastActive: "2024-06-15T10:15:00Z"
  },
  {
    id: "dev-009",
    carId: "car-003",
    name: "Rear Camera",
    type: "Camera",
    status: "online",
    location: "Rear Bumper",
    lastActive: "2024-06-15T10:14:00Z"
  },
  {
    id: "dev-010",
    carId: "car-003",
    name: "Side Cameras",
    type: "Camera",
    status: "online",
    location: "Side Mirrors",
    lastActive: "2024-06-15T10:12:00Z"
  }
];

// Mock alert data
export const mockAlerts: Alert[] = [
  {
    id: "alert-001",
    carId: "car-001",
    type: "Security",
    severity: "high",
    message: "Unauthorized access attempt",
    details: "Someone tried to open the driver's door without a key",
    timestamp: "2024-06-15T09:45:00Z",
    read: false
  },
  {
    id: "alert-002",
    carId: "car-001",
    type: "Emergency",
    severity: "high",
    message: "Collision detected",
    details: "Minor impact detected on rear bumper",
    timestamp: "2024-06-15T08:30:00Z",
    read: true
  },
  {
    id: "alert-003",
    carId: "car-001",
    type: "Safety",
    severity: "medium",
    message: "ABS system warning",
    details: "ABS system needs inspection",
    timestamp: "2024-06-14T19:15:00Z",
    read: true
  },
  {
    id: "alert-004",
    carId: "car-001",
    type: "Passenger",
    severity: "low",
    message: "Passenger seatbelt unbuckled",
    details: "Rear passenger seatbelt was unbuckled while vehicle in motion",
    timestamp: "2024-06-14T14:20:00Z",
    read: true
  },
  {
    id: "alert-005",
    carId: "car-001",
    type: "Animal",
    severity: "low",
    message: "Animal detected in vehicle",
    details: "Motion detected in vehicle while parked - possible animal",
    timestamp: "2024-06-13T10:00:00Z",
    read: true
  },
  {
    id: "alert-006",
    carId: "car-002",
    type: "Security",
    severity: "high",
    message: "Motion detected while parked",
    details: "Interior motion sensor triggered",
    timestamp: "2024-06-15T02:30:00Z",
    read: false
  },
  {
    id: "alert-007",
    carId: "car-002",
    type: "Emergency",
    severity: "high",
    message: "Airbag system warning",
    details: "Airbag system needs immediate inspection",
    timestamp: "2024-06-14T23:15:00Z",
    read: true
  },
  {
    id: "alert-008",
    carId: "car-003",
    type: "Safety",
    severity: "medium",
    message: "Tire pressure warning",
    details: "Front left tire pressure critically low",
    timestamp: "2024-06-15T07:45:00Z",
    read: false
  },
  {
    id: "alert-009",
    carId: "car-003",
    type: "Passenger",
    severity: "low",
    message: "Child left detection",
    details: "Possible child detected in rear seat after vehicle locked",
    timestamp: "2024-06-14T12:00:00Z",
    read: true
  }
];
