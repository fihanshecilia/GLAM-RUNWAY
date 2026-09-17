import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { Character, StylingState } from '../types';
import { ModelRenderer } from './ModelRenderer';
import { soundManager } from '../utils/audio';
import { ArrowLeft, Check, Sparkles, User } from 'lucide-react';

interface CharacterSelectProps {
  onSelectCharacter: (character: Character) => void;
  onBack: () => void;
}

export const CharacterSelect: React.FC<CharacterSelectProps> = ({
  onSelectCharacter,
  onBack,
}) => {
  const [selectedId, setSelectedId] = useState<string>(CHARACTERS[0].id);
  const selectedCharacter = CHARACTERS.find((c) => c.id === selectedId) || CHARACTERS[0];

  // Default empty styling for model preview
  const previewStyling: StylingState = {
    foundation: selectedCharacter.skinTone,
    hairColor: '#18181B',
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-stone-950 via-neutral-900 to-black text-amber-50 p-4 sm:p-8 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-4 border-b border-neutral-800">
        <button
          id="btn-char-back"
          onClick={() => {
            soundManager.playClick();
            onBack();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-sm text-neutral-300 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </button>

        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-100">PILIH MODEL RUNWAY</h2>
          <p className="text-xs text-neutral-400">Pilih karakter muse untuk kompetisi fashion show</p>
        </div>

        <div className="w-20" />
      </div>

      {/* Main Content Area: Model Preview on Left, Character Cards Grid on Right */}
      <div className="w-full max-w-6xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center py-6">
        {/* Left Column: Model Stage & Details */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-neutral-950/70 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          {/* Spotlight aura */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Model 2D Renderer */}
          <div className="w-64 h-80 sm:h-96 relative flex items-center justify-center">
            <ModelRenderer
              character={selectedCharacter}
              styling={previewStyling}
              zoomMode="full"
              pose="glamour"
              showShadow={true}
              className="w-full h-full"
            />
          </div>

          {/* Selected Character Bio Info */}
          <div className="w-full text-center mt-4 bg-neutral-900/80 p-4 rounded-2xl border border-neutral-800">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-serif font-bold text-amber-200">{selectedCharacter.name}</h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {selectedCharacter.baseStyle}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">{selectedCharacter.bio}</p>

            {/* Badges */}
            <div className="flex items-center justify-center gap-3 mt-3 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">Skin:</span>
                <span className="w-3.5 h-3.5 rounded-full border border-neutral-700" style={{ backgroundColor: selectedCharacter.skinTone }} />
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">Eyes:</span>
                <span className="w-3.5 h-3.5 rounded-full border border-neutral-700" style={{ backgroundColor: selectedCharacter.eyeColor }} />
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-semibold text-neutral-400">Body:</span>
                <span className="capitalize text-amber-100">{selectedCharacter.bodyShape}</span>
              </div>
            </div>

            {/* Confirm Selection Button */}
            <button
              id="btn-confirm-character"
              onClick={() => {
                soundManager.playClick();
                onSelectCharacter(selectedCharacter);
              }}
              className="w-full mt-4 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              PILIH {selectedCharacter.name.toUpperCase()} & LANJUT KE TEMA
            </button>
          </div>
        </div>

        {/* Right Column: Character Selection Grid */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> 8 Model Pilihan
            </span>
            <span className="text-xs text-amber-400/80">Klik untuk melihat preview</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHARACTERS.map((char) => {
              const isSelected = char.id === selectedId;
              return (
                <div
                  key={char.id}
                  id={`card-char-${char.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedId(char.id);
                  }}
                  className={`flex flex-col p-3 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-neutral-800/90 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.03]'
                      : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80'
                  }`}
                >
                  <div className="w-full h-24 rounded-xl bg-neutral-950/60 overflow-hidden flex items-center justify-center relative">
                    <ModelRenderer
                      character={char}
                      styling={{ hairColor: '#18181B' }}
                      zoomMode="face"
                      pose="casual"
                      className="w-full h-full scale-125"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="mt-2.5">
                    <h4 className="text-xs font-bold text-neutral-100 truncate">{char.name}</h4>
                    <p className="text-[10px] text-amber-400/80 capitalize">{char.baseStyle}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-neutral-700"
                        style={{ backgroundColor: char.skinTone }}
                        title="Skin Tone"
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-neutral-700"
                        style={{ backgroundColor: char.eyeColor }}
                        title="Eye Color"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
