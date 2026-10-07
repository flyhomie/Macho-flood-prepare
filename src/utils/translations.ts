import { LanguageCode } from '../types';

export interface TranslationSet {
  appName: string;
  tagline: string;
  tabs: {
    dashboard: string;
    map: string;
    navigate: string;
    protocols: string;
    streams: string;
    feed: string;
    mesh: string;
    localNet: string;
    aiAssist: string;
    settings: string;
  };
  emergency: {
    sosTitle: string;
    sosButton: string;
    reportFlood: string;
    sirenOn: string;
    sirenOff: string;
    safeGround: string;
    highRiskAlert: string;
    evacuateNow: string;
    waterLevelGauge: string;
    riskScore: string;
    bearing: string;
    distance: string;
    elevation: string;
  };
  actions: {
    callEmergency: string;
    sendSos: string;
    verifyReport: string;
    shareCoords: string;
    joinMesh: string;
    askAi: string;
    downloadOfflineMap: string;
  };
  accessibility: {
    blindModeOn: string;
    blindModeDesc: string;
    deafModeOn: string;
    deafModeDesc: string;
    audioBeacons: string;
  };
}

export const translations: Record<LanguageCode, TranslationSet> = {
  EN: {
    appName: 'Macho Early Warning',
    tagline: 'Flood Disaster Mitigation & Emergency Network',
    tabs: {
      dashboard: 'Dashboard',
      map: 'Live Map',
      navigate: 'Evac Route',
      protocols: 'Protocols',
      streams: 'Live Cams',
      feed: 'Situation Feed',
      mesh: 'Mesh Chat',
      localNet: 'Local Net',
      aiAssist: 'AI Safety',
      settings: 'Profile & Access',
    },
    emergency: {
      sosTitle: 'DISTRESS BEACON (SOS)',
      sosButton: 'BROADCAST SOS',
      reportFlood: 'Report Flood Water',
      sirenOn: 'SOUND SIREN',
      sirenOff: 'MUTE SIREN',
      safeGround: 'Find High Ground',
      highRiskAlert: 'FLASH FLOOD ALERT: Rapidly Rising Waters',
      evacuateNow: 'CRITICAL EVACUATION DIRECTIVE',
      waterlineGauge: 'Live Basin Waterline Gauge',
      riskScore: 'Flood Hazard Risk Index',
      bearing: 'Bearing',
      distance: 'Distance',
      elevation: 'Elevation Gain',
    },
    actions: {
      callEmergency: 'Call Emergency Dispatch',
      sendSos: 'Broadcast Distress Signal',
      verifyReport: 'Verify Incident',
      shareCoords: 'Share GPS Coordinates',
      joinMesh: 'Connect to Offline Mesh',
      askAi: 'Ask Emergency Assistant',
      downloadOfflineMap: 'Save Offline Pack',
    },
    accessibility: {
      blindModeOn: 'Blind Accessibility Mode (Screen-Reader & High-Contrast)',
      blindModeDesc: 'High contrast yellow on black, spoken audio cues and sonar pulse.',
      deafModeOn: 'Deaf Accessibility Mode (Visual Strobe Alerts)',
      deafModeDesc: 'High intensity flashing screen beacons and visual vibration cues.',
      audioBeacons: 'Audio Navigational Sonar',
    },
  },
  SW: {
    appName: 'Macho Tahadhari ya Mafuriko',
    tagline: 'Mfumo wa Dharura na Kupunguza Madhara ya Mafuriko',
    tabs: {
      dashboard: 'Dashibodi',
      map: 'Ramani Halisi',
      navigate: 'Njia ya Salama',
      protocols: 'Miongozo',
      streams: 'Kamera za Mito',
      feed: 'Taarifa za Jamii',
      mesh: 'Mesh ya Nje ya Mtandao',
      localNet: 'Mtandao wa Karibu',
      aiAssist: 'Msaidizi wa AI',
      settings: 'Mipangilio na Wasifu',
    },
    emergency: {
      sosTitle: 'WITO WA DHARURA (SOS)',
      sosButton: 'TUMA SOS SASA',
      reportFlood: 'Ripoti Maji ya Mafuriko',
      sirenOn: 'WASHA KING\'ORA',
      sirenOff: 'ZIMA KING\'ORA',
      safeGround: 'Tafuta Eneo la Juu',
      highRiskAlert: 'TAHADHARI YA MAFURIKO: Maji Yanapanda kwa Kasi',
      evacuateNow: 'AMRI YA KUHAMA MARA MOJA',
      waterlineGauge: 'Kiwango cha Maji Mtoni',
      riskScore: 'Kiwango cha Hatari ya Mafuriko',
      bearing: 'Mwelekeo',
      distance: 'Umbali',
      elevation: 'Mwinuko',
    },
    actions: {
      callEmergency: 'Piga Simu ya Dharura',
      sendSos: 'Tuma Ishara ya SOS',
      verifyReport: 'Thibitisha Tukio',
      shareCoords: 'Gawa Viratibu vya GPS',
      joinMesh: 'Jiunge na Mtandao wa Mesh',
      askAi: 'Uliza Msaada wa Dharura',
      downloadOfflineMap: 'Pakua Ramani Nje ya Mtandao',
    },
    accessibility: {
      blindModeOn: 'Hali ya Wasioona (Sauti na Utofautishaji wa Juu)',
      blindModeDesc: 'Rangi za manjano na nyeusi zenye sauti za mwongozo.',
      deafModeOn: 'Hali ya Viziwi (Taa za Tahadhari)',
      deafModeDesc: 'Miwako mikali ya skrini na mitetemo ya kuona.',
      audioBeacons: 'Milio ya Sonar ya Mwongozo',
    },
  },
  AM: {
    appName: 'ማቾ - የጎርፍ ቅድመ ማስጠንቀቂያ',
    tagline: 'የአደጋ መከላከል እና የአስቸኳይ ጊዜ መረብ',
    tabs: {
      dashboard: 'ዳሽቦርድ',
      map: 'የቀጥታ ካርታ',
      navigate: 'የማምለጫ መንገድ',
      protocols: 'መመሪያዎች',
      streams: 'የቀጥታ ካሜራዎች',
      feed: 'የሁኔታ መረጃ',
      mesh: 'ሜሽ ውይይት',
      localNet: 'የአካባቢ መረብ',
      aiAssist: 'AI ረዳት',
      settings: 'መገለጫ እና ቅንብሮች',
    },
    emergency: {
      sosTitle: 'የአስቸኳይ ጊዜ ጥሪ (SOS)',
      sosButton: 'SOS አስተላልፍ',
      reportFlood: 'የጎርፍ ሁኔታ ሪፖርት አድርግ',
      sirenOn: 'ሳይረን አሰማ',
      sirenOff: 'ሳይረን አጥፋ',
      safeGround: 'ከፍተኛ ቦታ ፈልግ',
      highRiskAlert: 'የጎርፍ ማስጠንቀቂያ፡ ውኃው በፍጥነት እየጨመረ ነው',
      evacuateNow: 'አስቸኳይ የማስለቀቅ ትእዛዝ',
      waterlineGauge: 'የወንዝ የውኃ መጠን መለኪያ',
      riskScore: 'የጎርፍ አደጋ ደረጃ',
      bearing: 'አቅጣጫ',
      distance: 'ርቀት',
      elevation: 'ከፍታ',
    },
    actions: {
      callEmergency: 'የአስቸኳይ ጊዜ ጥሪ አድርግ',
      sendSos: 'የእርዳታ ጥሪ አስተላልፍ',
      verifyReport: 'ሪፖርቱን አረጋግጥ',
      shareCoords: 'የጂፒኤስ መገኛ አጋራ',
      joinMesh: 'ከሜሽ ጋር ተገናኝ',
      askAi: 'AI ረዳትን ጠይቅ',
      downloadOfflineMap: 'ካርታ ከመስመር ውጭ አውርድ',
    },
    accessibility: {
      blindModeOn: 'የዓይነ ስውራን ሁነታ',
      blindModeDesc: 'ከፍተኛ ንፅፅር እና የድምጽ መመሪያዎች።',
      deafModeOn: 'የመስማት ችግር ላለባቸው ሁነታ',
      deafModeDesc: 'የስክሪን ብልጭታ ማስጠንቀቂያዎች።',
      audioBeacons: 'የድምጽ አቅጣጫ ምልክት',
    },
  },
  LG: {
    appName: 'Macho - Okulabula ku Mayengo',
    tagline: 'Enteekateeka z\'Ebibinja n\'Obudde bw\'Akabi',
    tabs: {
      dashboard: 'Wano',
      map: 'Mmaapu',
      navigate: 'Ekkubo ly\'Obulamu',
      protocols: 'Amateeka',
      streams: 'Kamera z\'Emugga',
      feed: 'Amawulire',
      mesh: 'Empewo z\'Obulamu',
      localNet: 'Omutimbagano gwa Wano',
      aiAssist: 'Omuyambi wa AI',
      settings: 'Enteekateeka',
    },
    emergency: {
      sosTitle: 'OKULAABULA KW\'AMANYI (SOS)',
      sosButton: 'SINDIKA SOS',
      reportFlood: 'Tegeeza Amazzi Agajjudde',
      sirenOn: 'YAKA ENGOOZI',
      sirenOff: 'ZIKIZA ENGOOZI',
      safeGround: 'Noonya Ekifo Ekyawaggulu',
      highRiskAlert: 'OKULABULA: Amazzi gayitiridde okulinnya',
      evacuateNow: 'VA WANO MANGU DALA',
      waterlineGauge: 'Ebipimo by\'Amazzi',
      riskScore: 'Obulabe bw\'Amazzi',
      bearing: 'Endagiriro',
      distance: 'Ebbanga',
      elevation: 'Obugulumivu',
    },
    actions: {
      callEmergency: 'Kuba Ku Ssimu y\'Akabenje',
      sendSos: 'Sindika Obubonero bw\'Obuyambi',
      verifyReport: 'Kakasa Ensonga eno',
      shareCoords: 'Gaba GPS Yo',
      joinMesh: 'Yunga ku Mesh',
      askAi: 'Buuza AI',
      downloadOfflineMap: 'Tereka Mmaapu',
    },
    accessibility: {
      blindModeOn: 'Enteekateeka z\'Abalema b\'Amaaso',
      blindModeDesc: 'Langi ennyonjoofu n\'amaloboozi agawa obulagirizi.',
      deafModeOn: 'Enteekateeka z\'Abawulira Obubi',
      deafModeDesc: 'Ettaala ezimyansa ku lutimbe n\'okukankana.',
      audioBeacons: 'Edwoboozi ly\'Endagiriro',
    },
  },
  FR: {
    appName: 'Macho — Alerte Précoce Inondations',
    tagline: 'Atténuation des Catastrophes & Réseau d\'Urgence',
    tabs: {
      dashboard: 'Tableau de Bord',
      map: 'Carte en Direct',
      navigate: 'Route d\'Évacuation',
      protocols: 'Protocoles',
      streams: 'Caméras Direct',
      feed: 'Fil d\'Actualités',
      mesh: 'Réseau Mesh',
      localNet: 'Réseau Local',
      aiAssist: 'Assistant IA',
      settings: 'Profil & Accès',
    },
    emergency: {
      sosTitle: 'BALISE DE DÉTRESSE (SOS)',
      sosButton: 'DIFFUSER LE SOS',
      reportFlood: 'Signaler une Inondation',
      sirenOn: 'ACTIVER LA SIRÈNE',
      sirenOff: 'ARRÊTER LA SIRÈNE',
      safeGround: 'Trouver un Terrain Élevé',
      highRiskAlert: 'ALERTE CRUE ÉCLAIR: Montée Rapide des Eaux',
      evacuateNow: 'ORDRE D\'ÉVACUATION IMMÉDIATE',
      waterlineGauge: 'Jauge de Niveau d\'Eau',
      riskScore: 'Indice de Risque d\'Inondation',
      bearing: 'Cap',
      distance: 'Distance',
      elevation: 'Gain d\'Élévation',
    },
    actions: {
      callEmergency: 'Appeler les Secours',
      sendSos: 'Diffuser le Signal SOS',
      verifyReport: 'Vérifier l\'Incident',
      shareCoords: 'Partager les Coordonnées GPS',
      joinMesh: 'Rejoindre le Réseau Mesh',
      askAi: 'Consulter l\'Assistant',
      downloadOfflineMap: 'Télécharger la Carte',
    },
    accessibility: {
      blindModeOn: 'Mode Non-Voyant (Lecteur d\'Écran & Contraste)',
      blindModeDesc: 'Contraste jaune/noir et retours sonores sonar.',
      deafModeOn: 'Mode Malentendant (Flashs Visuels)',
      deafModeDesc: 'Signaux lumineux intenses et vibrations visuelles.',
      audioBeacons: 'Balises Sonores de Navigation',
    },
  },
};
