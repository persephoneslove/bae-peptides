const STORAGE_KEYS = {
  INJECTIONS: 'biobae_injections_v2',
  VITAMINS: 'biobae_vitamins_v2',
  PROFILE: 'biobae_profile_v2',
  DAILY_LOGS: 'biobae_daily_logs_v2',
  BIOMETRICS: 'biobae_biometrics_v2',
  SUBJECTIVE_WELLNESS: 'biobae_subjective_wellness_v2',
  BIOMARKERS_LAB: 'biobae_biomarkers_lab_v2',
  CYCLE_DATA: 'biobae_cycle_data_v2',
  CUSTOM_PEPTIDES: 'biobae_custom_peptides_v2',
  LAST_BACKUP_TIME: 'biobae_last_backup_time'
};

const DEFAULT_PROFILE = {
  chronological_age: 37,
  cycle_length: 28,
  primary_goals: 'Cellular longevity, hormonal balance, sustained energy.'
};

const DEFAULT_INJECTIONS = [
  {
    id: 'inj-1',
    name: 'KLOW Blend (Klotho / KPV / BPC / GHK)',
    dose: '500 mcg',
    units: 20,
    frequency: 'Daily (AM)',
    timing: 'Morning Fasted',
    category: 'Cellular Longevity & Rejuvenation',
    vialMg: 10,
    bacWaterMl: 2.0,
    color: '#00f2fe',
    consecutiveDaysActive: 14,
    start_date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    cycle_duration: 60,
    cycle_days_on: 5,
    cycle_days_off: 2
  },
  {
    id: 'inj-2',
    name: 'MOTS-c',
    dose: '5.0 mg',
    units: 50,
    frequency: '3x / Week',
    timing: 'Pre-Workout Fasted',
    category: 'Metabolic & Mitochondrial Biogenesis',
    vialMg: 10,
    bacWaterMl: 2.0,
    color: '#ffb703',
    consecutiveDaysActive: 8,
    start_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
    cycle_duration: 30,
    cycle_days_on: 3,
    cycle_days_off: 4
  }
];

const DEFAULT_VITAMINS = [
  {
    id: 'vit-1',
    name: 'Vitamin D3 (5,000 IU) + K2 (MK-7 100mcg)',
    dose: '1 Softgel',
    timeOfDay: 'Morning',
    target: 'Immunity & Bone Mineralization',
    takenToday: true,
    streak: 14
  },
  {
    id: 'vit-2',
    name: 'Magnesium L-Threonate (Magtein)',
    dose: '1,500 mg',
    timeOfDay: 'Bedtime',
    target: 'Synaptic Plasticity & Slow-Wave Sleep',
    takenToday: false,
    streak: 12
  }
];

const DEFAULT_DAILY_LOGS = [
  {
    id: 'log-1',
    protocol_id: 'inj-1',
    compoundKey: 'klow',
    name: 'KLOW Blend',
    actual_dose_mcg: 500,
    dose: '500 mcg',
    site: 'Left Abdomen (SubQ)',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    displayTime: 'Today 08:30 AM',
    dose_taken: true,
    cycle_day: 14
  }
];

const DEFAULT_BIOMETRICS = [
  { id: 'bio-1', date: 'Today', hrv: 76, resting_hr: 52, sleep_score: 89, deep_sleep_pct: '24.2', recovery_index: 88 },
  { id: 'bio-2', date: 'Yesterday', hrv: 74, resting_hr: 54, sleep_score: 87, deep_sleep_pct: '22.0', recovery_index: 85 }
];

const DEFAULT_SUBJECTIVE_WELLNESS = [
  {
    id: 'ass-1',
    date: 'Today',
    timestamp: new Date().toISOString(),
    energy_rating: 8,
    mood_rating: 9,
    brain_fog: 2,
    skin_sensitivity: 'Normal (No Reaction)',
    libido: 7,
    orgasm_strength: 8,
    joint_health: 8,
    notes: 'Feeling balanced around ovulation.'
  },
  {
    id: 'ass-2',
    date: 'Yesterday',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    energy_rating: 8,
    mood_rating: 8,
    brain_fog: 3,
    skin_sensitivity: 'Normal (No Reaction)',
    libido: 7,
    orgasm_strength: 7,
    joint_health: 9,
    notes: 'Good energy, mild craving.'
  }
];

const DEFAULT_CYCLE_DATA = {
  lastPeriodStart: new Date(Date.now() - 14 * 86400000).toISOString(),
  averageLength: 28,
  currentDay: 14
};

const DEFAULT_CUSTOM_PEPTIDES = [];

export function getStorageData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error('Storage Read Error:', err);
    return fallback;
  }
}

/**
 * Enhanced storage setter with multi-layer persistence & automated backup snapshot
 */
export function setStorageData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    
    // Auto-update master backup snapshot on every mutation
    triggerAutoBackupSnapshot();
  } catch (err) {
    console.error('Storage Write Error:', err);
  }
}

/**
 * Creates an automated bundled JSON backup snapshot of all data stores
 */
export function triggerAutoBackupSnapshot() {
  try {
    const snapshot = {
      timestamp: new Date().toISOString(),
      version: '3.0.0',
      data: {
        injections: getStorageData(STORAGE_KEYS.INJECTIONS, DEFAULT_INJECTIONS),
        vitamins: getStorageData(STORAGE_KEYS.VITAMINS, DEFAULT_VITAMINS),
        profile: getStorageData(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE),
        dailyLogs: getStorageData(STORAGE_KEYS.DAILY_LOGS, DEFAULT_DAILY_LOGS),
        biometrics: getStorageData(STORAGE_KEYS.BIOMETRICS, DEFAULT_BIOMETRICS),
        subjectiveWellness: getStorageData(STORAGE_KEYS.SUBJECTIVE_WELLNESS, DEFAULT_SUBJECTIVE_WELLNESS),
        biomarkersLab: getStorageData(STORAGE_KEYS.BIOMARKERS_LAB, []),
        cycleData: getStorageData(STORAGE_KEYS.CYCLE_DATA, DEFAULT_CYCLE_DATA),
        customPeptides: getStorageData(STORAGE_KEYS.CUSTOM_PEPTIDES, DEFAULT_CUSTOM_PEPTIDES)
      }
    };
    
    // Save to high-durability secondary key
    localStorage.setItem('biobae_master_backup_snapshot', JSON.stringify(snapshot));
    localStorage.setItem(STORAGE_KEYS.LAST_BACKUP_TIME, new Date().toLocaleTimeString());
  } catch (e) {
    console.warn('Auto backup error:', e);
  }
}

/**
 * 1-Click Export to JSON file (for saving to iCloud / Files)
 */
export function exportDataToFile() {
  try {
    const snapshot = localStorage.getItem('biobae_master_backup_snapshot') || JSON.stringify({
      timestamp: new Date().toISOString(),
      data: initialData
    });
    
    const blob = new Blob([snapshot], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `BioBae_Backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Export failed:', err);
    return false;
  }
}

/**
 * 1-Click Restore from JSON file
 */
export function importDataFromFile(file, onComplete) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      const data = parsed.data || parsed;
      
      if (data.injections) localStorage.setItem(STORAGE_KEYS.INJECTIONS, JSON.stringify(data.injections));
      if (data.vitamins) localStorage.setItem(STORAGE_KEYS.VITAMINS, JSON.stringify(data.vitamins));
      if (data.profile) localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(data.profile));
      if (data.dailyLogs) localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(data.dailyLogs));
      if (data.biometrics) localStorage.setItem(STORAGE_KEYS.BIOMETRICS, JSON.stringify(data.biometrics));
      if (data.subjectiveWellness) localStorage.setItem(STORAGE_KEYS.SUBJECTIVE_WELLNESS, JSON.stringify(data.subjectiveWellness));
      if (data.biomarkersLab) localStorage.setItem(STORAGE_KEYS.BIOMARKERS_LAB, JSON.stringify(data.biomarkersLab));
      if (data.cycleData) localStorage.setItem(STORAGE_KEYS.CYCLE_DATA, JSON.stringify(data.cycleData));
      if (data.customPeptides) localStorage.setItem(STORAGE_KEYS.CUSTOM_PEPTIDES, JSON.stringify(data.customPeptides));
      
      triggerAutoBackupSnapshot();
      if (onComplete) onComplete(true);
    } catch (err) {
      console.error('Import failed:', err);
      if (onComplete) onComplete(false);
    }
  };
  reader.readAsText(file);
}

export const initialData = {
  injections: getStorageData(STORAGE_KEYS.INJECTIONS, DEFAULT_INJECTIONS),
  vitamins: getStorageData(STORAGE_KEYS.VITAMINS, DEFAULT_VITAMINS),
  profile: getStorageData(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE),
  dailyLogs: getStorageData(STORAGE_KEYS.DAILY_LOGS, DEFAULT_DAILY_LOGS),
  biometrics: getStorageData(STORAGE_KEYS.BIOMETRICS, DEFAULT_BIOMETRICS),
  subjectiveWellness: getStorageData(STORAGE_KEYS.SUBJECTIVE_WELLNESS, DEFAULT_SUBJECTIVE_WELLNESS),
  biomarkersLab: getStorageData(STORAGE_KEYS.BIOMARKERS_LAB, []),
  cycleData: getStorageData(STORAGE_KEYS.CYCLE_DATA, DEFAULT_CYCLE_DATA),
  customPeptides: getStorageData(STORAGE_KEYS.CUSTOM_PEPTIDES, DEFAULT_CUSTOM_PEPTIDES),
  KEYS: STORAGE_KEYS
};
