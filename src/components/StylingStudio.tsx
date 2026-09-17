import React, { useState, useMemo } from 'react';
import { Character, FashionItem, FashionTheme, StylingState } from '../types';
import { PlayerProgress, buyItem } from '../utils/playerProgress';
import { ModelRenderer } from './ModelRenderer';
import { soundManager } from '../utils/audio';
import { HAIR_COLORS } from '../data/hairstyles';
import { FOUNDATION_ITEMS, BLUSH_ITEMS, EYESHADOW_ITEMS, EYELINER_ITEMS, MASCARA_ITEMS, LIPSTICK_ITEMS, FACE_DECO_ITEMS } from '../data/makeup';
import { HAIRSTYLES } from '../data/hairstyles';
import { TOPS_ITEMS, DRESSES_ITEMS, SKIRTS_ITEMS, PANTS_ITEMS, JACKETS_ITEMS } from '../data/outfits';
import { SHOES_ITEMS } from '../data/shoes';
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
} from '../data/accessories';
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Shuffle,
  Play,
  Lock,
  Check,
  Search,
  ZoomIn,
  Bot,
  HelpCircle,
  X,
  Tag,
} from 'lucide-react';

interface StylingStudioProps {
  character: Character;
  theme: FashionTheme;
  progress: PlayerProgress;
  styling: StylingState;
  onUpdateStyling: (newStyling: StylingState) => void;
  onUpdateProgress: (newProgress: PlayerProgress) => void;
  onProceedToRunway: () => void;
  onBackToThemes: () => void;
}

type MainTab = 'makeup' | 'hair' | 'outfit' | 'shoes' | 'accessories';

export const StylingStudio: React.FC<StylingStudioProps> = ({
  character,
  theme,
  progress,
  styling,
  onUpdateStyling,
  onUpdateProgress,
  onProceedToRunway,
  onBackToThemes,
}) => {
  const [mainTab, setMainTab] = useState<MainTab>('makeup');
  const [subCategory, setSubCategory] = useState<string>('eyeshadow');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [zoomMode, setZoomMode] = useState<'full' | 'face' | 'upper'>('face');

  // AI Stylist Advice Modal State
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiAdvice, setAiAdvice] = useState<{
    greeting: string;
    tips: string[];
    secretTip: string;
    stylistMood: string;
  } | null>(null);

  // Quick purchase notification
  const [purchaseAlert, setPurchaseAlert] = useState<string | null>(null);

  // Fetch AI Stylist advice from server
  const fetchAiAdvice = async () => {
    setAiLoading(true);
    setShowAiModal(true);
    try {
      const res = await fetch('/api/stylist-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          character,
          equippedSummary: Object.entries(styling)
            .filter(([, v]) => !!v)
            .map(([k, v]) => `${k}:${v}`)
            .join(', '),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiAdvice(data.advice);
      }
    } catch (err) {
      console.warn('AI Stylist fetch error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  // Sub-categories mapping for each MainTab
  const subCategoryOptions = useMemo(() => {
    switch (mainTab) {
      case 'makeup':
        return [
          { id: 'foundation', label: 'Skin / Base', items: FOUNDATION_ITEMS },
          { id: 'blush', label: 'Blush', items: BLUSH_ITEMS },
          { id: 'eyeshadow', label: 'Eyeshadow', items: EYESHADOW_ITEMS },
          { id: 'eyeliner', label: 'Eyeliner', items: EYELINER_ITEMS },
          { id: 'mascara', label: 'Mascara', items: MASCARA_ITEMS },
          { id: 'lipstick', label: 'Lipstick', items: LIPSTICK_ITEMS },
          { id: 'faceDeco', label: 'Face Deco', items: FACE_DECO_ITEMS },
        ];
      case 'hair':
        return [{ id: 'hair', label: 'Hairstyles', items: HAIRSTYLES }];
      case 'outfit':
        return [
          { id: 'dress', label: 'Dresses', items: DRESSES_ITEMS },
          { id: 'top', label: 'Tops', items: TOPS_ITEMS },
          { id: 'skirt', label: 'Skirts', items: SKIRTS_ITEMS },
          { id: 'pants', label: 'Pants', items: PANTS_ITEMS },
          { id: 'jacket', label: 'Jackets / Coats', items: JACKETS_ITEMS },
        ];
      case 'shoes':
        return [{ id: 'shoes', label: 'Shoes', items: SHOES_ITEMS }];
      case 'accessories':
        return [
          { id: 'necklace', label: 'Necklace', items: NECKLACE_ITEMS },
          { id: 'earrings', label: 'Earrings', items: EARRINGS_ITEMS },
          { id: 'crown', label: 'Crown / Tiara', items: CROWN_ITEMS },
          { id: 'hairAcc', label: 'Hair Acc', items: HAIR_ACC_ITEMS },
          { id: 'glasses', label: 'Glasses', items: GLASSES_ITEMS },
          { id: 'handbag', label: 'Handbag', items: HANDBAG_ITEMS },
          { id: 'bracelet', label: 'Bracelet', items: BRACELET_ITEMS },
          { id: 'rings', label: 'Rings', items: RINGS_ITEMS },
          { id: 'wings', label: 'Wings', items: WINGS_ITEMS },
          { id: 'gloves', label: 'Gloves', items: GLOVES_ITEMS },
        ];
    }
  }, [mainTab]);

  // Current items for active subCategory
  const currentItems = useMemo(() => {
    const found = subCategoryOptions.find((sc) => sc.id === subCategory);
    let items = found ? found.items : [];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((i) => i.name.toLowerCase().includes(q) || i.style?.toLowerCase().includes(q));
    }

    if (selectedRarity !== 'all') {
      items = items.filter((i) => i.rarity === selectedRarity);
    }

    return items;
  }, [subCategoryOptions, subCategory, searchQuery, selectedRarity]);

  // Handle equipping/unequipping an item
  const handleEquipItem = (item: FashionItem) => {
    soundManager.playEquip();
    const cat = item.category as keyof StylingState;

    // Mutually exclusive behavior:
    // If equipping a dress, unequip top, skirt, pants
    if (item.category === 'dresses') {
      onUpdateStyling({
        ...styling,
        dress: styling.dress === item.id ? undefined : item.id,
        top: undefined,
        skirt: undefined,
        pants: undefined,
      });
      return;
    }

    // If equipping a top, unequip dress
    if (item.category === 'tops') {
      onUpdateStyling({
        ...styling,
        top: styling.top === item.id ? undefined : item.id,
        dress: undefined,
      });
      return;
    }

    // If equipping skirt or pants, unequip dress
    if (item.category === 'skirts') {
      onUpdateStyling({
        ...styling,
        skirt: styling.skirt === item.id ? undefined : item.id,
        pants: undefined,
        dress: undefined,
      });
      return;
    }

    if (item.category === 'pants') {
      onUpdateStyling({
        ...styling,
        pants: styling.pants === item.id ? undefined : item.id,
        skirt: undefined,
        dress: undefined,
      });
      return;
    }

    // Foundation sets active skin tone
    if (item.category === 'foundation') {
      onUpdateStyling({
        ...styling,
        foundation: item.id,
        skinTone: item.color,
      });
      return;
    }

    // Toggle equip standard
    const currentEquipped = styling[cat];
    onUpdateStyling({
      ...styling,
      [cat]: currentEquipped === item.id ? undefined : item.id,
    });
  };

  // Buy locked item directly
  const handleBuyItem = (item: FashionItem) => {
    const result = buyItem(progress, item.id, item.price);
    if (result.success) {
      soundManager.playUnlockSound();
      onUpdateProgress(result.updated);
      setPurchaseAlert(`Sukses membeli "${item.name}"!`);
      setTimeout(() => setPurchaseAlert(null), 2500);
      handleEquipItem(item);
    } else {
      soundManager.playClick();
      setPurchaseAlert(result.error || 'Gagal membeli item!');
      setTimeout(() => setPurchaseAlert(null), 2500);
    }
  };

  // Randomize styling for inspiration
  const handleRandomize = () => {
    soundManager.playEquip();
    const getRandom = (arr: FashionItem[]) => {
      const unlocked = arr.filter((i) => progress.unlockedItems.includes(i.id));
      if (unlocked.length === 0) return undefined;
      return unlocked[Math.floor(Math.random() * unlocked.length)].id;
    };

    onUpdateStyling({
      ...styling,
      hair: getRandom(HAIRSTYLES),
      eyeshadow: getRandom(EYESHADOW_ITEMS),
      eyeliner: getRandom(EYELINER_ITEMS),
      lipstick: getRandom(LIPSTICK_ITEMS),
      blush: getRandom(BLUSH_ITEMS),
      dress: getRandom(DRESSES_ITEMS),
      shoes: getRandom(SHOES_ITEMS),
      necklace: getRandom(NECKLACE_ITEMS),
      earrings: getRandom(EARRINGS_ITEMS),
    });
  };

  // Reset to natural
  const handleReset = () => {
    soundManager.playClick();
    onUpdateStyling({
      skinTone: character.skinTone,
      eyeColor: character.eyeColor,
      hairColor: '#18181B',
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-amber-50 flex flex-col font-sans">
      {/* Studio Header Bar */}
      <header className="w-full bg-neutral-950/90 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between z-20 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            id="btn-studio-back"
            onClick={() => {
              soundManager.playClick();
              onBackToThemes();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs text-neutral-300 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Tema
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl">{theme.icon}</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-amber-200 leading-tight">{theme.name}</span>
              <span className="text-[10px] text-neutral-400">Model: {character.name}</span>
            </div>
          </div>
        </div>

        {/* Currency & Actions */}
        <div className="flex items-center gap-2">
          {/* AI Stylist Button */}
          <button
            id="btn-ai-stylist"
            onClick={() => {
              soundManager.playClick();
              fetchAiAdvice();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600/30 to-rose-600/30 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-semibold shadow hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-purple-300" />
            <span className="hidden sm:inline">AI VIP Stylist</span>
          </button>

          {/* Randomize */}
          <button
            id="btn-randomize-style"
            onClick={handleRandomize}
            title="Acak Paduan Busana"
            className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition-all"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            id="btn-reset-style"
            onClick={handleReset}
            title="Reset ke Tampilan Awal"
            className="p-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Ready for Runway Button */}
          <button
            id="btn-proceed-runway"
            onClick={() => {
              soundManager.playClick();
              onProceedToRunway();
            }}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 text-stone-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            GO TO RUNWAY!
          </button>
        </div>
      </header>

      {/* Main Studio Workspace: Model on Left (40%), Item Wardrobe on Right (60%) */}
      <div className="flex-1 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 p-3 sm:p-5 overflow-hidden">
        {/* Left Column: Model Runway Stage */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between bg-neutral-950/80 border border-amber-500/20 rounded-3xl p-4 relative shadow-2xl overflow-hidden min-h-[420px] lg:min-h-[580px]">
          {/* Zoom controls */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 p-1 rounded-xl">
              {(['full', 'upper', 'face'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    soundManager.playClick();
                    setZoomMode(mode);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase transition-all ${
                    zoomMode === mode ? 'bg-amber-400 text-stone-950 shadow' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {mode === 'full' ? 'Full Body' : mode === 'upper' ? 'Upper' : 'Face'}
                </button>
              ))}
            </div>

            {/* Coins badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-900/90 border border-amber-500/20 rounded-xl text-amber-400 font-semibold text-xs">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[9px] font-black">¢</div>
              <span>{progress.coins.toLocaleString()}</span>
            </div>
          </div>

          {/* Model Canvas */}
          <div className="flex-1 w-full relative flex items-center justify-center my-auto">
            <ModelRenderer
              character={character}
              styling={styling}
              zoomMode={zoomMode}
              pose="glamour"
              showShadow={true}
              className="w-full h-full max-h-[520px]"
            />
          </div>

          {/* Theme Compatibility Hint */}
          <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-2xl p-2.5 text-center text-xs text-neutral-300">
            <span className="text-amber-300 font-semibold">Tips Tema:</span> Rekomendasi warna: {theme.recommendedColors.join(', ')}
          </div>
        </div>

        {/* Right Column: Wardrobe & Styling Item Selector */}
        <div className="lg:col-span-7 flex flex-col bg-neutral-950/70 border border-neutral-800 rounded-3xl p-4 sm:p-5 overflow-hidden shadow-2xl">
          {/* Main Category Tabs */}
          <div className="grid grid-cols-5 gap-1.5 bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800">
            {(
              [
                { id: 'makeup', label: 'Makeup' },
                { id: 'hair', label: 'Hair' },
                { id: 'outfit', label: 'Outfit' },
                { id: 'shoes', label: 'Shoes' },
                { id: 'accessories', label: 'Accs' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                id={`tab-main-${tab.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setMainTab(tab.id);
                  // Set sensible default subCategory
                  if (tab.id === 'makeup') {
                    setSubCategory('eyeshadow');
                    setZoomMode('face');
                  } else if (tab.id === 'hair') {
                    setSubCategory('hair');
                    setZoomMode('upper');
                  } else if (tab.id === 'outfit') {
                    setSubCategory('dress');
                    setZoomMode('full');
                  } else if (tab.id === 'shoes') {
                    setSubCategory('shoes');
                    setZoomMode('full');
                  } else if (tab.id === 'accessories') {
                    setSubCategory('necklace');
                    setZoomMode('upper');
                  }
                }}
                className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                  mainTab === tab.id
                    ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-stone-950 shadow-md'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub-Category Pills */}
          <div className="flex items-center gap-1.5 my-3 overflow-x-auto py-1 scrollbar-none">
            {subCategoryOptions.map((sub) => (
              <button
                key={sub.id}
                id={`subtab-${sub.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setSubCategory(sub.id);
                  if (['foundation', 'blush', 'eyeshadow', 'eyeliner', 'mascara', 'lipstick', 'faceDeco'].includes(sub.id)) {
                    setZoomMode('face');
                  } else if (['necklace', 'earrings', 'crown', 'hairAcc', 'glasses'].includes(sub.id)) {
                    setZoomMode('face');
                  } else {
                    setZoomMode('full');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  subCategory === sub.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Hair Color Palette Selector (Shown when Hair tab is active) */}
          {mainTab === 'hair' && (
            <div className="bg-neutral-900/80 p-3 rounded-2xl border border-neutral-800 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Pilih Warna Rambut (12 Warna):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {HAIR_COLORS.map((col) => {
                  const isCurrent = styling.hairColor === col.color;
                  return (
                    <button
                      key={col.id}
                      onClick={() => {
                        soundManager.playEquip();
                        onUpdateStyling({ ...styling, hairColor: col.color });
                      }}
                      className={`w-7 h-7 rounded-full transition-all flex items-center justify-center flex-shrink-0 border-2 ${
                        isCurrent ? 'border-amber-400 scale-110 shadow-md' : 'border-neutral-700 hover:scale-105'
                      }`}
                      style={{ background: col.gradient || col.color }}
                      title={col.name}
                    >
                      {isCurrent && <Check className="w-3.5 h-3.5 stroke-[3] text-white drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search & Filter Controls */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900/90 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Rarity filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none"
            >
              <option value="all">Semua Rarity</option>
              <option value="common">Common</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>

          {/* Purchase Toast Alert */}
          {purchaseAlert && (
            <div className="mb-2 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <span>{purchaseAlert}</span>
              <button onClick={() => setPurchaseAlert(null)}><X className="w-3.5 h-3.5" /></button>
            </div>
          )}

          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[360px] lg:max-h-[420px]">
            {currentItems.map((item) => {
              const catKey = item.category as keyof StylingState;
              const isEquipped = styling[catKey] === item.id;
              const isUnlocked = progress.unlockedItems.includes(item.id);
              const isCompatible = item.compatibleThemes.includes(theme.id);

              return (
                <div
                  key={item.id}
                  id={`item-${item.id}`}
                  onClick={() => {
                    if (isUnlocked) {
                      handleEquipItem(item);
                    }
                  }}
                  className={`flex flex-col p-2.5 rounded-2xl cursor-pointer transition-all border relative group ${
                    isEquipped
                      ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                      : isUnlocked
                      ? 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/90'
                      : 'bg-neutral-950/70 border-neutral-900 opacity-80'
                  }`}
                >
                  {/* Theme compatibility badge */}
                  {isCompatible && (
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-bold z-10" title="Sesuai dengan tema panggung!">
                      <Sparkles className="w-2 h-2" /> Match
                    </div>
                  )}

                  {/* Visual Color Preview */}
                  <div className="w-full h-16 rounded-xl bg-neutral-950/80 flex items-center justify-center relative overflow-hidden mb-2">
                    <div
                      className="w-8 h-8 rounded-full border border-neutral-700 shadow-inner transition-transform group-hover:scale-110"
                      style={{ backgroundColor: item.color }}
                    />
                    {isEquipped && (
                      <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                    {!isUnlocked && (
                      <div className="absolute inset-0 bg-neutral-950/70 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-neutral-400" />
                      </div>
                    )}
                  </div>

                  {/* Title & Style */}
                  <h4 className="text-[11px] font-bold text-neutral-100 truncate leading-tight">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <span
                      className={`capitalize font-semibold ${
                        item.rarity === 'legendary'
                          ? 'text-amber-400'
                          : item.rarity === 'epic'
                          ? 'text-purple-400'
                          : item.rarity === 'rare'
                          ? 'text-blue-400'
                          : 'text-neutral-400'
                      }`}
                    >
                      {item.rarity}
                    </span>

                    {/* Price or unlocked state */}
                    {!isUnlocked ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyItem(item);
                        }}
                        className="px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 transition-colors flex items-center gap-1"
                      >
                        ¢{item.price}
                      </button>
                    ) : (
                      <span className="text-[9px] text-neutral-400">Dimiliki</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI VIP Stylist Advice Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-purple-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-purple-200">AI VIP Runway Stylist</h3>
                <p className="text-xs text-neutral-400">Konsultasi Eksklusif Gemini Fashion AI</p>
              </div>
            </div>

            {aiLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-neutral-400">
                <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-semibold">Menganalisis harmoni warna & tema runway...</span>
              </div>
            ) : aiAdvice ? (
              <div className="space-y-4 text-xs text-neutral-200">
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 font-serif italic text-sm text-purple-100">
                  "{aiAdvice.greeting}"
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] block">
                    3 Tips Utama Stylist:
                  </span>
                  {aiAdvice.tips.map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800">
                      <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                  <span className="font-bold block mb-1">Secret Score Booster:</span>
                  <p>{aiAdvice.secretTip}</p>
                </div>
              </div>
            ) : null}

            <button
              onClick={() => setShowAiModal(false)}
              className="w-full mt-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-all cursor-pointer"
            >
              Mengerti & Kembali Styling
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
