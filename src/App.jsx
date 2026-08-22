import React, { useState } from 'react';
import DailyCompass from './components/DailyCompass';
import InputLoggingEngine from './components/InputLoggingEngine';
import BiometricsEngine from './components/BiometricsEngine';
import InsightsEngine from './components/InsightsEngine';
import CycleSyncModule from './components/CycleSyncModule';
import UnifiedCommandView from './components/UnifiedCommandView';
import CalculatorView from './components/CalculatorView';
import RecoveryView from './components/RecoveryView';
import { initialData, setStorageData } from './utils/storage';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'input_engine' | 'biometrics' | 'analytics' | 'unified' | 'calculator' | 'recovery'
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Core Relational Data Stores
  const [injections, setInjections] = useState(initialData.injections);
  const [vitamins, setVitamins] = useState(initialData.vitamins);
  const [wellnessLogs, setWellnessLogs] = useState(initialData.wellness || []);
  const [userProfile, setUserProfile] = useState(initialData.profile);
  const [biomarkerLogs, setBiomarkerLogs] = useState(initialData.biomarkers || []);
  const [dailyLogs, setDailyLogs] = useState(initialData.dailyLogs);
  const [biometrics, setBiometrics] = useState(initialData.biometrics);
  const [subjectiveWellness, setSubjectiveWellness] = useState(initialData.subjectiveWellness);
  const [cycleData, setCycleData] = useState(initialData.cycleData);

  // Sync Handlers
  const handleUpdateInjections = (newInjections) => {
    setInjections(newInjections);
    setStorageData(initialData.KEYS.INJECTIONS, newInjections);
  };

  const handleUpdateVitamins = (newVitamins) => {
    setVitamins(newVitamins);
    setStorageData(initialData.KEYS.VITAMINS, newVitamins);
  };

  const handleUpdateWellness = (newLogs) => {
    setWellnessLogs(newLogs);
    setStorageData(initialData.KEYS.WELLNESS, newLogs);
  };

  const handleUpdateProfile = (newProfile) => {
    setUserProfile(newProfile);
    setStorageData(initialData.KEYS.PROFILE, newProfile);
  };

  const handleUpdateBiomarkerLogs = (newLogs) => {
    setBiomarkerLogs(newLogs);
    setStorageData(initialData.KEYS.BIOMARKERS, newLogs);
  };

  const handleAddDailyLog = (newLog) => {
    const updated = [newLog, ...dailyLogs];
    setDailyLogs(updated);
    setStorageData(initialData.KEYS.DAILY_LOGS, updated);
  };

  const handleAddBiometric = (newEntry) => {
    const updated = [newEntry, ...biometrics];
    setBiometrics(updated);
    setStorageData(initialData.KEYS.BIOMETRICS, updated);
  };

  const handleAddWellness = (newEntry) => {
    const updated = [newEntry, ...subjectiveWellness];
    setSubjectiveWellness(updated);
    setStorageData(initialData.KEYS.SUBJECTIVE_WELLNESS, updated);
  };

  const handleUpdateCycleData = (newData) => {
    setCycleData(newData);
    setStorageData(initialData.KEYS.CYCLE_DATA, newData);
  };

  const handleLogQuickDose = (item) => {
    sound.playSuccess();
    const newLog = {
      id: 'log-' + Date.now(),
      protocol_id: item.id,
      compoundKey: (item.name || 'bpc-157').toLowerCase(),
      name: item.name,
      actual_dose_mcg: parseFloat(item.dose) || 250,
      dose: item.dose,
      site: 'Abdomen (SubQ)',
      timestamp: new Date().toISOString(),
      displayTime: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dose_taken: true,
      cycle_day: cycleData?.currentDay || 14
    };
    handleAddDailyLog(newLog);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  const handleNav = (tab) => {
    sound.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      {/* Longevity Architect Modular Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand-header">
          <div className="brand-logo">🧬</div>
          <div className="brand-text">
            <h1>Longevity Architect</h1>
            <span>Cellular Intelligence</span>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            <span className="icon">🌸</span>
            <span>The Daily Compass</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'cycle_sync' ? 'active' : ''}`}
            onClick={() => handleNav('cycle_sync')}
          >
            <span className="icon">🔄</span>
            <span>Cycle Sync Module</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'input_engine' ? 'active' : ''}`}
            onClick={() => handleNav('input_engine')}
          >
            <span className="icon">✨</span>
            <span>Input & Logging</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'biometrics' ? 'active' : ''}`}
            onClick={() => handleNav('biometrics')}
          >
            <span className="icon">⌚</span>
            <span>Biometrics Feed</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => handleNav('analytics')}
          >
            <span className="icon">🧠</span>
            <span>The Insights Engine</span>
          </button>

          <div style={{ margin: '8px 0', borderTop: '1px solid var(--border)' }} />

          <button
            className={`nav-item ${activeTab === 'unified' ? 'active' : ''}`}
            onClick={() => handleNav('unified')}
          >
            <span className="icon">⚡</span>
            <span>Unified Hub & Scan</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => handleNav('calculator')}
          >
            <span className="icon">🧮</span>
            <span>Syringe Calculator</span>
          </button>

          <button
            className={`nav-item ${activeTab === 'recovery' ? 'active' : ''}`}
            onClick={() => handleNav('recovery')}
          >
            <span className="icon">❄️</span>
            <span>Recovery Hub</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Decay Integral E(t) Live</span>
          <button
            onClick={toggleSound}
            style={{
              background: 'transparent',
              border: 'none',
              color: soundEnabled ? 'var(--accent-cyan)' : 'var(--text-dim)',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            {soundEnabled ? '🔊 Audio ON' : '🔇 Muted'}
          </button>
        </div>
      </aside>

      {/* Main Screen Content */}
      <main className="main-wrapper">
        {activeTab === 'dashboard' && (
          <DailyCompass
            injections={injections}
            vitamins={vitamins}
            dailyLogs={dailyLogs}
            subjectiveWellness={subjectiveWellness}
            onNavigate={handleNav}
            onLogQuickDose={handleLogQuickDose}
          />
        )}

        {activeTab === 'cycle_sync' && (
          <CycleSyncModule
            cycleData={cycleData}
            onUpdateCycleData={handleUpdateCycleData}
          />
        )}

        {activeTab === 'input_engine' && (
          <InputLoggingEngine
            injections={injections}
            vitamins={vitamins}
            wellnessLogs={wellnessLogs}
            dailyLogs={dailyLogs}
            onAddDailyLog={handleAddDailyLog}
            subjectiveWellness={subjectiveWellness}
            onAddWellness={handleAddWellness}
            onUpdateVitamins={handleUpdateVitamins}
            onUpdateWellness={handleUpdateWellness}
            cycleData={cycleData}
          />
        )}

        {activeTab === 'biometrics' && (
          <BiometricsEngine
            biometrics={biometrics}
            onAddBiometric={handleAddBiometric}
          />
        )}

        {activeTab === 'analytics' && (
          <InsightsEngine
            injections={injections}
            vitamins={vitamins}
            dailyLogs={dailyLogs}
            biometrics={biometrics}
            subjectiveWellness={subjectiveWellness}
            cycleData={cycleData}
          />
        )}

        {activeTab === 'unified' && (
          <UnifiedCommandView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            injections={injections}
            onUpdateInjections={handleUpdateInjections}
            vitamins={vitamins}
            onUpdateVitamins={handleUpdateVitamins}
            wellnessLogs={wellnessLogs}
            onUpdateWellness={handleUpdateWellness}
            biomarkerLogs={biomarkerLogs}
            onUpdateBiomarkerLogs={handleUpdateBiomarkerLogs}
          />
        )}

        {activeTab === 'calculator' && (
          <CalculatorView />
        )}

        {activeTab === 'recovery' && (
          <RecoveryView
            wellnessLogs={wellnessLogs}
            onUpdateWellness={handleUpdateWellness}
          />
        )}
      </main>
    </div>
  );
}
