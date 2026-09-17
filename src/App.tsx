import React, { useState, useEffect } from 'react';
import { Character, FashionTheme, StylingState } from './types';
import { CHARACTERS } from './data/characters';
import { FASHION_THEMES } from './data/themes';
import { PlayerProgress, loadPlayerProgress, savePlayerProgress } from './utils/playerProgress';
import { soundManager } from './utils/audio';

import { MainMenu } from './components/MainMenu';
import { CharacterSelect } from './components/CharacterSelect';
import { ThemeSelect } from './components/ThemeSelect';
import { StylingStudio } from './components/StylingStudio';
import { RunwayShow } from './components/RunwayShow';
import { JudgingScreen } from './components/JudgingScreen';
import { PhotoStudio } from './components/PhotoStudio';
import { BoutiqueShop } from './components/BoutiqueShop';
import { PhotoGallery } from './components/PhotoGallery';
import { ThemeGallery } from './components/ThemeGallery';

type ScreenState =
  | 'menu'
  | 'character-select'
  | 'theme-select'
  | 'styling-studio'
  | 'runway-show'
  | 'judging'
  | 'photo-studio'
  | 'shop'
  | 'gallery'
  | 'theme-gallery';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('menu');
  const [progress, setProgress] = useState<PlayerProgress>(() => loadPlayerProgress());

  // Audio states
  const [isBgmOn, setIsBgmOn] = useState<boolean>(true);
  const [isSfxOn, setIsSfxOn] = useState<boolean>(true);

  // Active game session state
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [selectedTheme, setSelectedTheme] = useState<FashionTheme>(FASHION_THEMES[0]);
  const [styling, setStyling] = useState<StylingState>({
    skinTone: CHARACTERS[0].skinTone,
    eyeColor: CHARACTERS[0].eyeColor,
    hairColor: '#18181B',
  });

  // Keep soundManager muted state synced
  useEffect(() => {
    soundManager.setMuted(!isSfxOn);
  }, [isSfxOn]);

  useEffect(() => {
    if (isBgmOn && screen === 'menu') {
      soundManager.startRunwayBgm();
    } else if (!isBgmOn) {
      soundManager.stopBgm();
    }
  }, [isBgmOn, screen]);

  // Handler: Update progress and persist
  const handleUpdateProgress = (newProgress: PlayerProgress) => {
    setProgress(newProgress);
    savePlayerProgress(newProgress);
  };

  // Handler: Start New Game
  const handleStartGame = () => {
    setScreen('character-select');
  };

  // Handler: Select Character
  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    // Reset styling with selected character's base traits
    setStyling({
      skinTone: character.skinTone,
      eyeColor: character.eyeColor,
      hairColor: '#18181B',
    });
    setScreen('theme-select');
  };

  // Handler: Select Theme
  const handleSelectTheme = (theme: FashionTheme) => {
    setSelectedTheme(theme);
    setScreen('styling-studio');
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 text-neutral-100 selection:bg-amber-400 selection:text-stone-950 font-sans">
      {screen === 'menu' && (
        <MainMenu
          progress={progress}
          onStartGame={handleStartGame}
          onOpenShop={() => setScreen('shop')}
          onOpenGallery={() => setScreen('gallery')}
          onOpenThemes={() => setScreen('theme-gallery')}
          isBgmOn={isBgmOn}
          isSfxOn={isSfxOn}
          onToggleBgm={() => {
            const next = !isBgmOn;
            setIsBgmOn(next);
            if (!next) soundManager.stopBgm();
            else soundManager.startRunwayBgm();
          }}
          onToggleSfx={() => setIsSfxOn(!isSfxOn)}
        />
      )}

      {screen === 'character-select' && (
        <CharacterSelect
          onSelectCharacter={handleSelectCharacter}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'theme-select' && (
        <ThemeSelect
          highScores={progress.highScores}
          onSelectTheme={handleSelectTheme}
          onBack={() => setScreen('character-select')}
        />
      )}

      {screen === 'styling-studio' && (
        <StylingStudio
          character={selectedCharacter}
          theme={selectedTheme}
          progress={progress}
          styling={styling}
          onUpdateStyling={setStyling}
          onUpdateProgress={handleUpdateProgress}
          onProceedToRunway={() => setScreen('runway-show')}
          onBackToThemes={() => setScreen('theme-select')}
        />
      )}

      {screen === 'runway-show' && (
        <RunwayShow
          character={selectedCharacter}
          theme={selectedTheme}
          styling={styling}
          onFinishShow={() => setScreen('judging')}
        />
      )}

      {screen === 'judging' && (
        <JudgingScreen
          character={selectedCharacter}
          theme={selectedTheme}
          styling={styling}
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          onGotoPhotoStudio={() => setScreen('photo-studio')}
          onPlayAgain={() => setScreen('theme-select')}
          onOpenShop={() => setScreen('shop')}
        />
      )}

      {screen === 'photo-studio' && (
        <PhotoStudio
          character={selectedCharacter}
          theme={selectedTheme}
          styling={styling}
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          onBackToMenu={() => setScreen('menu')}
          onPlayAgain={() => setScreen('theme-select')}
        />
      )}

      {screen === 'shop' && (
        <BoutiqueShop
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'gallery' && (
        <PhotoGallery
          progress={progress}
          onUpdateProgress={handleUpdateProgress}
          onBack={() => setScreen('menu')}
        />
      )}

      {screen === 'theme-gallery' && (
        <ThemeGallery
          highScores={progress.highScores}
          onBack={() => setScreen('menu')}
        />
      )}
    </div>
  );
}
