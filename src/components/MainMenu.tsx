import React from 'react';
import { PlayerProgress } from '../utils/playerProgress';
import { soundManager } from '../utils/audio';
import { Sparkles, ShoppingBag, Camera, Trophy, Play, Volume2, VolumeX, Music } from 'lucide-react';

interface MainMenuProps {
  progress: PlayerProgress;
  onStartGame: () => void;
  onOpenShop: () => void;
  onOpenGallery: () => void;
  onOpenThemes: () => void;
  isBgmOn: boolean;
  isSfxOn: boolean;
  onToggleBgm: () => void;
  onToggleSfx: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onStartGame,
  onOpenShop,
  onOpenGallery,
  onOpenThemes,
  isBgmOn,
  isSfxOn,
  onToggleBgm,
  onToggleSfx,
}) => {
  const expPercentage = Math.min(100, Math.round((progress.exp / progress.expToNextLevel) * 100));

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-amber-50 overflow-hidden font-sans">
      {/* Runway stage ambient lights */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-72 bg-gradient-to-t from-amber-400/15 via-rose-500/10 to-transparent blur-2xl pointer-events-none" />

      {/* Top Header: Player Currency & Audio Controls */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10 gap-2 flex-wrap">
        {/* Level & Currency */}
        <div className="flex items-center gap-3 bg-neutral-900/80 backdrop-blur-md border border-amber-500/20 px-4 py-2 rounded-2xl shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-stone-950 font-bold flex items-center justify-center text-sm shadow-md">
              {progress.level}
            </div>
            <div className="flex flex-col text-xs">
              <span className="text-amber-300/80 font-semibold tracking-wider uppercase text-[10px]">Stylist Rank</span>
              <div className="w-20 bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-0.5">
                <div className="bg-amber-400 h-full rounded-full transition-all duration-300" style={{ width: `${expPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="h-6 w-px bg-neutral-800" />

          {/* Coins */}
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-sm">
            <div className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-[10px] font-black">¢</div>
            <span>{progress.coins.toLocaleString()}</span>
          </div>

          <div className="h-6 w-px bg-neutral-800" />

          {/* Stars */}
          <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-sm">
            <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>{progress.stars}</span>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 px-3 py-2 rounded-2xl">
          <button
            id="btn-toggle-bgm"
            onClick={() => {
              soundManager.playClick();
              onToggleBgm();
            }}
            className={`p-2 rounded-xl transition-all ${isBgmOn ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-500 hover:text-neutral-300'}`}
            title={isBgmOn ? 'Mute BGM' : 'Unmute BGM'}
          >
            <Music className="w-4 h-4" />
          </button>
          <button
            id="btn-toggle-sfx"
            onClick={() => {
              soundManager.playClick();
              onToggleSfx();
            }}
            className={`p-2 rounded-xl transition-all ${isSfxOn ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-500 hover:text-neutral-300'}`}
            title={isSfxOn ? 'Mute SFX' : 'Unmute SFX'}
          >
            {isSfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Center Title & Runway Hero */}
      <main className="w-full max-w-4xl flex flex-col items-center justify-center text-center my-auto py-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs tracking-widest uppercase mb-4 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" /> High Fashion Runway & Battle Game
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-black tracking-tight bg-gradient-to-r from-amber-100 via-amber-300 to-rose-300 bg-clip-text text-transparent drop-shadow-2xl">
          GLAM RUNWAY
        </h1>
        <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-xl font-light">
          Kuasai panggung catwalk dunia! Padukan riasan artistik, busana haute couture, dan taklukkan dewan juri selebritas.
        </p>

        {/* Primary Action Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full justify-center max-w-md">
          <button
            id="btn-start-runway"
            onClick={() => {
              soundManager.playClick();
              onStartGame();
            }}
            className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 text-stone-950 font-bold text-lg tracking-wide shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Play className="w-5 h-5 fill-stone-950 group-hover:translate-x-0.5 transition-transform" />
            MULAI RUNWAY
          </button>
        </div>

        {/* Sub Navigation Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 w-full max-w-lg">
          <button
            id="btn-nav-boutique"
            onClick={() => {
              soundManager.playClick();
              onOpenShop();
            }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-neutral-200">Boutique</span>
            <span className="text-[10px] text-neutral-400">Shop Items</span>
          </button>

          <button
            id="btn-nav-themes"
            onClick={() => {
              soundManager.playClick();
              onOpenThemes();
            }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-neutral-200">18 Tema</span>
            <span className="text-[10px] text-neutral-400">Runway Themes</span>
          </button>

          <button
            id="btn-nav-gallery"
            onClick={() => {
              soundManager.playClick();
              onOpenGallery();
            }}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800 hover:border-amber-500/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-300 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-neutral-200">Galeri Foto</span>
            <span className="text-[10px] text-neutral-400">Cover Majalah</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl flex items-center justify-between text-xs text-neutral-400 py-3 border-t border-neutral-800/60 z-10">
        <div>GLAM RUNWAY &copy; 2026 Edition</div>
        <div className="flex items-center gap-2 text-neutral-400">
          <span>AI Powered Stylist</span>
          <span>•</span>
          <span>Google Gemini API</span>
        </div>
      </footer>
    </div>
  );
};
