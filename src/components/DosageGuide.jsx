import React, { useState } from 'react';
import { sound } from '../utils/audio';

export const COMPREHENSIVE_DOSAGE_DATABASE = [
  // PEPTIDES - REGENERATIVE & HEALING
  {
    id: 'bpc-157',
    name: 'BPC-157 (Body Protection Compound)',
    category: 'Tissue, Gut & Tendon Repair',
    type: 'peptide',
    route: 'SubQ (Subcutaneous) or Oral (for Gut)',
    startingDose: '250 mcg (0.25 mg)',
    standardDose: '250 - 500 mcg (0.25 - 0.50 mg)',
    advancedDose: '500 - 1,000 mcg / day (Split 2x)',
    frequency: 'Twice daily (AM & PM) or once daily near injury site',
    cycleLength: '6 - 12 Weeks ON, followed by 2-4 Weeks OFF',
    timing: 'AM Fasted & PM before bed (or 30 mins prior to physical rehab)',
    reconstitutionGuide: 'Add 2.0 mL BAC water to a 5mg vial => 250mcg is exactly 10 IU (0.10 mL) on a U-100 syringe.',
    halfLife: '~4 hours (requires frequent dosing for sustained tissue saturation)',
    synergies: 'TB-500 (Wolverine stack), GHK-Cu, 660nm/850nm Photobiomodulation, 15g Collagen + Vit C.',
    clinicalNotes: 'Upregulates Growth Hormone receptor expression in tendon fibroblasts. Promotes VEGFR2-mediated angiogenesis without increasing systemic blood pressure.',
    tags: ['Tendon', 'Gut Health', 'Ligament', 'Angiogenesis']
  },
  {
    id: 'tb-500',
    name: 'TB-500 (Thymosin Beta-4 Systemic)',
    category: 'Systemic Healing & Muscle Repair',
    type: 'peptide',
    route: 'SubQ or IM',
    startingDose: '2.0 - 2.5 mg',
    standardDose: '2.5 mg twice weekly (5.0 mg / week)',
    advancedDose: '5.0 - 7.5 mg / week loading for 4 weeks, then 2.5mg maintenance',
    frequency: '2x / Week (e.g. Monday & Thursday)',
    cycleLength: '4 - 8 Weeks Loading, then maintenance 2.5mg every 2 weeks',
    timing: 'Any time of day (systemic distribution via bloodstream regardless of injection site)',
    reconstitutionGuide: 'Add 2.0 mL BAC water to a 10mg vial => 2.5mg is exactly 50 IU (0.50 mL) on a U-100 syringe.',
    halfLife: '~24 - 36 hours',
    synergies: 'BPC-157 (acts locally while TB-500 circulates systemically via actin cell migration).',
    clinicalNotes: 'Sequesters G-actin into F-actin fibrils, orchestrating rapid cell migration to acute and chronic wound sites while reducing myofibroblast fibrosis.',
    tags: ['Muscle Tears', 'Systemic Inflammation', 'Cardioprotection']
  },
  {
    id: 'klow',
    name: 'KLOW Blend (Klotho / KPV / BPC-157 / GHK-Cu)',
    category: 'Full-Spectrum Cellular Rejuvenation',
    type: 'peptide',
    route: 'SubQ (Abdomen)',
    startingDose: '250 - 300 mcg',
    standardDose: '500 mcg daily',
    advancedDose: '750 mcg - 1.0 mg daily',
    frequency: 'Once Daily (Morning Fasted)',
    cycleLength: '8 - 12 Weeks ON, 4 Weeks OFF',
    timing: 'Morning Fasted 30 mins before breakfast or training',
    reconstitutionGuide: 'Add 2.0 mL BAC water to a 10mg vial => 500mcg is exactly 10 IU on a U-100 syringe.',
    halfLife: '~4 - 6 hours',
    synergies: 'SS-31, MOTS-c, Cold Immersion, Morning Sunlight.',
    clinicalNotes: 'Combines Klotho longevity protein upregulation with anti-inflammatory KPV and reparative BPC/GHK for systemic extracellular matrix renewal.',
    tags: ['Longevity', 'Anti-Aging', 'Cellular Youth', 'Gene Expression']
  },
  {
    id: 'ss-31',
    name: 'SS-31 (Elamipretide Cardiolipin Restorer)',
    category: 'Mitochondrial Inner Membrane ATP',
    type: 'peptide',
    route: 'SubQ (Abdomen or Thigh)',
    startingDose: '2.0 - 3.0 mg',
    standardDose: '4.0 - 5.0 mg daily',
    advancedDose: '5.0 - 10.0 mg daily (clinical trials for mitochondrial myopathy use up to 10mg)',
    frequency: 'Daily in the morning',
    cycleLength: '4 - 8 Weeks ON, 4 Weeks OFF',
    timing: 'Morning upon waking or 45 mins prior to aerobic exercise',
    reconstitutionGuide: 'Add 5.0 mL BAC water to a 50mg vial => 4.0mg is exactly 40 IU (0.40 mL) on a U-100 syringe.',
    halfLife: '~2 - 4 hours (cellular cardiolipin stabilization persists 24h+)',
    synergies: 'MOTS-c (take SS-31 first to repair mitochondrial cristae, then MOTS-c to drive biogenesis).',
    clinicalNotes: 'Selectively binds cardiolipin in the inner mitochondrial membrane, preventing electron leakage, reducing ROS, and optimizing ATP synthase efficiency.',
    tags: ['Mitochondria', 'ATP Energy', 'Cardiovascular', 'Fatigue']
  },
  {
    id: 'mots-c',
    name: 'MOTS-c (Mitochondrial ORF 12S rRNA)',
    category: 'Metabolic & Exercise Mimetic',
    type: 'peptide',
    route: 'SubQ (Abdomen)',
    startingDose: '2.5 - 5.0 mg',
    standardDose: '5.0 mg 3x / week (e.g. Mon / Wed / Fri)',
    advancedDose: '10.0 mg 3x / week for 4 weeks (intensive metabolic reset)',
    frequency: '3x / Week Fasted',
    cycleLength: '4 - 6 Weeks ON, followed by 4 Weeks OFF',
    timing: 'Fasted 30-45 minutes prior to Zone 2 cardio or weightlifting',
    reconstitutionGuide: 'Add 2.0 mL BAC water to a 10mg vial => 5.0mg is exactly 100 IU (1.0 mL) on a U-100 syringe (or 50 IU with 1.0ml BAC).',
    halfLife: '~4 hours',
    synergies: 'SS-31, Cold Plunge, Berberine, 5-Amino-1MQ, Time-Restricted Feeding.',
    clinicalNotes: 'Translocates to the cell nucleus upon metabolic stress; directly activates AMPK, lowers cellular folate levels, and drives robust lipid oxidation.',
    tags: ['Fat Loss', 'Mitochondria', 'Insulin Sensitivity', 'Endurance']
  },
  {
    id: 'ghk-cu',
    name: 'GHK-Cu (Copper Tripeptide-1)',
    category: 'Skin, Collagen & Gene Remodeling',
    type: 'peptide',
    route: 'SubQ or Topical Cosmetic',
    startingDose: '1.0 mg',
    standardDose: '2.0 mg daily',
    advancedDose: '2.5 - 3.0 mg daily',
    frequency: 'Daily (AM or PM)',
    cycleLength: '4 - 8 Weeks ON, 4 Weeks OFF (to avoid copper overload)',
    timing: 'Morning with water or pre-bed',
    reconstitutionGuide: 'Add 5.0 mL BAC water to a 50mg vial => 2.0mg is exactly 20 IU (0.20 mL) on a U-100 syringe.',
    halfLife: '~1 hour (intracellular gene signaling downstream effects persist days)',
    synergies: 'BPC-157, Red Light Therapy (630nm/660nm), Zinc/Copper oral balance.',
    clinicalNotes: 'Modulates over 4,000 human genes back towards a youthful state. Stimulates collagen synthesis, decorin, and blocks TGF-beta fibrotic signaling.',
    tags: ['Collagen', 'Skin', 'Hair Growth', 'Scar Tissue']
  },
  {
    id: 'cjc-ipa',
    name: 'CJC-1295 (No DAC) / Ipamorelin Blend',
    category: 'Natural Growth Hormone & Deep Sleep',
    type: 'peptide',
    route: 'SubQ (Abdomen or Love Handles)',
    startingDose: '100mcg CJC / 100mcg Ipamorelin',
    standardDose: '150mcg CJC / 150mcg Ipamorelin (300mcg total blend)',
    advancedDose: '200mcg CJC / 200mcg Ipamorelin (400mcg total blend)',
    frequency: '5 Days ON / 2 Days OFF (prevents pituitary desensitization)',
    cycleLength: '12 - 16 Weeks ON, 4 Weeks OFF',
    timing: 'Strictly Bedtime on an empty stomach (at least 90-120 mins after last food)',
    reconstitutionGuide: 'Add 2.5 mL BAC water to a 5mg blend vial => 300mcg total is exactly 15 IU (0.15 mL) on a U-100 syringe.',
    halfLife: 'Ipamorelin: ~2 hours | CJC (Mod GRF 1-29): ~30 mins',
    synergies: 'Magnesium L-Threonate, Apigenin, Zero Blue Light exposure pre-bed.',
    clinicalNotes: 'Mimics natural pulsatile pituitary GH release without triggering prolactin, cortisol, or appetite-stimulating ghrelin spikes associated with older GHRPs.',
    tags: ['Deep Sleep', 'GH Secretagogue', 'Fat Loss', 'Muscle Recovery']
  },
  {
    id: 'retatrutide',
    name: 'Retatrutide (Triple G - GLP-1/GIP/Glucagon)',
    category: 'Next-Gen Metabolic & Adipose Lipolysis',
    type: 'peptide',
    route: 'SubQ (Abdomen or Thigh)',
    startingDose: '1.0 - 2.0 mg (Titration starting dose for weeks 1-4)',
    standardDose: '2.0 - 4.0 mg weekly',
    advancedDose: '4.0 - 8.0 mg weekly (advanced titration for maximum energy expenditure)',
    frequency: 'Once Weekly on the same day',
    cycleLength: '16 - 24+ Weeks continuous with slow monthly titration',
    timing: 'Morning on an empty stomach on designated injection day',
    reconstitutionGuide: 'Add 2.0 mL BAC water to a 10mg vial => 2.0mg is exactly 40 IU (0.40 mL) on a U-100 syringe.',
    halfLife: '~6 days (sustained steady-state blood levels throughout the week)',
    synergies: 'High dietary protein (1.0g/lb), Resistance Training, Electrolytes (Sodium/Potassium).',
    clinicalNotes: 'Glucagon receptor agonism increases hepatic energy expenditure and lipid clearance while GLP-1/GIP pathways suppress appetite and normalize insulin.',
    tags: ['Metabolic', 'Weight Management', 'Liver Health', 'Energy Expenditure']
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide (Dual GLP-1 & GIP Agonist)',
    category: 'Insulin Sensitivity & Satiety',
    type: 'peptide',
    route: 'SubQ',
    startingDose: '2.5 mg weekly (Weeks 1 - 4)',
    standardDose: '5.0 - 7.5 mg weekly (Weeks 5+)',
    advancedDose: '10.0 - 15.0 mg weekly (Maximum clinical dosage)',
    frequency: 'Once Weekly',
    cycleLength: 'Continuous / Long-term metabolic optimization',
    timing: 'Morning Fasted',
    reconstitutionGuide: 'Add 2.0 mL BAC water to a 10mg vial => 2.5mg is exactly 50 IU (0.50 mL) on a U-100 syringe.',
    halfLife: '~5 days',
    synergies: 'BPC-157 (for GI comfort), Digestive Enzymes, Hydration.',
    clinicalNotes: 'Synergistic dual agonism improves insulin secretion in a glucose-dependent manner with high glycemic and body composition efficacy.',
    tags: ['Glucose Control', 'Satiety', 'Insulin Sensitivity']
  },
  {
    id: 'epithalon',
    name: 'Epithalon (Epithalamin Pineal Bioregulator)',
    category: 'Telomerase & Circadian Master Clock',
    type: 'peptide',
    route: 'SubQ or IM',
    startingDose: '5.0 mg',
    standardDose: '10.0 mg daily',
    advancedDose: '10.0 mg daily for 10-20 consecutive days',
    frequency: 'Daily during a 10 to 20-day pulse cycle (repeat 1-2x per year)',
    cycleLength: '10 - 20 Days ON, then 6 Months OFF',
    timing: 'Morning upon waking or Bedtime',
    reconstitutionGuide: 'Add 5.0 mL BAC water to a 50mg vial => 10mg is exactly 100 IU (1.0 mL) on a U-100 syringe.',
    halfLife: 'Rapid cellular uptake (~30 mins), epigenetic elongation effects persist months.',
    synergies: 'NAD+, NMN, Resveratrol, Melatonin optimization.',
    clinicalNotes: 'Khavinson bioregulator peptide that overcomes the Hayflick limit in human somatic cells by activating telomerase reverse transcriptase (TERT).',
    tags: ['Telomeres', 'Epigenetic Clock', 'Circadian', 'Pineal']
  },
  {
    id: 'semax',
    name: 'Semax (Heptapeptide ACTH 4-10 Analog)',
    category: 'BDNF & Neuro-Cognitive Clarity',
    type: 'peptide',
    route: 'SubQ or Intranasal Spray',
    startingDose: '300 mcg',
    standardDose: '600 - 1,000 mcg daily',
    advancedDose: '1.0 - 2.0 mg daily (during high cognitive load)',
    frequency: 'Daily in the morning / early afternoon',
    cycleLength: '4 - 8 Weeks ON, 2-4 Weeks OFF',
    timing: 'Morning 15-30 mins prior to intense mental tasks or study',
    reconstitutionGuide: 'Add 2.0 mL BAC water to a 10mg vial => 600mcg is exactly 12 IU (0.12 mL) on a U-100 syringe.',
    halfLife: '~20 - 30 minutes in blood (elevates central BDNF for 24h+)',
    synergies: 'Selank, Lion\'s Mane, Alpha-GPC, Creatine.',
    clinicalNotes: 'Potently increases Brain-Derived Neurotrophic Factor (BDNF) and TrkB receptor activation in the hippocampus without psychostimulant crash.',
    tags: ['Nootropic', 'BDNF', 'Focus', 'Neuroprotection']
  },
  {
    id: 'pt-141',
    name: 'PT-141 (Bremelanotide)',
    category: 'Central Melanocortin Libido Agonist',
    type: 'peptide',
    route: 'SubQ (Abdomen)',
    startingDose: '0.5 - 1.0 mg (Test tolerance for initial flushing)',
    standardDose: '1.5 - 2.0 mg',
    advancedDose: '2.0 - 2.5 mg',
    frequency: 'As Needed (Do not exceed 2x in a 7-day period)',
    cycleLength: 'On-demand acute protocol',
    timing: 'Administer 2 to 4 hours prior to sexual activity',
    reconstitutionGuide: 'Add 2.0 mL BAC water to a 10mg vial => 1.5mg is exactly 30 IU (0.30 mL) on a U-100 syringe.',
    halfLife: '~2.7 hours (central libido effects peak at 3-6 hours and can last 24h+)',
    synergies: 'Tongkat Ali, Zinc Glycinate, Hydration.',
    clinicalNotes: 'Bypasses vascular system and acts directly on hypothalamic melanocortin MC3 and MC4 receptors in the central nervous system.',
    tags: ['Libido', 'Dopamine', 'Sexual Performance']
  },

  // NUTRACEUTICALS & VITAMINS
  {
    id: 'd3-k2',
    name: 'Vitamin D3 (Cholecalciferol) + K2 (MK-7)',
    category: 'Immune & Arterial Bone Distribution',
    type: 'vitamin',
    route: 'Oral Softgel or Liquid Drop',
    startingDose: '2,000 IU D3 + 50 mcg K2',
    standardDose: '5,000 IU D3 + 100 mcg K2 (MK-7)',
    advancedDose: '10,000 IU D3 + 200 mcg K2 (under 25-OH lab monitoring)',
    frequency: 'Daily in the morning with food',
    cycleLength: 'Continuous (adjust based on seasonal UV index and blood test)',
    timing: 'Morning with a meal containing 10-15g of healthy dietary fat',
    synergies: 'Magnesium (essential enzymatic cofactor to convert D3 into active calcitriol).',
    clinicalNotes: 'D3 upregulates calcium absorption; K2 activates Matrix Gla-Protein to ensure calcium enters bone hydroxyapatite matrix instead of arterial walls.',
    tags: ['Immunity', 'Bone Density', 'Arterial Health', 'Cardiovascular']
  },
  {
    id: 'magtein',
    name: 'Magnesium L-Threonate (Magtein)',
    category: 'Blood-Brain Barrier Crossing & Sleep',
    type: 'vitamin',
    route: 'Oral Capsule / Powder',
    startingDose: '1,000 mg (72mg elemental Mg)',
    standardDose: '1,500 - 2,000 mg (144mg elemental Mg)',
    advancedDose: '2,000 mg (Split 500mg afternoon / 1500mg pre-bed)',
    frequency: 'Daily (Evening / Bedtime)',
    cycleLength: 'Continuous',
    timing: '60 minutes prior to sleep',
    synergies: 'Apigenin, L-Theanine, Glycine, CJC-1295/Ipamorelin.',
    clinicalNotes: 'Unique chelate specifically engineered to cross the blood-brain barrier, raising CSF magnesium levels by 15% and enhancing synaptic density.',
    tags: ['Deep Sleep', 'Synapses', 'Anxiety Relief', 'Cognition']
  },
  {
    id: 'nmn-tmg',
    name: 'NMN (Nicotinamide Mononucleotide) + TMG',
    category: 'Intracellular NAD+ & Methylation Support',
    type: 'vitamin',
    route: 'Sublingual Powder or Enteric Capsule',
    startingDose: '250 mg NMN + 250 mg TMG',
    standardDose: '500 mg NMN + 500 mg TMG (1:1 Ratio)',
    advancedDose: '1,000 mg NMN + 1,000 mg TMG daily',
    frequency: 'Daily in the morning',
    cycleLength: 'Continuous / Long-term longevity protocol',
    timing: 'Morning upon waking (Sublingual hold for 60 seconds)',
    synergies: 'Resveratrol, Quercetin, Exercise, Cold Exposure.',
    clinicalNotes: 'Direct precursor to NAD+. TMG preserves methyl pools consumed during hepatic NAM excretion, preventing elevated homocysteine.',
    tags: ['NAD+ Energy', 'DNA Repair', 'Sirtuins', 'Longevity']
  },
  {
    id: 'creatine',
    name: 'Creatine Monohydrate (Creapure)',
    category: 'Cellular ATP Recycling & Cognitive Speed',
    type: 'vitamin',
    route: 'Oral Powder in water or beverage',
    startingDose: '5.0 g daily (No loading phase required)',
    standardDose: '5.0 g daily (Continuous)',
    advancedDose: '10.0 g daily (for high body mass or intense cognitive fatigue)',
    frequency: 'Daily without cycling off',
    cycleLength: 'Continuous',
    timing: 'Morning with water or Post-Workout shake',
    synergies: 'Hydration (drink 500ml extra water), Electrolytes.',
    clinicalNotes: 'Replenishes phosphocreatine reserves in both skeletal muscle and cerebral cortex, boosting anaerobic power and working memory under sleep deprivation.',
    tags: ['Strength', 'ATP', 'Brain Speed', 'Cellular Hydration']
  },
  {
    id: 'tongkat-ali',
    name: 'Tongkat Ali (Eurycoma Longifolia 200:1 / LJ100)',
    category: 'Free Testosterone & Cortisol Modulation',
    type: 'vitamin',
    route: 'Oral Capsule',
    startingDose: '200 mg',
    standardDose: '400 - 500 mg daily',
    advancedDose: '600 mg daily (Fadogia Agrestis 300mg stack)',
    frequency: '5 Days ON / 2 Days OFF (or 4 Weeks ON / 1 Week OFF)',
    cycleLength: '8 - 12 Weeks ON, 2-4 Weeks OFF',
    timing: 'Morning with breakfast',
    synergies: 'Zinc Glycinate, Boron (6mg for SHBG), Red Light Therapy.',
    clinicalNotes: 'Eurypeptides dissociate bound testosterone from Sex Hormone-Binding Globulin (SHBG) and lower the catabolic cortisol-to-testosterone ratio.',
    tags: ['Testosterone', 'SHBG', 'Energy', 'Vitality']
  }
];

export default function DosageGuide({ onApplyDoseToCalculator, onApplyToProtocol }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // 'ALL', 'peptide', 'vitamin'
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [expandedId, setExpandedId] = useState('bpc-157');

  const allTags = Array.from(new Set(COMPREHENSIVE_DOSAGE_DATABASE.flatMap(item => item.tags || [])));

  const filteredItems = COMPREHENSIVE_DOSAGE_DATABASE.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.tags && item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = selectedFilter === 'ALL' || item.type === selectedFilter;
    const matchesTag = selectedTag === 'ALL' || (item.tags && item.tags.includes(selectedTag));
    return matchesSearch && matchesType && matchesTag;
  });

  const handleToggleExpand = (id) => {
    sound.playClick();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-fade-in">
      <div className="view-header">
        <div className="view-title-group">
          <h2>Clinical Dosing & Protocol Reference</h2>
          <p>Evidence-based starting, standard, and advanced dosages, reconstitution calibrations, cycle lengths, and timing rules.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <label className="bio-label">Search Compounds, Peptides, or Health Goals</label>
            <input
              type="text"
              placeholder="🔍 Search (e.g. BPC-157, KLOW, SS-31, MOTS-c, Sleep, Tendon, Testosterone)..."
              className="bio-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="bio-label">Compound Type</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'ALL', label: '🌟 All Compounds' },
                { id: 'peptide', label: '💉 Peptides' },
                { id: 'vitamin', label: '💊 Nutraceuticals' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    fontSize: '12px',
                    padding: '8px',
                    borderColor: selectedFilter === tab.id ? 'var(--neon-cyan)' : 'var(--border-glass)',
                    background: selectedFilter === tab.id ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: selectedFilter === tab.id ? '#fff' : 'var(--text-muted)'
                  }}
                  onClick={() => { sound.playClick(); setSelectedFilter(tab.id); }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bio-Target Filter Tags */}
        <div>
          <div className="bio-label" style={{ marginBottom: '8px' }}>Filter by Bio-Target Objective</div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span
              onClick={() => { sound.playClick(); setSelectedTag('ALL'); }}
              style={{
                cursor: 'pointer',
                fontSize: '11px',
                padding: '3px 10px',
                borderRadius: '16px',
                background: selectedTag === 'ALL' ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.05)',
                color: selectedTag === 'ALL' ? '#030812' : 'var(--text-muted)',
                fontWeight: '700'
              }}
            >
              All Objectives
            </span>
            {allTags.map(tag => (
              <span
                key={tag}
                onClick={() => { sound.playClick(); setSelectedTag(tag); }}
                style={{
                  cursor: 'pointer',
                  fontSize: '11px',
                  padding: '3px 10px',
                  borderRadius: '16px',
                  background: selectedTag === tag ? 'var(--neon-cyan)' : 'rgba(255,255,255,0.05)',
                  color: selectedTag === tag ? '#030812' : 'var(--text-muted)',
                  fontWeight: '600',
                  border: '1px solid var(--border-glass)'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dosage Cards Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredItems.map(item => {
          const isExp = expandedId === item.id;
          return (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                border: isExp ? '1px solid var(--neon-cyan)' : '1px solid var(--border-glass)',
                background: isExp ? 'linear-gradient(180deg, rgba(14, 24, 40, 0.95) 0%, rgba(8, 12, 20, 0.95) 100%)' : 'var(--bg-surface-1)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                padding: '20px 24px'
              }}
            >
              {/* Header Accordion Bar */}
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => handleToggleExpand(item.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '22px' }}>{item.type === 'peptide' ? '💉' : '💊'}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: '800', color: '#fff' }}>{item.name}</h3>
                      <span className={`tag-badge ${item.type === 'peptide' ? 'tag-cyan' : 'tag-emerald'}`}>
                        {item.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                      Route: <strong style={{ color: '#fff' }}>{item.route}</strong> | Timing: <strong style={{ color: 'var(--neon-amber)' }}>{item.timing}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-dark)', textTransform: 'uppercase' }}>Recommended Standard</div>
                    <div style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'var(--font-mono)', color: 'var(--neon-emerald)' }}>
                      {item.standardDose}
                    </div>
                  </div>
                  <span style={{ fontSize: '16px', color: 'var(--neon-cyan)', transition: 'transform 0.2s', transform: isExp ? 'rotate(180deg)' : 'none' }}>
                    ▼
                  </span>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExp && (
                <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid var(--border-glass)' }}>
                  {/* Dosage Tier Comparison Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--neon-cyan)', fontWeight: '700', textTransform: 'uppercase' }}>🌱 Starting / Titration Dose</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
                        {item.startingDose}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Assesses initial receptor tolerance</div>
                    </div>

                    <div style={{ background: 'rgba(5, 255, 161, 0.06)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(5, 255, 161, 0.3)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--neon-emerald)', fontWeight: '700', textTransform: 'uppercase' }}>⭐ Recommended Standard</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
                        {item.standardDose}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Optimal efficacy vs. receptor sensitivity</div>
                    </div>

                    <div style={{ background: 'rgba(255, 42, 109, 0.05)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 42, 109, 0.25)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--neon-crimson)', fontWeight: '700', textTransform: 'uppercase' }}>⚡ Advanced / Loading Dose</div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: '6px 0 2px 0', fontFamily: 'var(--font-mono)' }}>
                        {item.advancedDose}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>For acute injury or clinical loading</div>
                    </div>
                  </div>

                  {/* Dosing Protocols & Reconstitution Guide */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)', fontSize: '12.5px', lineHeight: '1.6' }}>
                      <div style={{ color: 'var(--neon-cyan)', fontWeight: '700', marginBottom: '6px' }}>⏱️ Frequency & Cycle Length:</div>
                      <div><strong>Administration Frequency:</strong> {item.frequency}</div>
                      <div><strong>Cycle Duration:</strong> {item.cycleLength}</div>
                      {item.halfLife && <div><strong>Estimated Half-Life:</strong> {item.halfLife}</div>}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)', fontSize: '12.5px', lineHeight: '1.6' }}>
                      <div style={{ color: 'var(--neon-amber)', fontWeight: '700', marginBottom: '6px' }}>🧪 Exact Reconstitution & Syringe Pull:</div>
                      <div>{item.reconstitutionGuide || 'Standard oral ingestion with meal or water.'}</div>
                    </div>
                  </div>

                  {/* Synergies & Clinical Pharmacology */}
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)', fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                    <div><strong style={{ color: 'var(--neon-emerald)' }}>⚡ Optimal Bio-Synergies:</strong> {item.synergies}</div>
                    <div style={{ marginTop: '4px' }}><strong style={{ color: '#fff' }}>🔬 Mechanism & Clinical Notes:</strong> {item.clinicalNotes}</div>
                  </div>

                  {/* Action Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {item.tags && item.tags.map(t => (
                        <span key={t} className="tag-badge tag-cyan" style={{ fontSize: '10px' }}>#{t}</span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {item.type === 'peptide' && (
                        <button
                          className="btn-secondary"
                          style={{ fontSize: '12px', padding: '6px 14px' }}
                          onClick={() => {
                            sound.playSuccess();
                            if (onApplyDoseToCalculator) onApplyDoseToCalculator(item);
                          }}
                        >
                          🧮 Load in Syringe Calculator
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
