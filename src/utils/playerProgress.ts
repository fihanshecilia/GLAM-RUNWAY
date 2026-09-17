import { ALL_ITEMS } from '../data/items';

export interface PlayerProgress {
  coins: number;
  stars: number;
  level: number;
  exp: number;
  expToNextLevel: number;
  unlockedItems: string[];
  completedThemes: string[];
  highScores: Record<string, number>;
  photos: SavedPhoto[];
}

export interface SavedPhoto {
  id: string;
  themeName: string;
  characterName: string;
  score: number;
  stars: number;
  date: string;
  pose: string;
  background: string;
  filter: string;
}

const STORAGE_KEY = 'glam_runway_save_v1';

// Default unlocked items: all items marked unlockedByDefault
const defaultUnlocked = ALL_ITEMS.filter((i) => i.unlockedByDefault).map((i) => i.id);

const defaultProgress: PlayerProgress = {
  coins: 450,
  stars: 6,
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  unlockedItems: defaultUnlocked,
  completedThemes: [],
  highScores: {},
  photos: [],
};

export function loadPlayerProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with default unlocked in case new items were added
      const mergedUnlocked = Array.from(new Set([...defaultUnlocked, ...(parsed.unlockedItems || [])]));
      return {
        ...defaultProgress,
        ...parsed,
        unlockedItems: mergedUnlocked,
      };
    }
  } catch (err) {
    console.error('Failed to load progress from localStorage:', err);
  }
  return defaultProgress;
}

export function savePlayerProgress(progress: PlayerProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Failed to save progress to localStorage:', err);
  }
}

export function addRewardsToProgress(
  current: PlayerProgress,
  coins: number,
  stars: number,
  expEarned: number,
  themeId: string,
  score: number
): { updated: PlayerProgress; leveledUp: boolean } {
  let coinsNew = current.coins + coins;
  let starsNew = current.stars + stars;
  let expNew = current.exp + expEarned;
  let levelNew = current.level;
  let expNeeded = current.expToNextLevel;
  let leveledUp = false;

  while (expNew >= expNeeded) {
    expNew -= expNeeded;
    levelNew += 1;
    expNeeded = Math.round(expNeeded * 1.35);
    coinsNew += 200; // Level up bonus!
    starsNew += 2;
    leveledUp = true;
  }

  const completed = Array.from(new Set([...current.completedThemes, themeId]));
  const currentBest = current.highScores[themeId] || 0;
  const highScores = {
    ...current.highScores,
    [themeId]: Math.max(currentBest, score),
  };

  const updated: PlayerProgress = {
    ...current,
    coins: coinsNew,
    stars: starsNew,
    level: levelNew,
    exp: expNew,
    expToNextLevel: expNeeded,
    completedThemes: completed,
    highScores,
  };

  savePlayerProgress(updated);
  return { updated, leveledUp };
}

export function buyItem(
  current: PlayerProgress,
  itemId: string,
  price: number
): { success: boolean; updated: PlayerProgress; error?: string } {
  if (current.unlockedItems.includes(itemId)) {
    return { success: true, updated: current };
  }
  if (current.coins < price) {
    return { success: false, updated: current, error: 'Koin tidak cukup!' };
  }

  const updated: PlayerProgress = {
    ...current,
    coins: current.coins - price,
    unlockedItems: [...current.unlockedItems, itemId],
  };
  savePlayerProgress(updated);
  return { success: true, updated };
}
