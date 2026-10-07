import React, { useState, useEffect } from 'react';
import {
  CountryCode,
  LanguageCode,
  RiskLevel,
  SafeZone,
  FloodReport,
  AccessibilitySettings,
  EmergencyProfile,
} from './types';
import {
  INITIAL_SAFE_ZONES,
  INITIAL_FLOOD_REPORTS,
  COUNTRY_PROTOCOLS,
} from './data/mockData';
import { Navbar, BottomNav } from './components/Navbar';
import { SosModal } from './components/SosModal';
import { ReportFloodModal } from './components/ReportFloodModal';
import { DashboardView } from './components/views/DashboardView';
import { MapView } from './components/views/MapView';
import { NavigateView } from './components/views/NavigateView';
import { ProtocolsView } from './components/views/ProtocolsView';
import { LiveStreamsView } from './components/views/LiveStreamsView';
import { CommunityFeedView } from './components/views/CommunityFeedView';
import { MeshChatView } from './components/views/MeshChatView';
import { LocalNetView } from './components/views/LocalNetView';
import { AiAssistView } from './components/views/AiAssistView';
import { SettingsView } from './components/views/SettingsView';
import { audioService } from './utils/audio';
import { REGIONAL_CENTROIDS } from './utils/geo';

export default function App() {
  // App Global State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [country, setCountry] = useState<CountryCode>('KE');
  const [language, setLanguage] = useState<LanguageCode>('EN');

  // Hydrological & Risk State
  const [waterLevelMeters, setWaterLevelMeters] = useState<number>(4.85);
  const [rainfallMmHr, setRainfallMmHr] = useState<number>(48);
  const [damCapacityPct, setDamCapacityPct] = useState<number>(88);
  const [soilSaturationPct, setSoilSaturationPct] = useState<number>(92);
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);

  // Dynamic Risk calculation
  const riskScore = Math.min(
    100,
    Math.round((waterLevelMeters / 8.0) * 60 + (rainfallMmHr / 70) * 25 + (soilSaturationPct / 100) * 15)
  );

  let riskLevel: RiskLevel = 'MODERATE';
  if (riskScore >= 85) riskLevel = 'EVACUATE';
  else if (riskScore >= 65) riskLevel = 'SEVERE';
  else if (riskScore >= 40) riskLevel = 'HIGH';

  // Data Collections
  const [safeZones, setSafeZones] = useState<SafeZone[]>(INITIAL_SAFE_ZONES);
  const [floodReports, setFloodReports] = useState<FloodReport[]>(INITIAL_FLOOD_REPORTS);
  const [selectedDestination, setSelectedDestination] = useState<SafeZone | null>(null);

  // GPS User Coords
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; accuracy?: number }>({
    lat: REGIONAL_CENTROIDS.KE.lat,
    lng: REGIONAL_CENTROIDS.KE.lng,
    accuracy: 12,
  });

  // Modal States
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Accessibility Settings
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    blindMode: false,
    deafMode: false,
    hapticFeedback: true,
    audioSirenEnabled: true,
    largeFont: false,
    autoSpeakAlerts: true,
  });

  // Emergency Profile
  const [emergencyProfile, setEmergencyProfile] = useState<EmergencyProfile>({
    fullName: 'Juma Mwangi',
    phone: '+254 712 345678',
    bloodType: 'O+',
    medicalConditions: 'Asthma (Carry Ventolin Inhaler)',
    householdMembers: 4,
    iceContactName: 'Grace Mwangi (Sister)',
    iceContactPhone: '+254 722 987654',
    mobilityImpaired: false,
  });

  // Fetch real GPS on mount if available
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy),
          });
        },
        (err) => {
          console.log('Using default regional GPS centroid', err);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Sync coords if user changes country
  const handleSelectCountry = (newCountry: CountryCode) => {
    setCountry(newCountry);
    const centroid = REGIONAL_CENTROIDS[newCountry] || REGIONAL_CENTROIDS.KE;
    setUserCoords({
      lat: centroid.lat,
      lng: centroid.lng,
      accuracy: 15,
    });
  };

  // Siren toggle
  const handleToggleSiren = () => {
    if (isSirenActive) {
      audioService.stopSiren();
      setIsSirenActive(false);
    } else {
      audioService.startSiren();
      setIsSirenActive(true);
    }
  };

  // Handle new community report submission
  const handleAddFloodReport = (
    newReport: Omit<FloodReport, 'id' | 'timestamp' | 'verifiedCount' | 'isVerified'>
  ) => {
    const report: FloodReport = {
      ...newReport,
      id: `fr-${Date.now()}`,
      timestamp: Date.now(),
      verifiedCount: 1,
      isVerified: false,
    };
    setFloodReports([report, ...floodReports]);
  };

  // Blind mode announcement on tab switch
  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
    if (accessibility.blindMode) {
      audioService.speak(`Switched to ${tabId} view`);
      audioService.playSonarPing(0.3);
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${
        accessibility.blindMode ? 'high-contrast' : ''
      } ${accessibility.largeFont ? 'text-lg' : 'text-sm'}`}
    >
      {/* Visual Deaf Strobe Alert if Severe & Deaf Mode is ON */}
      {accessibility.deafMode && riskScore >= 80 && (
        <div className="fixed top-0 left-0 right-0 h-2 visual-strobe-alert z-50 pointer-events-none" />
      )}

      {/* Top Navbar */}
      <Navbar
        country={country}
        onSelectCountry={handleSelectCountry}
        language={language}
        onSelectLanguage={setLanguage}
        accessibility={accessibility}
        onUpdateAccessibility={(updated) => setAccessibility({ ...accessibility, ...updated })}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        isSirenActive={isSirenActive}
        onToggleSiren={handleToggleSiren}
        isMeshOnline={true}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24">
        {currentTab === 'dashboard' && (
          <DashboardView
            country={country}
            language={language}
            riskScore={riskScore}
            riskLevel={riskLevel}
            waterLevelMeters={waterLevelMeters}
            onWaterLevelChange={setWaterLevelMeters}
            rainfallMmHr={rainfallMmHr}
            damCapacityPct={damCapacityPct}
            soilSaturationPct={soilSaturationPct}
            isSirenActive={isSirenActive}
            onToggleSiren={handleToggleSiren}
            safeZones={safeZones}
            floodReports={floodReports}
            userCoords={userCoords}
            onNavigateToTab={handleTabChange}
            onSelectSafeZone={(zone) => {
              setSelectedDestination(zone);
              handleTabChange('navigate');
            }}
            onOpenSos={() => setIsSosOpen(true)}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}

        {currentTab === 'map' && (
          <MapView
            country={country}
            safeZones={safeZones}
            floodReports={floodReports}
            userCoords={userCoords}
            onSelectDestination={(zone) => {
              setSelectedDestination(zone);
              handleTabChange('navigate');
            }}
            onOpenReportModal={() => setIsReportOpen(true)}
          />
        )}

        {currentTab === 'navigate' && (
          <NavigateView
            userCoords={userCoords}
            safeZones={safeZones}
            selectedZone={selectedDestination}
            onSelectZone={setSelectedDestination}
          />
        )}

        {currentTab === 'protocols' && (
          <ProtocolsView
            country={country}
            onSelectCountry={handleSelectCountry}
          />
        )}

        {currentTab === 'streams' && <LiveStreamsView />}

        {currentTab === 'feed' && (
          <CommunityFeedView
            country={country}
            onOpenReportModal={() => setIsReportOpen(true)}
          />
        )}

        {currentTab === 'mesh' && (
          <MeshChatView
            onSendDistress={(text) => {
              setIsSosOpen(true);
            }}
          />
        )}

        {currentTab === 'localNet' && <LocalNetView />}

        {currentTab === 'aiAssist' && <AiAssistView />}

        {currentTab === 'settings' && (
          <SettingsView
            country={country}
            onSelectCountry={handleSelectCountry}
            language={language}
            onSelectLanguage={setLanguage}
            accessibility={accessibility}
            onUpdateAccessibility={(updated) => setAccessibility({ ...accessibility, ...updated })}
            emergencyProfile={emergencyProfile}
            onUpdateProfile={setEmergencyProfile}
          />
        )}
      </main>

      {/* 10-Tab Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        language={language}
        onOpenSos={() => setIsSosOpen(true)}
      />

      {/* Emergency Distress SOS Modal */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        country={country}
        userCoords={userCoords}
        emergencyProfile={emergencyProfile}
        onBroadcastSosMesh={(payload) => {
          // Play SOS Morse audio
          audioService.playMorseSos();
        }}
      />

      {/* Community Flood Incident Reporting Modal */}
      <ReportFloodModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        country={country}
        userCoords={userCoords}
        onSubmitReport={handleAddFloodReport}
      />
    </div>
  );
}
