import React, { useState, useRef } from 'react';
import { Character, FashionTheme, StylingState } from '../types';
import { PlayerProgress, savePlayerProgress, SavedPhoto } from '../utils/playerProgress';
import { ModelRenderer } from './ModelRenderer';
import { soundManager } from '../utils/audio';
import { Camera, Download, Sparkles, ArrowLeft, Check, Share2, Layers, Sliders } from 'lucide-react';

interface PhotoStudioProps {
  character: Character;
  theme: FashionTheme;
  styling: StylingState;
  progress: PlayerProgress;
  onUpdateProgress: (newProgress: PlayerProgress) => void;
  onBackToMenu: () => void;
  onPlayAgain: () => void;
}

type PoseType = 'casual' | 'glamour' | 'cute' | 'fierce' | 'elegant' | 'dynamic';
type FilterType = 'none' | 'vintage' | 'glamour' | 'cyber' | 'bw' | 'golden' | 'pastel';
type BgType = 'studio' | 'paris' | 'tokyo' | 'redcarpet' | 'castle' | 'sunset';

export const PhotoStudio: React.FC<PhotoStudioProps> = ({
  character,
  theme,
  styling,
  progress,
  onUpdateProgress,
  onBackToMenu,
  onPlayAgain,
}) => {
  const [pose, setPose] = useState<PoseType>('glamour');
  const [filter, setFilter] = useState<FilterType>('glamour');
  const [background, setBackground] = useState<BgType>('paris');
  const [magazineTitle, setMagazineTitle] = useState<string>('GLAM RUNWAY');
  const [subHeadline, setSubHeadline] = useState<string>('THE HAUTE COUTURE ISSUE');
  const [activeStickers, setActiveStickers] = useState<string[]>(['vip_pass', 'sparkle']);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const previewFrameRef = useRef<HTMLDivElement>(null);

  // Background visual styles
  const bgStyles: Record<BgType, { name: string; bgClass: string; icon: string }> = {
    studio: {
      name: 'Studio Minimal',
      bgClass: 'bg-gradient-to-b from-neutral-800 via-neutral-900 to-black',
      icon: '🏛️',
    },
    paris: {
      name: 'Paris Runway',
      bgClass: 'bg-gradient-to-b from-slate-900 via-purple-950 to-neutral-950',
      icon: '🗼',
    },
    tokyo: {
      name: 'Tokyo Cyber',
      bgClass: 'bg-gradient-to-b from-indigo-950 via-fuchsia-950 to-black',
      icon: '🌆',
    },
    redcarpet: {
      name: 'Red Carpet',
      bgClass: 'bg-gradient-to-b from-red-950 via-neutral-950 to-black',
      icon: '💎',
    },
    castle: {
      name: 'Fantasy Castle',
      bgClass: 'bg-gradient-to-b from-violet-950 via-rose-950 to-stone-950',
      icon: '🏰',
    },
    sunset: {
      name: 'Golden Hour',
      bgClass: 'bg-gradient-to-b from-amber-700/60 via-rose-950 to-neutral-950',
      icon: '🌅',
    },
  };

  // CSS Filter styles
  const filterStyles: Record<FilterType, { name: string; css: string }> = {
    none: { name: 'Normal', css: '' },
    vintage: { name: 'Vintage', css: 'sepia(45%) contrast(110%) brightness(95%)' },
    glamour: { name: 'Glamour', css: 'saturate(130%) contrast(105%) brightness(105%)' },
    cyber: { name: 'Cyber', css: 'hue-rotate(25deg) saturate(160%) contrast(120%)' },
    bw: { name: 'B&W Noir', css: 'grayscale(100%) contrast(130%) brightness(105%)' },
    golden: { name: 'Golden Hour', css: 'sepia(25%) saturate(140%) contrast(105%)' },
    pastel: { name: 'Pastel', css: 'saturate(85%) brightness(115%) contrast(95%)' },
  };

  // Take Snapshot & Save to Album
  const handleSnapPhoto = () => {
    soundManager.playCamera();
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const newPhoto: SavedPhoto = {
      id: `photo_${Date.now()}`,
      themeName: theme.name,
      characterName: character.name,
      score: 95,
      stars: 5,
      date: new Date().toLocaleDateString('id-ID'),
      pose,
      background,
      filter,
    };

    const updatedPhotos = [newPhoto, ...(progress.photos || [])];
    const updatedProgress = { ...progress, photos: updatedPhotos };
    savePlayerProgress(updatedProgress);
    onUpdateProgress(updatedProgress);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Download rendered magazine cover as PNG via SVG rendering
  const handleDownload = () => {
    soundManager.playCamera();
    handleSnapPhoto();

    try {
      const svgElement = document.querySelector('#glam-model-canvas svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      canvas.width = 600;
      canvas.height = 840;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, 600, 840);

      // Draw model SVG
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 50, 100, 500, 700);

        // Draw Magazine Title
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 54px Playfair Display, serif';
        ctx.textAlign = 'center';
        ctx.fillText(magazineTitle, 300, 80);

        // Subtitle
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Montserrat, sans-serif';
        ctx.fillText(subHeadline, 300, 115);

        // Model Credit
        ctx.font = 'bold 20px Montserrat, sans-serif';
        ctx.fillStyle = '#FBBF24';
        ctx.fillText(`STARRING ${character.name.toUpperCase()}`, 300, 800);

        // Download trigger
        const a = document.createElement('a');
        a.download = `GlamRunway_${character.name}_${theme.name}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (e) {
      console.warn('Canvas download error fallback:', e);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-amber-50 p-4 sm:p-8 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-4 border-b border-neutral-800">
        <button
          id="btn-photo-back"
          onClick={() => {
            soundManager.playClick();
            onBackToMenu();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs text-neutral-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Menu Utama
        </button>

        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-amber-100">STUDIO FOTO & COVER MAJALAH</h2>
          <p className="text-xs text-neutral-400">Rancang Cover Majalah Fashion & Simpan Kenangan</p>
        </div>

        <button
          id="btn-photo-playagain"
          onClick={() => {
            soundManager.playClick();
            onPlayAgain();
          }}
          className="px-3 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-all"
        >
          Main Lagi
        </button>
      </div>

      {/* Main Studio Area */}
      <div className="w-full max-w-6xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-6">
        {/* Left Column: Magazine Cover Preview Frame */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div
            ref={previewFrameRef}
            className={`w-[320px] sm:w-[380px] h-[480px] sm:h-[560px] rounded-3xl p-5 relative overflow-hidden shadow-2xl border-4 border-amber-400/40 flex flex-col justify-between ${
              bgStyles[background].bgClass
            }`}
            style={{ filter: filterStyles[filter].css }}
          >
            {/* Camera flash white effect */}
            {isFlashing && <div className="absolute inset-0 bg-white z-50 animate-ping" />}

            {/* Magazine Header Masthead */}
            <div className="z-10 text-center">
              <span className="text-[9px] uppercase tracking-[0.3em] text-amber-200/80 block font-sans">
                GLOBAL FASHION EDITION
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-black tracking-tight text-amber-200 drop-shadow-md">
                {magazineTitle}
              </h1>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-neutral-200 mt-0.5">
                {subHeadline}
              </p>
            </div>

            {/* Model Avatar */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mt-10">
              <ModelRenderer
                character={character}
                styling={styling}
                zoomMode="full"
                pose={pose}
                showShadow={true}
                className="w-full h-full scale-105"
              />
            </div>

            {/* Fashion Stickers / Overlays */}
            <div className="z-10 flex flex-col gap-2 pointer-events-none">
              {activeStickers.includes('vip_pass') && (
                <div className="self-start px-2 py-1 rounded-md bg-amber-400 text-stone-950 font-black text-[9px] uppercase tracking-wider shadow">
                  ★ VIP FRONT ROW
                </div>
              )}
              {activeStickers.includes('runway_queen') && (
                <div className="self-start px-2 py-1 rounded-md bg-rose-500 text-white font-black text-[9px] uppercase tracking-wider shadow">
                  RUNWAY QUEEN 2026
                </div>
              )}
            </div>

            {/* Magazine Footer Headlines */}
            <div className="z-10 flex items-end justify-between text-neutral-100">
              <div>
                <span className="text-[10px] font-bold text-amber-300 uppercase block">FEATURING</span>
                <span className="text-base sm:text-lg font-serif font-bold text-white drop-shadow">
                  {character.name}
                </span>
                <span className="text-[10px] text-neutral-300 block">Theme: {theme.name}</span>
              </div>

              {/* Barcode mockup */}
              <div className="bg-white/90 p-1.5 rounded text-stone-950 text-[8px] font-mono text-center shadow">
                ||||||||||||||||||
                <span className="block text-[6px]">ISSUE #42</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Snap & Download */}
          <div className="flex items-center gap-3 mt-4 w-full max-w-[380px]">
            <button
              id="btn-snap-photo"
              onClick={handleSnapPhoto}
              className="flex-1 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              Ambil Foto
            </button>

            <button
              id="btn-download-photo"
              onClick={handleDownload}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Cover
            </button>
          </div>

          {savedSuccess && (
            <div className="mt-2 text-xs text-amber-400 font-semibold flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4" /> Tersimpan ke Galeri Foto Album!
            </div>
          )}
        </div>

        {/* Right Column: Studio Customizer Controls */}
        <div className="lg:col-span-6 bg-neutral-950/80 border border-neutral-800 rounded-3xl p-5 space-y-4">
          {/* Pose Selector */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Pilih Pose Model:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: 'casual', label: 'Casual' },
                  { id: 'glamour', label: 'Glamour' },
                  { id: 'cute', label: 'Cute' },
                  { id: 'fierce', label: 'Fierce' },
                  { id: 'elegant', label: 'Elegant' },
                  { id: 'dynamic', label: 'Dynamic' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    soundManager.playClick();
                    setPose(p.id);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border ${
                    pose === p.id
                      ? 'bg-amber-400 text-stone-950 border-amber-400 shadow'
                      : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Background Scene Selector */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Pilih Background Lokasi:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(bgStyles) as BgType[]).map((bgKey) => (
                <button
                  key={bgKey}
                  onClick={() => {
                    soundManager.playClick();
                    setBackground(bgKey);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    background === bgKey
                      ? 'bg-amber-400 text-stone-950 border-amber-400 shadow'
                      : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <span>{bgStyles[bgKey].icon}</span>
                  <span className="truncate">{bgStyles[bgKey].name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Selector */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Pilih Filter Estetik:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(filterStyles) as FilterType[]).map((fKey) => (
                <button
                  key={fKey}
                  onClick={() => {
                    soundManager.playClick();
                    setFilter(fKey);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    filter === fKey
                      ? 'bg-amber-400 text-stone-950 border-amber-400 shadow'
                      : 'bg-neutral-900/60 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {filterStyles[fKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Magazine Cover Title Presets */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Preset Judul Majalah:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { title: 'GLAM RUNWAY', sub: 'THE HAUTE COUTURE ISSUE' },
                { title: 'VOGUE CHIC', sub: 'PARIS FASHION WEEK EDITION' },
                { title: 'CYBER STYLE', sub: 'NEON RUNWAY SPECIAL' },
                { title: 'ELLE ROYALE', sub: 'RED CARPET ICONS 2026' },
              ].map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    soundManager.playClick();
                    setMagazineTitle(preset.title);
                    setSubHeadline(preset.sub);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 text-xs text-neutral-200 font-serif"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Sticker Toggles */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
              Stiker Fashion:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveStickers((prev) =>
                    prev.includes('vip_pass') ? prev.filter((s) => s !== 'vip_pass') : [...prev, 'vip_pass']
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  activeStickers.includes('vip_pass')
                    ? 'bg-amber-400 text-stone-950 border-amber-400'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                }`}
              >
                VIP Pass
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  setActiveStickers((prev) =>
                    prev.includes('runway_queen')
                      ? prev.filter((s) => s !== 'runway_queen')
                      : [...prev, 'runway_queen']
                  );
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  activeStickers.includes('runway_queen')
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                }`}
              >
                Runway Queen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
