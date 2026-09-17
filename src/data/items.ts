import { FashionItem } from '../types';
import { FOUNDATION_ITEMS, BLUSH_ITEMS, EYESHADOW_ITEMS, EYELINER_ITEMS, MASCARA_ITEMS, LIPSTICK_ITEMS, FACE_DECO_ITEMS } from './makeup';
import { HAIRSTYLES } from './hairstyles';
import { TOPS_ITEMS, DRESSES_ITEMS, SKIRTS_ITEMS, PANTS_ITEMS, JACKETS_ITEMS } from './outfits';
import { SHOES_ITEMS } from './shoes';
import {
  NECKLACE_ITEMS,
  EARRINGS_ITEMS,
  BRACELET_ITEMS,
  RINGS_ITEMS,
  HANDBAG_ITEMS,
  GLASSES_ITEMS,
  CROWN_ITEMS,
  HAIR_ACC_ITEMS,
  WINGS_ITEMS,
  GLOVES_ITEMS,
} from './accessories';

export const ALL_ITEMS: FashionItem[] = [
  ...FOUNDATION_ITEMS,
  ...BLUSH_ITEMS,
  ...EYESHADOW_ITEMS,
  ...EYELINER_ITEMS,
  ...MASCARA_ITEMS,
  ...LIPSTICK_ITEMS,
  ...FACE_DECO_ITEMS,
  ...HAIRSTYLES,
  ...TOPS_ITEMS,
  ...DRESSES_ITEMS,
  ...SKIRTS_ITEMS,
  ...PANTS_ITEMS,
  ...JACKETS_ITEMS,
  ...SHOES_ITEMS,
  ...NECKLACE_ITEMS,
  ...EARRINGS_ITEMS,
  ...BRACELET_ITEMS,
  ...RINGS_ITEMS,
  ...HANDBAG_ITEMS,
  ...GLASSES_ITEMS,
  ...CROWN_ITEMS,
  ...HAIR_ACC_ITEMS,
  ...WINGS_ITEMS,
  ...GLOVES_ITEMS,
];

export const ITEMS_BY_ID: Record<string, FashionItem> = ALL_ITEMS.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {} as Record<string, FashionItem>);

export function getItemById(id: string | null | undefined): FashionItem | undefined {
  if (!id) return undefined;
  return ITEMS_BY_ID[id];
}
