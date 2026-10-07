export type CountryCode = 'KE' | 'TZ' | 'UG' | 'ET';
export type LanguageCode = 'EN' | 'SW' | 'AM' | 'LG' | 'FR';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE' | 'EVACUATE';

export interface LocationCoords {
  lat: number;
  lng: number;
  altitude?: number;
  accuracy?: number;
}

export interface SafeZone {
  id: string;
  name: string;
  type: 'shelter' | 'high_ground' | 'hospital' | 'helipad' | 'relief_camp';
  lat: number;
  lng: number;
  elevationMeters: number;
  capacity: number;
  currentOccupancy: number;
  country: CountryCode;
  city: string;
  hasPower: boolean;
  hasCleanWater: boolean;
  hasMedicalAid: boolean;
  contactNumber: string;
  description: string;
}

export interface FloodReport {
  id: string;
  author: string;
  timestamp: number;
  lat: number;
  lng: number;
  locationName: string;
  depthCategory: 'ankle' | 'knee' | 'waist' | 'chest' | 'roof'; // 10cm, 45cm, 90cm, 130cm, 200cm+
  waterSpeed: 'standing' | 'slow' | 'fast' | 'torrent';
  hazards: string[]; // e.g. 'downed_powerline', 'bridge_damage', 'mudslide', 'submerged_vehicles'
  description: string;
  verifiedCount: number;
  isVerified: boolean;
  country: CountryCode;
  imageUrl?: string;
  trappedPeople?: number;
}

export interface EmergencyContact {
  name: string;
  agency: string;
  phone: string;
  tollFree: boolean;
  description: string;
}

export interface CountryProtocol {
  country: CountryCode;
  countryName: string;
  flag: string;
  emergencyLeadAgency: string;
  hotlines: EmergencyContact[];
  beforeFloodSteps: string[];
  duringFloodSteps: string[];
  afterFloodSteps: string[];
  waterPurificationTips: string[];
  diseasePreventionTips: string[];
}

export interface LiveStreamCam {
  id: string;
  title: string;
  location: string;
  country: CountryCode;
  lat: number;
  lng: number;
  waterLevelMeters: number;
  waterFlowRate: number; // m3/s
  crestStage: string;
  cameraStatus: 'LIVE' | 'STANDBY' | 'DEGRADED';
  viewers: number;
  videoType: 'drone' | 'culvert' | 'dam' | 'bridge' | 'gauge';
}

export interface FeedPost {
  id: string;
  author: string;
  agency?: string;
  isOfficial: boolean;
  type: 'ALERT' | 'ROAD_CLOSED' | 'RESCUE_REQ' | 'SHELTER_UPDATE' | 'WEATHER' | 'COMMUNITY';
  title: string;
  content: string;
  timestamp: number;
  locationName: string;
  country: CountryCode;
  upvotes: number;
  severity: 'normal' | 'urgent' | 'critical';
}

export interface MeshMessage {
  id: string;
  sender: string;
  channel: string;
  content: string;
  timestamp: number;
  hops: number;
  rssi: number; // dBm
  isDistress?: boolean;
}

export interface LocalDevice {
  id: string;
  name: string;
  type: 'phone' | 'gateway' | 'drone_relay' | 'emergency_radio';
  distanceMeters: number;
  rssi: number;
  batteryLevel: number;
  canRelay: boolean;
  status: 'connected' | 'discovered' | 'relaying';
}

export interface EmergencyProfile {
  fullName: string;
  phone: string;
  bloodType: string;
  medicalConditions: string;
  householdMembers: number;
  iceContactName: string;
  iceContactPhone: string;
  mobilityImpaired: boolean;
}

export interface AccessibilitySettings {
  blindMode: boolean; // screen reader focus, high contrast yellow/black, audio feedback
  deafMode: boolean; // high visual strobes, banner flashing, closed captions
  hapticFeedback: boolean;
  audioSirenEnabled: boolean;
  largeFont: boolean;
  autoSpeakAlerts: boolean;
}
