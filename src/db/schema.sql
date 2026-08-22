-- Longevity Architect Relational Schema
-- Captures high-resolution health telemetry, female longevity tracking,
-- protocol adherence, and pharmacokinetic decay parameters.

-- 1. Master Users Table
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  biological_age_baseline DECIMAL(4,1) NOT NULL,
  chronological_age INTEGER DEFAULT 37,
  cycle_length INTEGER DEFAULT 28,
  primary_goals TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Peptides & Pharmacokinetic Decay Parameters
CREATE TABLE IF NOT EXISTS peptides (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  reconstitution_vol DECIMAL(5,2) NOT NULL,
  concentration DECIMAL(8,2) NOT NULL,
  half_life_hours DECIMAL(6,2) NOT NULL,
  decay_lambda DECIMAL(8,5) NOT NULL, -- lambda = ln(2) / half_life_hours
  absorption_weight DECIMAL(4,2) DEFAULT 1.0, -- w_1 in decay integral
  category TEXT NOT NULL
);

-- 3. Active Protocol Schedules
CREATE TABLE IF NOT EXISTS protocols (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  peptide_id TEXT NOT NULL,
  dose_mcg INTEGER NOT NULL,
  frequency TEXT NOT NULL,
  cycle_days_on INTEGER DEFAULT 5,
  cycle_days_off INTEGER DEFAULT 2,
  start_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(peptide_id) REFERENCES peptides(id)
);

-- 4. Daily Execution & Adherence Logs
CREATE TABLE IF NOT EXISTS daily_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  protocol_id TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  dose_taken BOOLEAN DEFAULT TRUE,
  actual_dose_mcg INTEGER NOT NULL,
  site TEXT NOT NULL,
  cycle_day INTEGER, -- Added for cycle tracking
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(protocol_id) REFERENCES protocols(id)
);

-- 5. Passive Wearable Biometrics Telemetry
CREATE TABLE IF NOT EXISTS biometrics (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  hrv INTEGER NOT NULL,
  resting_hr INTEGER NOT NULL,
  sleep_score INTEGER NOT NULL,
  deep_sleep_pct DECIMAL(4,1) NOT NULL,
  recovery_index INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

-- 6. Subjective Wellness (Formerly Assessments)
CREATE TABLE IF NOT EXISTS subjective_wellness (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  energy_rating INTEGER CHECK(energy_rating BETWEEN 1 AND 10),
  mood_rating INTEGER CHECK(mood_rating BETWEEN 1 AND 10),
  brain_fog INTEGER CHECK(brain_fog BETWEEN 1 AND 10),
  libido INTEGER CHECK(libido BETWEEN 1 AND 10),
  joint_health INTEGER CHECK(joint_health BETWEEN 1 AND 10),
  notes TEXT,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

-- 7. Biomarkers Lab (NEW)
CREATE TABLE IF NOT EXISTS biomarkers_lab (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  estradiol DECIMAL(6,2),
  progesterone DECIMAL(6,2),
  testosterone DECIMAL(6,2),
  dhea_s DECIMAL(6,2),
  igf_1 DECIMAL(6,2),
  notes TEXT,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);
