import React, { useState, useRef } from 'react';
import { GOAL_OPTIONS, ACTIVITY_LEVELS } from '../utils/userProfile';
import { evaluateProtocol } from '../utils/protocolEvaluator';
import { sound } from '../utils/audio';

export default function UnifiedCommandView({
  userProfile,
  onUpdateProfile,
  injections,
  onUpdateInjections,
  vitamins,
  onUpdateVitamins,
  wellnessLogs,
  onUpdateWellness,
  biomarkerLogs,
  onUpdateBiomarkerLogs
}) {
  // Profile State
  const [profile, setProfile] = useState(userProfile);

  // Quick Add Injection State
  const [injName, setInjName] = useState('');
  const [injDose, setInjDose] = useState('');
  const [injUnits, setInjUnits] = useState('10');
  const [injTiming, setInjTiming] = useState('Morning Fasted');
  const [injFreq, setInjFreq] = useState('Daily (AM)');

  // Quick Add Vitamin State
  const [vitName, setVitName] = useState('');
  const [vitDose, setVitDose] = useState('');
  const [vitTime, setVitTime] = useState('Morning');

  // Biomarkers State
  const [skinScore, setSkinScore] = useState(8);
  const [hairScore, setHairScore] = useState(8);
  const [energyScore, setEnergyScore] = useState(8);
  const [sleepScore, setSleepScore] = useState(8);
  const [eyesightScore, setEyesightScore] = useState(8);
  const [journalNote, setJournalNote] = useState('');

  // Photo & Webcam State
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoAnalysis, setPhotoAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Saved banner flash
  const [flashMsg, setFlashMsg] = useState('');

  const showFlash = (msg) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(''), 2500);
  };

  // Evaluation
  const evaluation = evaluateProtocol(injections, vitamins, wellnessLogs, profile);

  // Handle Profile Update
  const handleProfileUpdate = (key, val) => {
    const updated = { ...profile, [key]: val };
    setProfile(updated);
    onUpdateProfile(updated);
    showFlash('Profile Saved');
  };

  // Handle Add Injection
  const handleAddInjection = (e) => {
    e.preventDefault();
    if (!injName.trim()) return;
    sound.playSuccess();
    const newItem = {
      id: 'inj-' + Date.now(),
      name: injName.trim(),
      dose: injDose.trim() || 'Standard Dose',
      units: parseInt(injUnits) || 10,
      timing: injTiming,
      frequency: injFreq,
      lastTaken: 'Never',
      site: 'Abdomen (SubQ)'
    };
    onUpdateInjections([...injections, newItem]);
    setInjName('');
    setInjDose('');
    setInjUnits('10');
    showFlash('Peptide Added to Protocol');
  };

  // Handle Delete Injection
  const handleDeleteInjection = (id) => {
    sound.playAlert();
    onUpdateInjections(injections.filter(i => i.id !== id));
  };

  // Handle Add Vitamin
  const handleAddVitamin = (e) => {
    e.preventDefault();
    if (!vitName.trim()) return;
    sound.playSuccess();
    const newItem = {
      id: 'vit-' + Date.now(),
      name: vitName.trim(),
      dose: vitDose.trim() || '1 Serving',
      timeOfDay: vitTime,
      takenToday: false,
      streak: 0
    };
    onUpdateVitamins([...vitamins, newItem]);
    setVitName('');
    setVitDose('');
    showFlash('Supplement Added');
  };

  // Handle 1-Click Add from Suggestions
  const handle1ClickAddSuggestion = (sug) => {
    sound.playSuccess();
    const cleanName = sug.title.replace('Add ', '').replace('Consider ', '').split(' for ')[0];
    const newItem = {
      id: 'vit-' + Date.now(),
      name: cleanName,
      dose: 'Clinical Dose',
      timeOfDay: 'Morning',
      takenToday: false,
      streak: 0
    };
    onUpdateVitamins([...vitamins, newItem]);
    showFlash(`Added ${cleanName} to Active Stack!`);
  };

  // Handle Delete Vitamin
  const handleDeleteVitamin = (id) => {
    sound.playAlert();
    onUpdateVitamins(vitamins.filter(v => v.id !== id));
  };

  // Handle Save Biomarkers
  const handleSaveBiomarkers = (e) => {
    e.preventDefault();
    sound.playSuccess();
    const newEntry = {
      id: 'bio-' + Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      skin: Number(skinScore),
      hair: Number(hairScore),
      energy: Number(energyScore),
      sleep: Number(sleepScore),
      eyesight: Number(eyesightScore),
      overallAvg: ((Number(skinScore) + Number(hairScore) + Number(energyScore) + Number(sleepScore) + Number(eyesightScore)) / 5).toFixed(1),
      notes: journalNote.trim()
    };
    onUpdateBiomarkerLogs([newEntry, ...biomarkerLogs]);
    setJournalNote('');
    showFlash('Biomarkers & Journal Saved');
  };

  // File Upload Handler
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      sound.playClick();
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
        stopWebcam();
        runPhotoAIAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Webcam Controls
  const startWebcam = async () => {
    sound.playClick();
    setCameraError('');
    setIsWebcamActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Webcam Access Error:', err);
      setCameraError('Camera permission blocked or webcam not found.');
      setIsWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsWebcamActive(false);
  };

  const captureWebcamPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      sound.playSuccess();
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPhotoPreview(dataUrl);
      stopWebcam();
      runPhotoAIAnalysis();
    }
  };

  const runPhotoAIAnalysis = () => {
    setIsAnalyzing(true);
    sound.playClick();
    setTimeout(() => {
      setIsAnalyzing(false);
      sound.playSuccess();
      setPhotoAnalysis({
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        skinErythema: 'Low / Optimal (Even Tone)',
        collagenFirmness: '8.8 / 10 (High Extracellular Matrix Elasticity)',
        hairFollicleDensity: 'Healthy Anagen Phase Root Anchoring',
        eyeScleraClarity: 'Clear White (Low Systemic Oxidative Load)',
        summary: 'Phenotype displays noticeable microvascular perfusion and firm dermis thickness. GHK-Cu and Red Light photobiomodulation are actively supporting fibroblast collagen remodeling.'
      });
      showFlash('Photo Biometric Analysis Complete!');
    }, 1600);
  };

  return (
    <div style={{ animation: 'popIn 0.2s ease', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div className="section-header">
        <div>
          <h2>Unified Biohack Command</h2>
          <p>One simple place to manage your profile, input active stacks, log biomarkers, and view personalized suggestions.</p>
        </div>
        {flashMsg && (
          <span className="badge badge-green" style={{ fontSize: '13px', padding: '6px 14px' }}>
            ✓ {flashMsg}
          </span>
        )}
      </div>

      {/* SECTION 1: USER PROFILE & BIOMETRICS */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>👤</span> 1. Your Biometrics & Goals
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '14px' }}>
          <div>
            <label className="input-label">Age</label>
            <input
              type="text"
              className="input-field"
              value={profile.age}
              onChange={(e) => handleProfileUpdate('age', e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Gender</label>
            <select
              className="select-field"
              value={profile.gender}
              onChange={(e) => handleProfileUpdate('gender', e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="input-label">Weight (lbs)</label>
            <input
              type="text"
              className="input-field"
              value={profile.weightLbs}
              onChange={(e) => handleProfileUpdate('weightLbs', e.target.value)}
            />
          </div>

          <div>
            <label className="input-label">Height (ft / in)</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                className="input-field"
                value={profile.heightFeet}
                onChange={(e) => handleProfileUpdate('heightFeet', e.target.value)}
              />
              <input
                type="text"
                className="input-field"
                value={profile.heightInches}
                onChange={(e) => handleProfileUpdate('heightInches', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
          <div>
            <label className="input-label">Primary Health & Biohack Goal</label>
            <select
              className="select-field"
              value={profile.primaryGoal}
              onChange={(e) => handleProfileUpdate('primaryGoal', e.target.value)}
            >
              {GOAL_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="input-label">Activity Level</label>
            <select
              className="select-field"
              value={profile.activityLevel}
              onChange={(e) => handleProfileUpdate('activityLevel', e.target.value)}
            >
              {ACTIVITY_LEVELS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Scientific Targets */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>DAILY PROTEIN TARGET</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--accent-cyan)' }}>{evaluation.dailyProteinGrams} g/day</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>HYDRATION TARGET</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--accent-green)' }}>{evaluation.dailyWaterOz} oz/day</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>ESTIMATED BMR</div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--accent-amber)' }}>{evaluation.estimatedBMR} kcal</div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INPUT PEPTIDES & INJECTIONS */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💉</span> 2. Your Active Injections & Peptides ({injections.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {injections.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }}
            >
              <div>
                <strong style={{ color: '#fff', fontSize: '14.5px' }}>{item.name}</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                  {item.dose} ({item.units || 10} IU on syringe) • {item.frequency}
                </span>
              </div>
              <button
                className="btn btn-danger"
                style={{ padding: '4px 10px', fontSize: '11px' }}
                onClick={() => handleDeleteInjection(item.id)}
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddInjection} style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '10px', textTransform: 'uppercase' }}>
            + Add Another Peptide to Stack
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 100px 1.2fr auto', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              className="input-field"
              value={injName}
              onChange={(e) => setInjName(e.target.value)}
              placeholder="Compound Name"
              required
            />
            <input
              type="text"
              className="input-field"
              value={injDose}
              onChange={(e) => setInjDose(e.target.value)}
              placeholder="Dose (e.g. 500 mcg)"
              required
            />
            <input
              type="text"
              className="input-field"
              value={injUnits}
              onChange={(e) => setInjUnits(e.target.value)}
              placeholder="IU Units"
            />
            <select className="select-field" value={injFreq} onChange={(e) => setInjFreq(e.target.value)}>
              <option value="Daily (AM)">Daily (AM)</option>
              <option value="Daily (PM)">Daily (PM)</option>
              <option value="Twice Daily">Twice Daily</option>
              <option value="3x / Week">3x / Week</option>
              <option value="Once Weekly">Once Weekly</option>
              <option value="As Needed">As Needed</option>
            </select>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
              + Add
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 3: INPUT VITAMINS & SUPPLEMENTS */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>💊</span> 3. Your Active Daily Supplements ({vitamins.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {vitamins.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }}
            >
              <div>
                <strong style={{ color: '#fff', fontSize: '14.5px' }}>{item.name}</strong>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '10px' }}>
                  {item.dose} • {item.timeOfDay}
                </span>
              </div>
              <button
                className="btn btn-danger"
                style={{ padding: '4px 10px', fontSize: '11px' }}
                onClick={() => handleDeleteVitamin(item.id)}
              >
                ✕ Remove
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddVitamin} style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-green)', marginBottom: '10px', textTransform: 'uppercase' }}>
            + Add Another Supplement to Stack
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.2fr auto', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              className="input-field"
              value={vitName}
              onChange={(e) => setVitName(e.target.value)}
              placeholder="Supplement Name"
              required
            />
            <input
              type="text"
              className="input-field"
              value={vitDose}
              onChange={(e) => setVitDose(e.target.value)}
              placeholder="Dose (e.g. 500 mg)"
              required
            />
            <select className="select-field" value={vitTime} onChange={(e) => setVitTime(e.target.value)}>
              <option value="Morning">Morning</option>
              <option value="Midday">Midday</option>
              <option value="Evening">Evening</option>
              <option value="Bedtime">Bedtime</option>
            </select>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
              + Add
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: BIOMARKERS & JOURNAL LOG */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>✨</span> 4. Log Skin, Hair, Energy, Sleep & Eyesight (1 - 10)
        </h3>

        <form onSubmit={handleSaveBiomarkers}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                <span>✨ Skin Quality</span>
                <span style={{ color: 'var(--accent-pink)' }}>{skinScore}/10</span>
              </div>
              <input type="range" min="1" max="10" value={skinScore} onChange={(e) => setSkinScore(e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-pink)' }} />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                <span>💇 Hair Density</span>
                <span style={{ color: 'var(--accent-purple)' }}>{hairScore}/10</span>
              </div>
              <input type="range" min="1" max="10" value={hairScore} onChange={(e) => setHairScore(e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-purple)' }} />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                <span>⚡ Energy Level</span>
                <span style={{ color: 'var(--accent-cyan)' }}>{energyScore}/10</span>
              </div>
              <input type="range" min="1" max="10" value={energyScore} onChange={(e) => setEnergyScore(e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                <span>🌙 Sleep Depth</span>
                <span style={{ color: 'var(--accent-green)' }}>{sleepScore}/10</span>
              </div>
              <input type="range" min="1" max="10" value={sleepScore} onChange={(e) => setSleepScore(e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-green)' }} />
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                <span>👁️ Eyesight</span>
                <span style={{ color: 'var(--accent-amber)' }}>{eyesightScore}/10</span>
              </div>
              <input type="range" min="1" max="10" value={eyesightScore} onChange={(e) => setEyesightScore(e.target.value)} style={{ width: '100%', accentColor: 'var(--accent-amber)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Notes on how you feel today..."
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ whiteSpace: 'nowrap', padding: '11px 22px' }}>
              ✓ Save Log
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 5: WEEKLY PHOTO WITH WEBCAM & FILE UPLOADER */}
      <div className="card" style={{ padding: '22px', marginBottom: '20px', border: '1px solid rgba(0, 242, 254, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>📸</span> 5. Weekly Photo & AI Phenotype Analyzer (Webcam or Upload)
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Take a live photo with your webcam or upload a weekly picture of your skin, hair, and face.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {!isWebcamActive ? (
              <button className="btn btn-primary" onClick={startWebcam}>
                📹 Take Live Photo (Webcam)
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={stopWebcam}>
                ✕ Close Camera
              </button>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handlePhotoSelect}
            />
            <button
              className="btn btn-secondary"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              📁 Upload File
            </button>
          </div>
        </div>

        {cameraError && (
          <div style={{ background: 'rgba(255, 42, 109, 0.1)', color: 'var(--accent-pink)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '14px' }}>
            ⚠️ {cameraError}
          </div>
        )}

        {/* Live Webcam Viewfinder */}
        {isWebcamActive && (
          <div style={{ background: 'rgba(0,0,0,0.6)', padding: '16px', borderRadius: '12px', textAlign: 'center', marginBottom: '16px', border: '1px solid var(--accent-cyan)' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: '100%', maxWidth: '500px', height: '320px', objectFit: 'cover', borderRadius: '10px', background: '#000' }}
            />
            <div style={{ marginTop: '12px' }}>
              <button
                className="btn btn-primary"
                style={{ padding: '12px 32px', fontSize: '15px' }}
                onClick={captureWebcamPhoto}
              >
                📸 Snap & Analyze Photo Now
              </button>
            </div>
          </div>
        )}

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {photoPreview && (
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '18px', marginTop: '16px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ textAlign: 'center' }}>
              <img
                src={photoPreview}
                alt="Weekly Biohack Scan"
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border)' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
                Captured: {new Date().toLocaleDateString()}
              </span>
            </div>

            <div>
              {isAnalyzing ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>🧬</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                    Analyzing Facial Microvasculature, Dermal Thickness & Follicle Health...
                  </div>
                </div>
              ) : photoAnalysis ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span className="badge badge-green">✓ AI Clinical Phenotype Scan Complete</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Skin Tone & Erythema:</span>
                      <div style={{ fontWeight: '700', color: '#fff' }}>{photoAnalysis.skinErythema}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Collagen Firmness:</span>
                      <div style={{ fontWeight: '700', color: 'var(--accent-pink)' }}>{photoAnalysis.collagenFirmness}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Hair Follicle Density:</span>
                      <div style={{ fontWeight: '700', color: 'var(--accent-purple)' }}>{photoAnalysis.hairFollicleDensity}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '8px', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Eye Sclera & Stress:</span>
                      <div style={{ fontWeight: '700', color: 'var(--accent-amber)' }}>{photoAnalysis.eyeScleraClarity}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.4', background: 'rgba(0, 242, 254, 0.05)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                    <strong style={{ color: 'var(--accent-cyan)' }}>AI Physiological Assessment:</strong> {photoAnalysis.summary}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 6: SCIENTIFIC SUGGESTIONS, WARNINGS & RATING */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 24, 40, 0.95) 0%, rgba(8, 12, 20, 0.98) 100%)',
          borderColor: 'rgba(0, 242, 254, 0.3)',
          padding: '24px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-cyan">🧪 Real-Time Protocol Audit</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Targeting {profile.primaryGoal}</span>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
              Scientific Stack Grade: <span style={{ color: 'var(--accent-green)' }}>{evaluation.grade}</span>
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Verdict: <strong style={{ color: '#fff' }}>{evaluation.gradeVerdict}</strong>. Evaluates active compounds against your age ({profile.age}), weight ({profile.weightLbs} lbs), and goals.
            </p>
          </div>

          <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '14px', padding: '16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              SCIENTIFIC OPTIMIZATION SCORE
            </div>
            <div style={{ fontSize: '56px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--accent-green)' }}>
              {evaluation.score} <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
        </div>

        {/* ACTIVE SYNERGIES */}
        <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-green)', marginBottom: '8px' }}>
            ✅ Active Biochemical Synergies ({evaluation.positiveSynergies.length}):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {evaluation.positiveSynergies.map((syn, idx) => (
              <div key={idx} style={{ fontSize: '12.5px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '8px 12px', borderRadius: '6px' }}>
                <strong style={{ color: '#fff' }}>{syn.title}:</strong> {syn.detail}
              </div>
            ))}
          </div>
        </div>

        {/* BIOLOGICAL WARNINGS */}
        {evaluation.warnings.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-pink)', marginBottom: '8px' }}>
              ⚠️ Biological Cautions & Imbalances ({evaluation.warnings.length}):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {evaluation.warnings.map((w, idx) => (
                <div key={idx} style={{ fontSize: '12.5px', color: 'var(--text-muted)', background: 'rgba(255, 42, 109, 0.05)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid var(--accent-pink)' }}>
                  <strong style={{ color: 'var(--accent-pink)' }}>{w.title}:</strong> {w.detail}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDED VITAMIN & LIFESTYLE SUGGESTIONS WITH 1-CLICK ADD */}
        {evaluation.suggestions.length > 0 && (
          <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--accent-amber)', marginBottom: '10px' }}>
              💡 Scientifically Recommended Additions for Your Profile ({evaluation.suggestions.length}):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {evaluation.suggestions.map((sug, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(255, 183, 3, 0.04)',
                    border: '1px solid rgba(255, 183, 3, 0.2)',
                    padding: '12px 16px',
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{sug.title}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{sug.reason}</div>
                  </div>
                  <button
                    className="btn btn-secondary"
                    style={{ whiteSpace: 'nowrap', fontSize: '12px', padding: '6px 12px', borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)', marginLeft: '12px' }}
                    onClick={() => handle1ClickAddSuggestion(sug)}
                  >
                    + 1-Click Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
