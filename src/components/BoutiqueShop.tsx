import React, { useState, useMemo } from 'react';
import { ALL_ITEMS } from '../data/items';
import { FashionItem } from '../types';
import { PlayerProgress, buyItem } from '../utils/playerProgress';
import { soundManager } from '../utils/audio';
import { ArrowLeft, ShoppingBag, Sparkles, Check, Search, Lock, Filter } from 'lucide-react';

interface BoutiqueShopProps {
  progress: PlayerProgress;
  onUpdateProgress: (newProgress: PlayerProgress) => void;
  onBack: () => void;
}

export const BoutiqueShop: React.FC<BoutiqueShopProps> = ({
  progress,
  onUpdateProgress,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered items
  const filteredItems = useMemo(() => {
    return ALL_ITEMS.filter((item) => {
      // Exclude items that are already unlocked by default if viewing shop to buy
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'outfit' && !['tops', 'dresses', 'skirts', 'pants', 'jackets'].includes(item.category)) {
          return false;
        }
        if (selectedCategory === 'makeup' && !['foundation', 'blush', 'eyeshadow', 'eyeliner', 'mascara', 'lipstick', 'faceDeco'].includes(item.category)) {
          return false;
        }
        if (selectedCategory === 'accessories' && !['necklace', 'earrings', 'bracelet', 'rings', 'handbag', 'glasses', 'crown', 'hairAcc', 'wings', 'gloves'].includes(item.category)) {
          return false;
        }
        if (selectedCategory === 'hair' && item.category !== 'hair') return false;
        if (selectedCategory === 'shoes' && item.category !== 'shoes') return false;
      }

      if (selectedRarity !== 'all' && item.rarity !== selectedRarity) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.style?.toLowerCase().includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedRarity, searchQuery]);

  const handleBuy = (item: FashionItem) => {
    const result = buyItem(progress, item.id, item.price);
    if (result.success) {
      soundManager.playUnlockSound();
      onUpdateProgress(result.updated);
      setToastMessage(`Berhasil membuka "${item.name}"!`);
      setTimeout(() => setToastMessage(null), 2500);
    } else {
      soundManager.playClick();
      setToastMessage(result.error || 'Koin tidak cukup!');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-amber-50 p-4 sm:p-8 flex flex-col font-sans">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-4 border-b border-neutral-800 flex-wrap gap-3">
        <button
          id="btn-shop-back"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs text-neutral-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center justify-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            HAUTE BOUTIQUE
          </h2>
          <p className="text-xs text-neutral-400">Koleksi Busana & Aksesoris Runway Eksklusif</p>
        </div>

        {/* Currency badge */}
        <div className="flex items-center gap-2 bg-neutral-900/90 border border-amber-500/20 px-3 py-1.5 rounded-2xl text-amber-400 font-bold text-xs">
          <div className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-black">¢</div>
          <span>{progress.coins.toLocaleString()} Koin</span>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="w-full max-w-md mx-auto my-3 p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-semibold text-center animate-fadeIn">
          {toastMessage}
        </div>
      )}

      {/* Filters Bar */}
      <div className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 my-4">
        {/* Category tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          {[
            { id: 'all', label: 'Semua Item' },
            { id: 'outfit', label: 'Outfit & Gaun' },
            { id: 'makeup', label: 'Makeup' },
            { id: 'hair', label: 'Rambut' },
            { id: 'shoes', label: 'Sepatu' },
            { id: 'accessories', label: 'Aksesoris' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-amber-400 text-stone-950 border-amber-400 shadow'
                  : 'bg-neutral-900/60 text-neutral-400 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Rarity */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
            />
          </div>

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
      </div>

      {/* Boutique Items Grid */}
      <div className="w-full max-w-6xl mx-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 py-2 overflow-y-auto">
        {filteredItems.map((item) => {
          const isUnlocked = progress.unlockedItems.includes(item.id);

          return (
            <div
              key={item.id}
              className={`flex flex-col justify-between p-3 rounded-2xl border transition-all ${
                isUnlocked
                  ? 'bg-neutral-900/40 border-neutral-800'
                  : 'bg-neutral-900/80 border-neutral-800 hover:border-amber-500/40'
              }`}
            >
              {/* Item color / icon container */}
              <div className="w-full h-24 rounded-xl bg-neutral-950/80 flex items-center justify-center relative overflow-hidden mb-2">
                <div
                  className="w-10 h-10 rounded-full border border-neutral-700 shadow-inner"
                  style={{ backgroundColor: item.color }}
                />
                {isUnlocked ? (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-[10px]">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center">
                    <Lock className="w-3 h-3" />
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-neutral-100 truncate">{item.name}</h4>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-neutral-400 capitalize">{item.category}</span>
                  <span
                    className={`font-semibold capitalize ${
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
                </div>
              </div>

              <div className="mt-3">
                {isUnlocked ? (
                  <div className="w-full py-1.5 rounded-xl bg-neutral-800/60 text-neutral-400 text-xs font-semibold text-center">
                    Dimiliki
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(item)}
                    className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 text-xs font-bold transition-all shadow flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Beli ¢{item.price}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
