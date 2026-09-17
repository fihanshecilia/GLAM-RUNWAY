export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type BodyShape = 'slim' | 'hourglass' | 'curvy' | 'athletic' | 'petite';
export type FaceShape = 'oval' | 'heart' | 'round' | 'diamond' | 'square';

export interface Character {
  id: string;
  name: string;
  title: string;
  bio: string;
  faceShape: FaceShape;
  skinTone: string; // hex or tone code
  skinToneName: string;
  eyeColor: string;
  eyeColorName: string;
  bodyShape: BodyShape;
  baseStyle: string;
  basicStyle?: string;
  avatarColor: string;
  favoriteTheme: string;
  heightRatio?: number;
}

export interface FashionTheme {
  id: string;
  name: string;
  nameId: string;
  description: string;
  icon: string;
  primaryColors: string[];
  recommendedColors?: string[];
  paletteColors?: string[];
  vibe: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  rewardMultiplier?: number;
  compatibleTags: string[];
  backdrop: string;
  musicMood: string;
}

export type MakeupCategory =
  | 'foundation'
  | 'blush'
  | 'eyeshadow'
  | 'eyeliner'
  | 'mascara'
  | 'lipstick'
  | 'faceDeco';

export type HairCategory = 'hair' | 'hairColor';

export type OutfitCategory = 'tops' | 'dresses' | 'skirts' | 'pants' | 'jackets';

export type AccessoryCategory =
  | 'necklace'
  | 'earrings'
  | 'bracelet'
  | 'rings'
  | 'handbag'
  | 'glasses'
  | 'crown'
  | 'hairAcc'
  | 'wings'
  | 'gloves';

export type MainCategory = 'makeup' | 'hair' | 'outfit' | 'shoes' | 'accessories';

export interface FashionItem {
  id: string;
  name: string;
  category: MakeupCategory | HairCategory | OutfitCategory | AccessoryCategory | 'shoes';
  subCategory?: string;
  color: string;
  secondaryColor?: string;
  accentColor?: string;
  style: string;
  rarity: Rarity;
  price: number;
  unlockedByDefault: boolean;
  compatibleThemes: string[];
  visualType: string; // identifier for SVG/Vector rendering
  details?: Record<string, any>;
}

export interface StylingState {
  characterId?: string;
  themeId?: string;
  skinTone?: string;
  eyeColor?: string;
  // Makeup
  foundation?: string; // hex or item id
  blush?: string | null; // item id
  eyeshadow?: string | null; // item id
  eyeliner?: string | null; // item id
  mascara?: string | null; // item id
  lipstick?: string | null; // item id
  faceDeco?: string | null; // item id
  // Hair
  hair?: string;
  hairId?: string;
  hairColor?: string; // hex
  // Outfit
  top?: string;
  topId?: string | null;
  dress?: string;
  dressId?: string | null;
  skirt?: string;
  pants?: string;
  bottomId?: string | null; // skirt or pants
  jacket?: string;
  jacketId?: string | null;
  // Shoes
  shoes?: string;
  shoesId?: string | null;
  // Accessories
  necklace?: string;
  necklaceId?: string | null;
  earrings?: string;
  earringsId?: string | null;
  bracelet?: string;
  braceletId?: string | null;
  rings?: string;
  ringsId?: string | null;
  handbag?: string;
  handbagId?: string | null;
  glasses?: string;
  glassesId?: string | null;
  crown?: string;
  crownId?: string | null;
  hairAcc?: string;
  hairAccId?: string | null;
  wings?: string;
  wingsId?: string | null;
  gloves?: string;
  glovesId?: string | null;
}

export interface JudgeFeedback {
  name: string;
  score: number;
  comment: string;
}

export interface ScoreResult {
  totalScore: number;
  breakdown: {
    themeMatch: number;
    makeupHarmony: number;
    outfitBalance: number;
    accessoriesCompleteness: number;
  };
  stars: number;
  coins: number;
  starsEarned: number;
  expEarned: number;
  generalCritique: string;
  judges: JudgeFeedback[];
  badgeUnlocked?: string;
}

export interface StylistRecommendation {
  themeName: string;
  rationale: string;
  hairStyleId?: string;
  hairColor?: string;
  dressId?: string;
  topId?: string;
  bottomId?: string;
  jacketId?: string;
  shoesId?: string;
  lipstickId?: string;
  eyeshadowId?: string;
  eyelinerId?: string;
  blushId?: string;
  accessories?: string[];
  colorPalette: string[];
  stylingTips: string[];
}

export interface UserProgress {
  coins: number;
  stars: number;
  unlockedItemIds: string[];
  favoriteItemIds: string[];
  savedLooks: SavedLook[];
  totalShows: number;
  highScore: number;
}

export interface SavedLook {
  id: string;
  characterName: string;
  themeName: string;
  date: string;
  score: number;
  rank: string;
  styling: StylingState;
}
