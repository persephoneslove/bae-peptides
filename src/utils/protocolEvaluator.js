// Scientific Protocol Evaluator with Biometric & Goal Alignment

export function evaluateProtocol(injections = [], vitamins = [], wellnessLogs = [], userProfile = {}) {
  const suggestions = [];
  const warnings = [];
  const positiveSynergies = [];
  const goalAlignments = [];

  const age = parseInt(userProfile.age) || 30;
  const weightLbs = parseFloat(userProfile.weightLbs) || 180;
  const heightFeet = parseInt(userProfile.heightFeet) || 5;
  const heightInches = parseInt(userProfile.heightInches) || 10;
  const totalInches = (heightFeet * 12) + heightInches;
  const primaryGoal = userProfile.primaryGoal || 'Longevity & Cellular Repair';
  const activityLevel = userProfile.activityLevel || 'Active (4-5 days/week training)';

  // Calculations: Protein Target, Water Target, Estimated BMR
  const dailyProteinGrams = Math.round(weightLbs * 1.0); // 1.0g per lb lean standard
  const dailyWaterOz = Math.round(weightLbs * 0.65); // 0.65 oz per lb
  const estimatedBMR = Math.round(10 * (weightLbs * 0.453592) + 6.25 * (totalInches * 2.54) - 5 * age + 5);

  // Combine all active compound names
  const allCompoundNames = [
    ...injections.map(i => (i.name || '').toLowerCase()),
    ...vitamins.map(v => (v.name || '').toLowerCase())
  ];

  const has = (keyword) => allCompoundNames.some(name => name.includes(keyword.toLowerCase()));

  let score = 70; // Base score

  // 1. GOAL ALIGNMENT ANALYSIS
  if (primaryGoal.includes('Tissue') || primaryGoal.includes('Healing')) {
    const hasRepair = has('bpc') || has('tb-500') || has('ghk') || has('klow');
    if (hasRepair) {
      score += 12;
      goalAlignments.push({
        goal: primaryGoal,
        status: 'Aligned',
        note: 'Your active repair peptides directly stimulate collagen synthesis, angiogenesis, and fibroblast migration.'
      });
    } else {
      suggestions.push({
        type: 'add',
        title: 'Add BPC-157 / TB-500 Blend for Tissue Healing',
        reason: `Your primary goal is ${primaryGoal}, but no dedicated tissue-repair peptides are active.`
      });
    }
  }

  if (primaryGoal.includes('Longevity') || primaryGoal.includes('Cellular')) {
    const hasLongevity = has('epithalon') || has('nad') || has('nmn') || has('klow') || has('ss-31');
    if (hasLongevity) {
      score += 12;
      goalAlignments.push({
        goal: primaryGoal,
        status: 'Aligned',
        note: 'Longevity pathways (telomerase activation, cardiolipin restoration, Sirtuins) are actively targeted.'
      });
    } else {
      suggestions.push({
        type: 'add',
        title: 'Add SS-31 or NMN for Longevity',
        reason: `Your goal is ${primaryGoal}. Incorporating mitochondrial and NAD+ precursors targets biological age.`
      });
    }
  }

  if (primaryGoal.includes('Mitochondrial') || primaryGoal.includes('Energy')) {
    const hasMito = has('ss-31') || has('mots-c') || has('coq10') || has('creatine');
    if (hasMito) {
      score += 12;
      goalAlignments.push({
        goal: primaryGoal,
        status: 'Aligned',
        note: 'Inner mitochondrial membrane (cardiolipin) and AMPK cellular energy signaling are reinforced.'
      });
    }
  }

  if (primaryGoal.includes('Fat Loss') || primaryGoal.includes('Metabolic')) {
    const hasMetabolic = has('retatrutide') || has('tirzepatide') || has('semaglutide') || has('aod') || has('berberine');
    if (hasMetabolic) {
      score += 12;
      goalAlignments.push({
        goal: primaryGoal,
        status: 'Aligned',
        note: 'GLP-1 / GIP / lipolytic receptors are stimulated for optimized insulin sensitivity and lipid oxidation.'
      });
    }
  }

  if (primaryGoal.includes('Sleep') || primaryGoal.includes('GH')) {
    const hasSleep = has('cjc') || has('ipamorelin') || has('magnesium') || has('apigenin');
    if (hasSleep) {
      score += 12;
      goalAlignments.push({
        goal: primaryGoal,
        status: 'Aligned',
        note: 'Slow-Wave sleep architecture and nocturnal pituitary GH pulse release are supported.'
      });
    }
  }

  // 2. AGE-SPECIFIC BIOLOGICAL CONSIDERATIONS
  if (age >= 30) {
    if (!has('nad') && !has('nmn')) {
      suggestions.push({
        type: 'add',
        title: `Age ${age}+ Cellular NAD+ Optimization (NMN / SubQ NAD+)`,
        reason: `Intracellular NAD+ levels decline by ~50% every 20 years past age 30, impairing PARP DNA repair enzymes.`
      });
    }
    if (!has('cjc') && !has('ipamorelin') && !has('sermorelin')) {
      suggestions.push({
        type: 'add',
        title: 'Consider CJC-1295 / Ipamorelin for Somatopause',
        reason: 'Endogenous Growth Hormone pulses drop ~14% per decade after 30; secretagogues restore youthful nocturnal pulses.'
      });
    }
  }

  // 3. REPAIR SYNERGY (BPC-157 + TB-500)
  const hasBPC = has('bpc-157') || has('bpc') || has('klow');
  const hasTB = has('tb-500') || has('tb500') || has('klow');
  if (hasBPC && hasTB) {
    score += 6;
    positiveSynergies.push({
      title: 'The Wolverine Healing Synergy',
      detail: 'BPC-157 (local GH-receptor & VEGF angiogenesis) paired with TB-500 (systemic actin cell migration) creates optimal dual-pathway tissue remodeling.'
    });
  }

  // 4. VITAMIN D3 + K2 + MAGNESIUM SYNERGY
  const hasD3 = has('d3') || has('vitamin d');
  const hasK2 = has('k2') || has('mk-7');
  const hasMag = has('magnesium') || has('magtein');

  if (hasD3 && hasK2 && hasMag) {
    score += 8;
    positiveSynergies.push({
      title: 'Complete Calcium-Vascular Safety Triad',
      detail: 'Vitamin D3 (calcium absorption) + K2 (osteocalcin activation) + Magnesium (enzymatic conversion) ensures calcium enters bones rather than soft vascular tissue.'
    });
  } else if (hasD3 && !hasK2) {
    warnings.push({
      title: 'Vitamin D3 without Vitamin K2',
      detail: 'High-dose Vitamin D3 increases blood calcium. Without Vitamin K2 (MK-7), unguided calcium can deposit in arterial walls.'
    });
    suggestions.push({
      type: 'add',
      title: 'Add Vitamin K2 (MK-7 100mcg)',
      reason: 'Directs calcium into bone hydroxyapatite and activates Matrix GLA protein.'
    });
  }

  // 5. NAD+ & METHYL DONORS
  const hasNAD = has('nad+') || has('nmn') || has('nicotinamide');
  const hasTMG = has('tmg') || has('trimethylglycine') || has('betaine');
  if (hasNAD && hasTMG) {
    score += 6;
    positiveSynergies.push({
      title: 'Balanced NAD+ & Methyl Donor Pool',
      detail: 'High NAD+ synthesis consumes S-adenosylmethionine (SAMe). TMG preserves the cellular methyl donor reserve.'
    });
  }

  // 6. CREATINE & BRAIN/MUSCLE ATP
  if (has('creatine')) {
    score += 5;
    positiveSynergies.push({
      title: 'Phosphocreatine Buffer Active',
      detail: `Supports brain ATP and powers muscular recovery for your ${activityLevel} schedule.`
    });
  }

  // 7. WELLNESS MODALITY SYNERGIES
  const hasCold = wellnessLogs.some(l => l.type === 'cold_plunge');
  const hasRedLight = wellnessLogs.some(l => l.type.includes('red_light'));
  if (hasCold && hasRedLight) {
    score += 6;
    positiveSynergies.push({
      title: 'Photobiomodulation + Cold Shock Biogenesis',
      detail: 'Cold immersion activates PGC-1alpha for mitochondrial biogenesis, while 660/850nm red light energizes Cytochrome C Oxidase inside those new mitochondria.'
    });
  }

  const finalScore = Math.min(99, Math.max(50, score));

  let grade = 'A';
  let gradeVerdict = 'Elite & Highly Synergistic';
  if (finalScore < 70) {
    grade = 'C+';
    gradeVerdict = 'Foundation Built (Gaps Detected)';
  } else if (finalScore < 85) {
    grade = 'B+';
    gradeVerdict = 'Strong Protocol (Minor Synergies Available)';
  } else if (finalScore >= 92) {
    grade = 'A+';
    gradeVerdict = 'Master Gold-Standard Protocol';
  }

  return {
    score: finalScore,
    grade,
    gradeVerdict,
    dailyProteinGrams,
    dailyWaterOz,
    estimatedBMR,
    goalAlignments,
    positiveSynergies,
    warnings,
    suggestions
  };
}
