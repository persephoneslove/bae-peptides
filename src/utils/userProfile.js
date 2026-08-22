// User Biometric & Goals Storage Structure

export const DEFAULT_USER_PROFILE = {
  age: '32',
  gender: 'Male',
  weightLbs: '185',
  heightFeet: '5',
  heightInches: '11',
  activityLevel: 'Active (4-5 days/week training)',
  primaryGoal: 'Longevity & Cellular Repair',
  secondaryGoal: 'Lean Muscle & Fat Loss'
};

export const GOAL_OPTIONS = [
  'Longevity & Cellular Repair',
  'Rapid Tissue & Tendon Healing',
  'Mitochondrial ATP & Energy',
  'Lean Muscle & Fat Loss (Metabolic)',
  'Deep Sleep & GH Optimization',
  'Cognitive Focus & Nootropics',
  'Hormonal & Androgen Support'
];

export const ACTIVITY_LEVELS = [
  'Sedentary (Desk job, light walking)',
  'Moderate (2-3 workout sessions/week)',
  'Active (4-5 days/week intense training)',
  'Very Active / Athlete (Daily heavy training)'
];
