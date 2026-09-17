import { FashionItem } from '../types';

export interface HairColorOption {
  id: string;
  name: string;
  color: string;
  gradient?: string;
}

export const HAIR_COLORS: HairColorOption[] = [
  { id: 'hc_black_obsidian', name: 'Black Obsidian', color: '#18181B' },
  { id: 'hc_espresso_brown', name: 'Espresso Brown', color: '#451A03' },
  { id: 'hc_golden_blonde', name: 'Golden Blonde', color: '#FBBF24' },
  { id: 'hc_crimson_red', name: 'Crimson Burgundy', color: '#991B1B' },
  { id: 'hc_pastel_pink', name: 'Pastel Rose Pink', color: '#F472B6' },
  { id: 'hc_electric_purple', name: 'Electric Royal Violet', color: '#7C3AED' },
  { id: 'hc_ocean_blue', name: 'Deep Ocean Cyan', color: '#0284C7' },
  { id: 'hc_platinum_silver', name: 'Platinum Silver', color: '#CBD5E1' },
  { id: 'hc_pure_white', name: 'Snow Pure White', color: '#F8FAFC' },
  { id: 'hc_rainbow_pastel', name: 'Rainbow Pastel Unicorn', color: '#F43F5E', gradient: 'linear-gradient(135deg, #f43f5e, #a855f7, #06b6d4)' },
  { id: 'hc_neon_lime', name: 'Cyber Neon Lime', color: '#84CC16' },
  { id: 'hc_rose_gold', name: 'Sunset Rose Gold', color: '#FB7185' },
];

export const HAIRSTYLES: FashionItem[] = [
  { id: 'hair_long_sleek', name: 'Sleek Straight Flow', category: 'hair', color: '#18181B', style: 'long', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['red_carpet', 'luxury', 'k-pop'], visualType: 'hair_long_straight' },
  { id: 'hair_wavy_glam', name: 'Hollywood Glam Waves', category: 'hair', color: '#451A03', style: 'wavy', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['red_carpet', 'luxury', 'wedding'], visualType: 'hair_glam_waves' },
  { id: 'hair_classic_bob', name: 'French Chic Blunt Bob', category: 'hair', color: '#18181B', style: 'bob', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['luxury', 'streetwear'], visualType: 'hair_bob' },
  { id: 'hair_pixie_edgy', name: 'Edgy Textured Pixie', category: 'hair', color: '#18181B', style: 'short', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['streetwear', 'cyberpunk'], visualType: 'hair_pixie' },
  { id: 'hair_high_ponytail', name: 'High Snagged Ponytail', category: 'hair', color: '#451A03', style: 'ponytail', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['k-pop', 'y2k', 'streetwear'], visualType: 'hair_ponytail' },
  { id: 'hair_twin_tails', name: 'Manga Cute Twin Tails', category: 'hair', color: '#F472B6', style: 'twin_tail', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['pastel_kawaii', 'k-pop', 'y2k'], visualType: 'hair_twintail' },
  { id: 'hair_space_buns', name: 'Double Galaxy Space Buns', category: 'hair', color: '#7C3AED', style: 'space_bun', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['y2k', 'cyberpunk', 'retro_disco'], visualType: 'hair_space_buns' },
  { id: 'hair_top_ballerina_bun', name: 'Ballerina Top Knot', category: 'hair', color: '#18181B', style: 'bun', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['wedding', 'princess', 'luxury'], visualType: 'hair_top_bun' },
  { id: 'hair_romantic_braid', name: 'Boho Side Fishtail Braid', category: 'hair', color: '#FBBF24', style: 'braid', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['bohemian', 'summer', 'fairy'], visualType: 'hair_braid_side' },
  { id: 'hair_bouncy_curls', name: 'Bouncy Spiral Curls', category: 'hair', color: '#451A03', style: 'curly', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['wedding', 'princess', 'summer'], visualType: 'hair_curly_volume' },
  { id: 'hair_half_up', name: 'Half-Up Fairy Curls', category: 'hair', color: '#FBBF24', style: 'wavy', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['fairy', 'princess', 'wedding'], visualType: 'hair_half_up' },
  { id: 'hair_kpop_mullet', name: 'K-Pop Wolf Cut Mullet', category: 'hair', color: '#18181B', style: 'short', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['k-pop', 'streetwear'], visualType: 'hair_wolf_cut' },
  { id: 'hair_afro_puff', name: 'Regal Crown Afro Puff', category: 'hair', color: '#18181B', style: 'curly', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['royal_queen', 'streetwear', 'retro_disco'], visualType: 'hair_afro' },
  { id: 'hair_beach_waves', name: 'Sun-Drenched Beach Waves', category: 'hair', color: '#FBBF24', style: 'wavy', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['beach', 'summer', 'bohemian'], visualType: 'hair_beach_waves' },
  { id: 'hair_princess_curls', name: 'Princess Royal Cascade', category: 'hair', color: '#FBBF24', style: 'princess', rarity: 'rare', price: 140, unlockedByDefault: false, compatibleThemes: ['princess', 'royal_queen'], visualType: 'hair_princess' },
  { id: 'hair_cyber_braids', name: 'Cyberpunk Neon Braids', category: 'hair', color: '#0284C7', style: 'futuristic', rarity: 'rare', price: 150, unlockedByDefault: false, compatibleThemes: ['cyberpunk', 'y2k'], visualType: 'hair_cyber_braids' },
  { id: 'hair_gothic_damsel', name: 'Gothic Raven Vamp Locks', category: 'hair', color: '#18181B', style: 'long', rarity: 'rare', price: 140, unlockedByDefault: false, compatibleThemes: ['gothic', 'royal_queen'], visualType: 'hair_gothic_locks' },
  { id: 'hair_fairy_flower_curls', name: 'Fairy Queen Forest Tendrils', category: 'hair', color: '#F472B6', style: 'fantasy', rarity: 'rare', price: 160, unlockedByDefault: false, compatibleThemes: ['fairy', 'fantasy'], visualType: 'hair_fairy_tendrils' },
  { id: 'hair_curtain_bangs', name: '70s Curtain Bang Shag', category: 'hair', color: '#451A03', style: 'wavy', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['retro_disco', 'streetwear'], visualType: 'hair_curtain_bangs' },
  { id: 'hair_slicked_back', name: 'Runway Wet Slicked Back', category: 'hair', color: '#18181B', style: 'straight', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['red_carpet', 'luxury'], visualType: 'hair_slick_back' },
  { id: 'hair_dutch_twin_braids', name: 'Boxer Dutch Twin Braids', category: 'hair', color: '#FBBF24', style: 'braid', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['streetwear', 'k-pop'], visualType: 'hair_dutch_braids' },
  { id: 'hair_vintage_fingerwaves', name: '1920s Gatsby Finger Waves', category: 'hair', color: '#18181B', style: 'short', rarity: 'rare', price: 160, unlockedByDefault: false, compatibleThemes: ['luxury', 'retro_disco'], visualType: 'hair_finger_waves' },
  { id: 'hair_mermaid_waves', name: 'Mermaid Long Waterfall', category: 'hair', color: '#0284C7', style: 'long', rarity: 'rare', price: 170, unlockedByDefault: false, compatibleThemes: ['beach', 'fantasy', 'fairy'], visualType: 'hair_mermaid' },
  { id: 'hair_queen_updo', name: 'Empress Braided Crown Updo', category: 'hair', color: '#451A03', style: 'princess', rarity: 'rare', price: 180, unlockedByDefault: false, compatibleThemes: ['royal_queen', 'wedding'], visualType: 'hair_queen_updo' },
  { id: 'hair_bubble_pony', name: 'Futuristic Bubble Ponytail', category: 'hair', color: '#7C3AED', style: 'ponytail', rarity: 'rare', price: 150, unlockedByDefault: false, compatibleThemes: ['y2k', 'k-pop', 'cyberpunk'], visualType: 'hair_bubble_pony' },
  { id: 'hair_blunt_cut_hime', name: 'Japanese Hime Cut Bangs', category: 'hair', color: '#18181B', style: 'straight', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['gothic', 'pastel_kawaii', 'k-pop'], visualType: 'hair_hime_cut' },
  { id: 'hair_shaggy_bob', name: 'Shaggy French Beach Bob', category: 'hair', color: '#FBBF24', style: 'bob', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['summer', 'bohemian'], visualType: 'hair_shag_bob' },
  { id: 'hair_side_part_curls', name: 'Deep Side Part Old Money', category: 'hair', color: '#451A03', style: 'wavy', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['luxury', 'red_carpet'], visualType: 'hair_old_money' },
  { id: 'hair_crown_braids', name: 'Milkmaid Halo Braid Crown', category: 'hair', color: '#FBBF24', style: 'braid', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['bohemian', 'wedding', 'summer'], visualType: 'hair_halo_braid' },
  { id: 'hair_crystal_snow_locks', name: 'Crystal Ice Queen Waves', category: 'hair', color: '#CBD5E1', style: 'fantasy', rarity: 'rare', price: 190, unlockedByDefault: false, compatibleThemes: ['winter', 'fantasy'], visualType: 'hair_ice_queen' },
  { id: 'hair_low_ponytail_ribbon', name: 'Romantic Low Ribbon Ponytail', category: 'hair', color: '#451A03', style: 'ponytail', rarity: 'common', price: 0, unlockedByDefault: true, compatibleThemes: ['wedding', 'princess'], visualType: 'hair_low_pony' },
  { id: 'hair_harajuku_twintail', name: 'Fluffy Harajuku Mega Pigtails', category: 'hair', color: '#F472B6', style: 'twin_tail', rarity: 'rare', price: 160, unlockedByDefault: false, compatibleThemes: ['pastel_kawaii', 'k-pop'], visualType: 'hair_mega_pigtails' },
  { id: 'hair_cyber_twin_buns', name: 'Cyberpunk Wire Twin Buns', category: 'hair', color: '#84CC16', style: 'futuristic', rarity: 'rare', price: 170, unlockedByDefault: false, compatibleThemes: ['cyberpunk'], visualType: 'hair_cyber_buns' },
  { id: 'hair_cornrow_tails', name: 'Sleek Feed-In Cornrows', category: 'hair', color: '#18181B', style: 'braid', rarity: 'rare', price: 150, unlockedByDefault: false, compatibleThemes: ['streetwear', 'k-pop'], visualType: 'hair_cornrows' },
  { id: 'hair_celestial_goddess', name: 'Celestial Deity Golden Locks', category: 'hair', color: '#FBBF24', style: 'fantasy', rarity: 'epic', price: 280, unlockedByDefault: false, compatibleThemes: ['royal_queen', 'fantasy', 'luxury'], visualType: 'hair_celestial' },
  { id: 'hair_holographic_twin', name: 'Prismatic Hologram Tails', category: 'hair', color: '#0284C7', style: 'futuristic', rarity: 'epic', price: 300, unlockedByDefault: false, compatibleThemes: ['cyberpunk', 'y2k'], visualType: 'hair_holo_tails' },
  { id: 'hair_angelic_clouds', name: 'Angelic Soft Cloud Ringlets', category: 'hair', color: '#F8FAFC', style: 'curly', rarity: 'epic', price: 290, unlockedByDefault: false, compatibleThemes: ['fairy', 'wedding', 'princess'], visualType: 'hair_angel_ringlets' },
  { id: 'hair_gothic_vamp_corset', name: 'Victorian Ribbon Corset Hair', category: 'hair', color: '#18181B', style: 'long', rarity: 'epic', price: 310, unlockedByDefault: false, compatibleThemes: ['gothic', 'royal_queen'], visualType: 'hair_corset_hair' },
  { id: 'hair_disco_afro_glitter', name: 'Glittering Studio 54 Mega Afro', category: 'hair', color: '#FBBF24', style: 'curly', rarity: 'epic', price: 320, unlockedByDefault: false, compatibleThemes: ['retro_disco'], visualType: 'hair_disco_afro' },
  { id: 'hair_fire_phoenix_flow', name: 'Phoenix Fire Gradient Cascades', category: 'hair', color: '#F43F5E', style: 'fantasy', rarity: 'legendary', price: 460, unlockedByDefault: false, compatibleThemes: ['fantasy', 'royal_queen'], visualType: 'hair_phoenix' },
  { id: 'hair_starlight_empress', name: 'Starlight Empress Royal Train', category: 'hair', color: '#CBD5E1', style: 'princess', rarity: 'legendary', price: 480, unlockedByDefault: false, compatibleThemes: ['royal_queen', 'princess', 'luxury'], visualType: 'hair_starlight_empress' },
  { id: 'hair_matrix_nanowire', name: 'Matrix Nanowire Cyber Crown', category: 'hair', color: '#0284C7', style: 'futuristic', rarity: 'legendary', price: 500, unlockedByDefault: false, compatibleThemes: ['cyberpunk'], visualType: 'hair_nanowire' },
];
