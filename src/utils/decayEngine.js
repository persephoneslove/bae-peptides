/**
 * Pharmacokinetic Compound Decay Integral Engine & Advanced Physiological Insights
 *
 * Implements:
 * E(t) = ∫[0 to t] (w1 * P(τ) + w2 * V(τ)) * e^(-λ * (t - τ)) dτ
 *
 * Where:
 * - P(τ) = Peptide dose administered at time τ
 * - V(τ) = Vitamin dose administered at time τ
 * - w1, w2 = Bioavailability / absorption weights
 * - λ = ln(2) / t_half = Biological elimination rate constant
 */

export const MASTER_PHARMACOKINETICS = {
  'bpc-157': { name: 'BPC-157', halfLifeHours: 4.0, weight: 1.0, category: 'Tissue Angiogenesis' },
  'tb-500': { name: 'TB-500', halfLifeHours: 48.0, weight: 0.95, category: 'Actin Cytoskeleton' },
  'klow': { name: 'KLOW Blend', halfLifeHours: 12.0, weight: 1.1, category: 'Cellular Rejuvenation' },
  'ss-31': { name: 'SS-31 (Elamipretide)', halfLifeHours: 4.5, weight: 1.05, category: 'Cardiolipin ATP' },
  'mots-c': { name: 'MOTS-c', halfLifeHours: 4.0, weight: 1.0, category: 'Mitochondrial Biogenesis' },
  'retatrutide': { name: 'Retatrutide', halfLifeHours: 144.0, weight: 1.2, category: 'Triple Agonist' },
  'tirzepatide': { name: 'Tirzepatide', halfLifeHours: 120.0, weight: 1.15, category: 'Dual Agonist' },
  'semaglutide': { name: 'Semaglutide', halfLifeHours: 168.0, weight: 1.0, category: 'GLP-1' },
  'epithalon': { name: 'Epithalon', halfLifeHours: 2.5, weight: 1.0, category: 'Telomerase' },
  'cjc-1295': { name: 'CJC-1295 (No DAC)', halfLifeHours: 0.5, weight: 1.0, category: 'GHRH Secretagogue' },
  'ipamorelin': { name: 'Ipamorelin', halfLifeHours: 2.0, weight: 1.0, category: 'GHRP' },
  'ghk-cu': { name: 'GHK-Cu', halfLifeHours: 1.0, weight: 0.9, category: 'Collagen Decorin' },
  'kpv': { name: 'KPV', halfLifeHours: 2.0, weight: 1.0, category: 'Anti-Inflammatory' },
  'pt-141': { name: 'PT-141 (Bremelanotide)', halfLifeHours: 2.7, weight: 1.1, category: 'Melanocortin Libido' },
  'kisspeptin-10': { name: 'Kisspeptin-10', halfLifeHours: 0.8, weight: 1.0, category: 'LH/FSH GnRH' },
  'melanotan ii': { name: 'Melanotan II', halfLifeHours: 1.5, weight: 1.05, category: 'Melanogenesis & Libido' },
  '5-amino-1mq': { name: '5-Amino-1MQ', halfLifeHours: 6.0, weight: 1.0, category: 'NNMT Inhibitor' },
  'semax': { name: 'Semax', halfLifeHours: 0.5, weight: 1.0, category: 'BDNF Nootropic' },
  'selank': { name: 'Selank', halfLifeHours: 0.4, weight: 1.0, category: 'Anxiolytic Nootropic' },
  'nad': { name: 'NAD+ (SubQ)', halfLifeHours: 3.0, weight: 1.0, category: 'PARP & Sirtuins' },
  'standard_vitamin': { name: 'Nutraceutical Compound', halfLifeHours: 8.0, weight: 0.8, category: 'Cofactor' }
};

/**
 * Calculates biological decay rate constant λ = ln(2) / t_1/2
 */
export function getDecayLambda(halfLifeHours) {
  if (!halfLifeHours || halfLifeHours <= 0) return 0.1;
  return Math.LN2 / halfLifeHours;
}

/**
 * Calculates current accumulated efficacy E(t) across all past administrations
 * Dynamically accommodates custom compounds
 */
export function calculateAccumulatedEfficacy(administrationLogs = [], currentTime = Date.now(), customPeptides = []) {
  let totalEfficacy = 0;
  const compoundBreakdowns = {};

  const nowMs = typeof currentTime === 'number' ? currentTime : new Date(currentTime).getTime();

  // Build combined lookup
  const customMap = {};
  if (Array.isArray(customPeptides)) {
    customPeptides.forEach(p => {
      const key = (p.name || '').toLowerCase();
      customMap[key] = {
        name: p.name,
        halfLifeHours: parseFloat(p.half_life_hours) || 6.0,
        weight: parseFloat(p.absorption_weight) || 1.0,
        category: p.category || 'Custom Formulation'
      };
    });
  }

  administrationLogs.forEach((log) => {
    const logTimeMs = new Date(log.timestamp).getTime();
    const elapsedHours = (nowMs - logTimeMs) / (1000 * 60 * 60);

    if (elapsedHours >= 0) {
      const compoundKey = (log.compoundKey || log.name || 'bpc-157').toLowerCase();
      
      // Match from MASTER, or customMap, or fallback heuristic
      let meta = MASTER_PHARMACOKINETICS[compoundKey];
      if (!meta) {
        // Try substring match in master
        const matchedKey = Object.keys(MASTER_PHARMACOKINETICS).find(k => compoundKey.includes(k));
        if (matchedKey) meta = MASTER_PHARMACOKINETICS[matchedKey];
      }
      if (!meta && customMap[compoundKey]) {
        meta = customMap[compoundKey];
      }
      if (!meta) {
        meta = { name: log.name || 'Bioactive Compound', halfLifeHours: 6.0, weight: 1.0, category: 'Targeted Protocol' };
      }

      const lambda = getDecayLambda(meta.halfLifeHours);
      const dose = parseFloat(log.actual_dose_mcg || log.dose || 250);
      const weight = meta.weight || 1.0;

      // E(t) contribution from this discrete administration
      const contribution = weight * dose * Math.exp(-lambda * elapsedHours);

      totalEfficacy += contribution;

      if (!compoundBreakdowns[meta.name]) {
        compoundBreakdowns[meta.name] = {
          currentActiveMcg: 0,
          halfLifeHours: meta.halfLifeHours,
          category: meta.category
        };
      }
      compoundBreakdowns[meta.name].currentActiveMcg += contribution;
    }
  });

  return {
    totalEfficacyScore: Math.round(totalEfficacy),
    compoundBreakdowns
  };
}

/**
 * Analyzes rolling 3-day autonomic trends and triggers alert if nervous system is strained
 */
export function analyzeAutonomicCorrelation(biometrics = [], wellness = []) {
  if (biometrics.length < 3 || wellness.length < 3) {
    return {
      alertTriggered: false,
      status: 'Collecting Baseline Telemetry (Need 3+ days)',
      rollingHrvDelta: 0,
      rollingEnergyDelta: 0
    };
  }

  // Calculate 3-day rolling HRV
  const recentBiometrics = biometrics.slice(0, 3);
  const baselineBiometrics = biometrics.slice(3, 6);

  const avgRecentHrv = recentBiometrics.reduce((acc, b) => acc + (b.hrv || 65), 0) / recentBiometrics.length;
  const avgBaseHrv = baselineBiometrics.length > 0
    ? baselineBiometrics.reduce((acc, b) => acc + (b.hrv || 65), 0) / baselineBiometrics.length
    : avgRecentHrv;

  const hrvDeltaPct = avgBaseHrv > 0 ? ((avgRecentHrv - avgBaseHrv) / avgBaseHrv) * 100 : 0;

  // Calculate 3-day rolling subjective energy
  const recentWellness = wellness.slice(0, 3);
  const baselineWellness = wellness.slice(3, 6);

  const avgRecentEnergy = recentWellness.reduce((acc, a) => acc + (a.energy_rating || 7), 0) / recentWellness.length;
  const avgBaseEnergy = baselineWellness.length > 0
    ? baselineWellness.reduce((acc, a) => acc + (a.energy_rating || 7), 0) / baselineWellness.length
    : avgRecentEnergy;

  const energyDelta = avgRecentEnergy - avgBaseEnergy;

  // Trigger: HRV drops > 12% AND subjective energy dips > 1.5 points
  const alertTriggered = hrvDeltaPct <= -12 && energyDelta <= -1.5;

  return {
    alertTriggered,
    status: alertTriggered ? '⚠️ Autonomic Overdrive Alert' : '✅ Autonomic Stability Optimal',
    avgRecentHrv: Math.round(avgRecentHrv),
    hrvDeltaPct: hrvDeltaPct.toFixed(1),
    avgRecentEnergy: avgRecentEnergy.toFixed(1),
    energyDelta: energyDelta.toFixed(1),
    recommendation: alertTriggered
      ? 'Sympathetic nervous system over-activation detected. 48-Hour Protocol Pause recommended with photobiomodulation & restorative magnesium.'
      : 'Autonomic nervous system in optimal homeostatic equilibrium.'
  };
}

/**
 * Enhanced: Analyzes subjective wellness against cycle_day, active protocols, libido, orgasm strength, and skin sensitivity
 */
export function analyzeHormoneCorrelation(wellness = [], cycleData = null, activeProtocols = []) {
  let lutealDipDetected = false;
  let suggestion = 'Your hormonal fluctuations and protocol responses are well-balanced. Continue tracking.';
  let libidoTrend = { avg: 7.0, status: 'Balanced', insight: 'Libido within baseline.' };
  let orgasmTrend = { avg: 7.5, status: 'Optimal', insight: 'Orgasm intensity optimal.' };
  let skinReactionAlert = null;

  if (wellness.length > 0) {
    // 1. Calculate Average Libido & Orgasm Strength
    const validLibidoLogs = wellness.filter(w => typeof w.libido === 'number');
    const validOrgasmLogs = wellness.filter(w => typeof w.orgasm_strength === 'number');

    const avgLibido = validLibidoLogs.length > 0
      ? validLibidoLogs.reduce((acc, w) => acc + w.libido, 0) / validLibidoLogs.length
      : 7;
    const avgOrgasm = validOrgasmLogs.length > 0
      ? validOrgasmLogs.reduce((acc, w) => acc + w.orgasm_strength, 0) / validOrgasmLogs.length
      : 7.5;

    // Phase Correlation with Cycle Day
    const currentDay = cycleData?.currentDay || 14;
    const isOvulatory = currentDay >= 12 && currentDay <= 16;
    const isLuteal = currentDay > 16 && currentDay <= 28;
    const isFollicular = currentDay >= 1 && currentDay < 12;

    // Check for Sexual Health Peptides in stack (PT-141, Kisspeptin, Melanotan II)
    const hasSexualHealthPeptide = activeProtocols.some(p => {
      const name = (p.name || '').toLowerCase();
      return name.includes('pt-141') || name.includes('kisspeptin') || name.includes('melanotan') || name.includes('bremelanotide');
    });

    if (isOvulatory) {
      if (avgLibido >= 8) {
        libidoTrend = {
          avg: avgLibido.toFixed(1),
          status: 'Peak Ovulatory Vitality 🔥',
          insight: 'Estrogen surge around Cycle Day ' + currentDay + ' is aligning with peak endogenous libido and receptor responsiveness.'
        };
      } else {
        libidoTrend = {
          avg: avgLibido.toFixed(1),
          status: 'Moderate Ovulatory Response',
          insight: 'Cycle Day ' + currentDay + ' typically exhibits peak libido; assess if elevated cortisol or fatigue is attenuating the estrogen surge.'
        };
      }
    } else if (isLuteal) {
      if (avgLibido <= 5) {
        libidoTrend = {
          avg: avgLibido.toFixed(1),
          status: 'Progesterone Luteal Shift',
          insight: 'Natural shift toward progesterone dominance post-ovulation (Cycle Day ' + currentDay + '). Focus on nourishment and recovery.'
        };
      } else {
        libidoTrend = {
          avg: avgLibido.toFixed(1),
          status: 'High Sustained Vitality',
          insight: 'Sustained vitality and libido during the luteal phase (Cycle Day ' + currentDay + ') indicates optimal adrenal and hormonal reserves.'
        };
      }
    } else {
      libidoTrend = {
        avg: avgLibido.toFixed(1),
        status: 'Follicular Rebuilding Phase',
        insight: 'Estrogen rising steadily (Cycle Day ' + currentDay + '). Cellular energy and receptivity are climbing.'
      };
    }

    if (hasSexualHealthPeptide) {
      orgasmTrend = {
        avg: avgOrgasm.toFixed(1),
        status: 'Melanocortin Enhanced ✨',
        insight: 'Central melanocortin MC3/MC4 activation or GnRH pulsatility from your active stack is amplifying pelvic blood flow and autonomic sensitivity.'
      };
    } else {
      orgasmTrend = {
        avg: avgOrgasm.toFixed(1),
        status: 'Endogenous Baseline (' + avgOrgasm.toFixed(1) + '/10)',
        insight: 'Physical sensations and neural response remain consistent with menstrual phase telemetry.'
      };
    }

    // 2. Skin Sensitivity & Tactile Telemetry
    const recentSensitivityLogs = wellness.slice(0, 5).filter(w => w.skin_sensitivity && !w.skin_sensitivity.toLowerCase().includes('normal'));
    if (recentSensitivityLogs.length > 0) {
      const latestReaction = recentSensitivityLogs[0].skin_sensitivity;
      skinReactionAlert = {
        reaction: latestReaction,
        count: recentSensitivityLogs.length,
        recommendation: 'Recent telemetry reports: "' + latestReaction + '". If using concentrated SubQ peptides (such as GHK-Cu or KPV), consider diluting with an additional 0.5 mL bacteriostatic water or rotating to vastus lateralis / deltoid tissue.'
      };
    }

    // 3. Luteal Phase suggestions
    if (wellness.length >= 3 && isLuteal) {
      const avgRecentEnergy = wellness.slice(0, 3).reduce((acc, a) => acc + (a.energy_rating || 7), 0) / 3;
      const avgRecentMood = wellness.slice(0, 3).reduce((acc, a) => acc + (a.mood_rating || 7), 0) / 3;
      if (avgRecentEnergy < 6.5 || avgRecentMood < 6.5) {
        lutealDipDetected = true;
        suggestion = 'Your energy and mood show a slight dip, characteristic of the luteal phase (post-ovulation rise in progesterone). Consider front-loading your carbohydrates earlier in the day, adding 400mg of Magnesium Glycinate, and slightly reducing high-intensity workouts in favor of zone 2 cardio or yoga to support this natural fluctuation.';
      }
    }
  }

  return {
    lutealDipDetected,
    suggestion,
    libidoTrend,
    orgasmTrend,
    skinReactionAlert
  };
}

/**
 * Blends subjective wellness with protocol adherence to provide a Vitality Score.
 */
export function calculateVitalityScore(wellness = [], dailyLogs = [], requiredDoses = 3) {
  let baseScore = 75; // Baseline healthy score
  
  if (wellness.length > 0) {
    const latest = wellness[0];
    const wellnessAvg = ((latest.energy_rating || 7) + (latest.mood_rating || 7) + (10 - (latest.brain_fog || 2))) / 3;
    // Scale wellness out of 50
    baseScore = (wellnessAvg / 10) * 50; 
  }

  // Check today's adherence
  let adherencePoints = 0;
  const todayLogs = dailyLogs.filter(log => new Date(log.timestamp).toDateString() === new Date().toDateString());
  if (todayLogs.length >= requiredDoses) {
    adherencePoints = 45; // Max 45 points for perfect adherence
  } else if (todayLogs.length > 0) {
    adherencePoints = (todayLogs.length / requiredDoses) * 45;
  }

  let totalScore = Math.min(100, Math.round(baseScore + adherencePoints));
  if (totalScore < 10) totalScore = 10; // Floor

  let message = 'You are doing great. Keep up the protocols.';
  if (totalScore >= 90) message = 'Exceptional vitality and adherence! Your cellular environment is highly optimized today.';
  else if (totalScore < 70) message = 'Your vitality score is slightly low. Ensure you complete your protocols and prioritize restorative sleep tonight.';

  return {
    score: totalScore,
    message
  };
}

/**
 * Evaluates adaptive cycle durations and identifies diminishing returns and active lifecycle tracking
 */
export function evaluateAdaptiveCycles(activeProtocols = []) {
  const cycleAlerts = [];
  const cycleLifecycles = [];

  activeProtocols.forEach((proto) => {
    // Calculate days elapsed from start_date if available
    let daysActive = proto.consecutiveDaysActive || 14;
    if (proto.start_date) {
      const startMs = new Date(proto.start_date).getTime();
      const nowMs = Date.now();
      const diffDays = Math.max(1, Math.floor((nowMs - startMs) / (1000 * 60 * 60 * 24)));
      if (!isNaN(diffDays)) daysActive = diffDays;
    }

    const duration = proto.cycle_duration || 30;
    const progressPct = Math.min(100, Math.round((daysActive / duration) * 100));
    const daysRemaining = Math.max(0, duration - daysActive);

    cycleLifecycles.push({
      id: proto.id,
      name: proto.name,
      startDate: proto.start_date || 'Active',
      durationDays: duration,
      daysElapsed: daysActive,
      daysRemaining,
      progressPct,
      cycleDaysOn: proto.cycle_days_on || 5,
      cycleDaysOff: proto.cycle_days_off || 2,
      isNearCompletion: daysActive >= (duration - 3)
    });

    const name = (proto.name || '').toLowerCase();

    // GH Secretagogues (CJC/Ipamorelin) > 8 weeks continuous
    if ((name.includes('cjc') || name.includes('ipamorelin') || name.includes('sermorelin')) && daysActive > 56) {
      cycleAlerts.push({
        compound: proto.name,
        type: 'Diminishing Returns (Pituitary Tachyphylaxis)',
        recommendation: '8+ weeks of continuous GHRH/GHRP agonism detected. Initiate a 14-day washout cycle or switch to 5-days-on / 2-days-off to resensitize somatotroph receptors.'
      });
    }

    // Epithalon > 20 days
    if (name.includes('epithalon') && daysActive > 20) {
      cycleAlerts.push({
        compound: proto.name,
        type: 'Cycle Completion (Pineal Telomerase Pulse)',
        recommendation: 'Epithalon telomeric course complete (10–20 days). Conclude protocol for 6 months to allow endogenous epigenetic stabilization.'
      });
    }

    // General Cycle duration exceeded
    if (daysActive > duration) {
      cycleAlerts.push({
        compound: proto.name,
        type: 'Protocol Cycle Duration Completed',
        recommendation: `Target cycle duration (${duration} days) has been reached (${daysActive} days elapsed). Evaluate biomarker logs and initiate a planned break/washout phase if recommended.`
      });
    }
  });

  return {
    cycleAlerts,
    cycleLifecycles
  };
}
