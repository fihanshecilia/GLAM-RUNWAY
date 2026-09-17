import React from 'react';
import { PlayerProgress, savePlayerProgress } from '../utils/playerProgress';
import { soundManager } from '../utils/audio';
import { ArrowLeft, Camera, Trash2, Calendar, Star, Sparkles } from 'lucide-react';

interface PhotoGalleryProps {
  progress: PlayerProgress;
  onUpdateProgress: (newProgress: PlayerProgress) => void;
  onBack: () => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  progress,
  onUpdateProgress,
  onBack,
}) => {
  const photos = progress.photos || [];

  const handleDeletePhoto = (photoId: string) => {
    soundManager.playClick();
    const updated = {
      ...progress,
      photos: photos.filter((p) => p.id !== photoId),
    };
    savePlayerProgress(updated);
    onUpdateProgress(updated);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-amber-50 p-4 sm:p-8 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-4 border-b border-neutral-800">
        <button
          id="btn-gallery-back"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs text-neutral-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Menu Utama
        </button>

        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-amber-100 flex items-center justify-center gap-2">
            <Camera className="w-5 h-5 text-purple-400" />
            GALERI COVER MAJALAH
          </h2>
          <p className="text-xs text-neutral-400">Arsip Pemotretan & Prestasi Runway Anda ({photos.length} Foto)</p>
        </div>

        <div className="w-20" />
      </div>

      {/* Gallery Content */}
      <div className="w-full max-w-6xl mx-auto flex-1 py-6">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 text-neutral-400">
            <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4 text-neutral-500">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif font-bold text-neutral-300">Belum Ada Foto Tersimpan</h3>
            <p className="text-xs text-neutral-500 max-w-xs mt-1">
              Selesaikan sesi fashion show di runway, lalu ambil foto di Studio Cover Majalah untuk mengisi galeri ini!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="bg-neutral-950/80 border border-neutral-800 rounded-3xl p-4 flex flex-col justify-between shadow-xl relative group hover:border-amber-500/40 transition-all"
              >
                {/* Visual card header */}
                <div className="w-full h-48 rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 border border-neutral-700/50 flex flex-col items-center justify-center p-3 relative overflow-hidden text-center">
                  <div className="z-10">
                    <span className="text-[9px] uppercase tracking-widest text-amber-300/80 font-bold block">
                      MAGAZINE COVER
                    </span>
                    <h4 className="text-base font-serif font-bold text-amber-100 mt-1">
                      {photo.characterName}
                    </h4>
                    <span className="text-xs text-neutral-300 font-sans block mt-0.5">
                      {photo.themeName}
                    </span>
                  </div>

                  <div className="mt-3 z-10 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= photo.stars ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Filter badge */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[9px] text-neutral-300 capitalize">
                    {photo.filter}
                  </div>
                </div>

                {/* Meta details */}
                <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Calendar className="w-3 h-3 text-neutral-500" />
                    <span>{photo.date}</span>
                  </div>

                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    title="Hapus Foto"
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
