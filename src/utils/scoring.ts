import { Character, FashionItem, FashionTheme, ScoreResult, StylingState } from '../types';
import { getItemById } from '../data/items';

export type { ScoreResult };

export function calculateStylingScore(
  styling: StylingState,
  theme: FashionTheme,
  character?: Character
): ScoreResult {
  let themeMatchPoints = 0;
  let themeEligibleCount = 0;
  let rarityBonus = 0;

  // Collect all equipped items
  const equippedKeys: (keyof StylingState)[] = [
    'foundation',
    'blush',
    'eyeshadow',
    'eyeliner',
    'mascara',
    'lipstick',
    'faceDeco',
    'hair',
    'top',
    'dress',
    'skirt',
    'pants',
    'jacket',
    'shoes',
    'necklace',
    'earrings',
    'bracelet',
    'rings',
    'handbag',
    'glasses',
    'crown',
    'hairAcc',
    'wings',
    'gloves',
  ];

  const equippedItems: FashionItem[] = [];
  equippedKeys.forEach((key) => {
    const id = styling[key];
    if (typeof id === 'string') {
      const item = getItemById(id);
      if (item) equippedItems.push(item);
    }
  });

  // 1. Theme Match (Max 35 points)
  equippedItems.forEach((item) => {
    themeEligibleCount++;
    if (item.compatibleThemes && item.compatibleThemes.includes(theme.id)) {
      themeMatchPoints += 1;
    }
    // Rarity bonus
    if (item.rarity === 'rare') rarityBonus += 0.5;
    if (item.rarity === 'epic') rarityBonus += 1.2;
    if (item.rarity === 'legendary') rarityBonus += 2.0;
  });

  const themeMatchPercentage = themeEligibleCount > 0
    ? Math.min(100, Math.round((themeMatchPoints / Math.max(4, themeEligibleCount * 0.7)) * 100))
    : 35;
  const themeMatchScore = Math.min(35, Math.round((themeMatchPercentage / 100) * 35));

  // 2. Makeup Score (Max 25 points)
  let makeupCount = 0;
  if (styling.foundation) makeupCount++;
  if (styling.blush) makeupCount++;
  if (styling.eyeshadow) makeupCount++;
  if (styling.eyeliner) makeupCount++;
  if (styling.mascara) makeupCount++;
  if (styling.lipstick) makeupCount++;
  if (styling.faceDeco) makeupCount += 0.5;

  const makeupRatio = Math.min(1, makeupCount / 5);
  const makeupScore = Math.round(makeupRatio * 25);

  // 3. Outfit & Color Harmony (Max 25 points)
  let outfitCount = 0;
  if (styling.dress) outfitCount += 2;
  if (styling.top) outfitCount += 1;
  if (styling.skirt || styling.pants) outfitCount += 1;
  if (styling.jacket) outfitCount += 0.8;
  if (styling.shoes) outfitCount += 1;
  if (styling.hair) outfitCount += 1;

  const outfitRatio = Math.min(1, outfitCount / 4.5);
  const outfitScore = Math.round(outfitRatio * 25);

  // 4. Completeness & Accessories (Max 15 points)
  let accCount = 0;
  if (styling.necklace) accCount++;
  if (styling.earrings) accCount++;
  if (styling.bracelet) accCount++;
  if (styling.rings) accCount++;
  if (styling.handbag) accCount++;
  if (styling.crown || styling.hairAcc) accCount++;
  if (styling.glasses) accCount++;
  if (styling.wings || styling.gloves) accCount++;

  const accRatio = Math.min(1, accCount / 3.5);
  const completenessScore = Math.round(accRatio * 15);

  // Total raw score with rarity bonus
  const total = Math.min(100, Math.max(30, themeMatchScore + makeupScore + outfitScore + completenessScore + Math.round(rarityBonus)));

  // Star calculation
  let stars = 1;
  if (total >= 90) stars = 5;
  else if (total >= 80) stars = 4;
  else if (total >= 68) stars = 3;
  else if (total >= 48) stars = 2;

  // Currency rewards
  const multiplier = theme.rewardMultiplier || 1.0;
  const coinsEarned = Math.round((total * 2.5 + stars * 45) * multiplier);
  const expEarned = Math.round((total * 1.8 + stars * 25) * multiplier);

  // Default judging commentary
  const mirandaScore = Math.min(10, Math.max(5, (total / 10) - 0.4 + (Math.random() * 0.3)));
  const leoScore = Math.min(10, Math.max(6, (total / 10) + (Math.random() * 0.5)));
  const chloeScore = Math.min(10, Math.max(6.5, (total / 10) + 0.3 + (Math.random() * 0.3)));

  const judgesFeedback = [
    {
      name: 'Miranda Vance',
      score: Number(mirandaScore.toFixed(1)),
      comment: total >= 85
        ? 'Presisi garis dan proporsinya sangat tinggi. Riasan dan busana berbicara dalam satu bahasa haute couture!'
        : total >= 70
        ? 'Kombinasi yang cukup terkonsep, namun aksesorisnya butuh ketegasan lebih agar tidak tenggelam.'
        : 'Siluetnya masih kurang terfokus pada tema. Eksplorasi palet warna yang lebih berani lain kali.',
    },
    {
      name: 'Leo Vanguard',
      score: Number(leoScore.toFixed(1)),
      comment: total >= 85
        ? 'Luar biasa! Visi avant-garde ini sangat berani dan segar di atas panggung catwalk!'
        : total >= 70
        ? 'Saya suka keberanian paduan gayanya! Sedikit sentuhan kilau lagi dan ini akan sempurna.'
        : 'Energinya bagus, namun layering busana dan riasan belum saling melengkapi secara maksimal.',
    },
    {
      name: 'Chloe Sparkle',
      score: Number(chloeScore.toFixed(1)),
      comment: total >= 85
        ? 'OMG, aku terpukau! Modelmu terlihat seperti bintang global yang siap menghiasi cover majalah Vogue!'
        : total >= 70
        ? 'Super chic! Warna lipstik dan gaunnya sangat fotogenik di bawah lampu sorot.'
        : 'Lucu dan manis! Tambahkan perhiasan statement agar aura superstar-nya makin bersinar!',
    },
  ];

  const generalCritique = total >= 85
    ? 'Penampilan spektakuler yang memikat seluruh penonton dan dewan juri!'
    : total >= 70
    ? 'Paduan gaya modis dan harmonis dengan sentuhan karakter yang kuat!'
    : 'Tampilan yang manis namun masih membutuhkan aksen kontras yang lebih tajam.';

  return {
    totalScore: total,
    breakdown: {
      themeMatch: themeMatchPercentage,
      makeupHarmony: Math.round((makeupScore / 25) * 100),
      outfitBalance: Math.round(outfitRatio * 100),
      accessoriesCompleteness: Math.round(accRatio * 100),
    },
    stars,
    coins: coinsEarned,
    starsEarned: stars,
    expEarned,
    generalCritique,
    judges: judgesFeedback,
    badgeUnlocked: stars === 5 ? `Top Model: ${theme.name}` : undefined,
  };
}
