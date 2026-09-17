import React from 'react';
import { Character, StylingState } from '../types';
import { getItemById } from '../data/items';
import { HAIR_COLORS } from '../data/hairstyles';

interface ModelRendererProps {
  character: Character;
  styling: StylingState;
  zoomMode?: 'full' | 'face' | 'upper';
  pose?: 'casual' | 'glamour' | 'cute' | 'fierce' | 'elegant' | 'dynamic';
  isWalking?: boolean;
  walkCycleProgress?: number; // 0 to 1
  showShadow?: boolean;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const ModelRenderer: React.FC<ModelRendererProps> = ({
  character,
  styling,
  zoomMode = 'full',
  pose = 'casual',
  isWalking = false,
  walkCycleProgress = 0,
  showShadow = true,
  className = '',
  onClick,
  id = 'glam-model-canvas',
}) => {
  // Retrieve equipped items
  const hairItem = getItemById(styling.hair);
  const topItem = getItemById(styling.top);
  const dressItem = getItemById(styling.dress);
  const skirtItem = getItemById(styling.skirt);
  const pantsItem = getItemById(styling.pants);
  const jacketItem = getItemById(styling.jacket);
  const shoesItem = getItemById(styling.shoes);
  const necklaceItem = getItemById(styling.necklace);
  const earringsItem = getItemById(styling.earrings);
  const braceletItem = getItemById(styling.bracelet);
  const ringsItem = getItemById(styling.rings);
  const handbagItem = getItemById(styling.handbag);
  const glassesItem = getItemById(styling.glasses);
  const crownItem = getItemById(styling.crown);
  const hairAccItem = getItemById(styling.hairAcc);
  const wingsItem = getItemById(styling.wings);
  const glovesItem = getItemById(styling.gloves);

  // Makeup items
  const foundationItem = getItemById(styling.foundation);
  const blushItem = getItemById(styling.blush);
  const eyeshadowItem = getItemById(styling.eyeshadow);
  const eyelinerItem = getItemById(styling.eyeliner);
  const mascaraItem = getItemById(styling.mascara);
  const lipstickItem = getItemById(styling.lipstick);
  const faceDecoItem = getItemById(styling.faceDeco);

  // Determine skin tone (either custom foundation or character default)
  const activeSkinTone = foundationItem?.color || character.skinTone;
  const hairColorHex = styling.hairColor || hairItem?.color || '#18181B';
  const hairColorObj = HAIR_COLORS.find((c) => c.color === hairColorHex);
  const hairGradient = hairColorObj?.gradient;

  // ViewBox dynamic scaling based on zoomMode
  // Full body: 0 0 400 700
  // Face close-up: 100 40 200 240
  // Upper body: 60 40 280 380
  let viewBox = '0 0 400 700';
  if (zoomMode === 'face') {
    viewBox = '110 50 180 200';
  } else if (zoomMode === 'upper') {
    viewBox = '60 40 280 360';
  }

  // Walk cycle animation offsets
  const walkBob = isWalking ? Math.sin(walkCycleProgress * Math.PI * 4) * 8 : 0;
  const walkSway = isWalking ? Math.sin(walkCycleProgress * Math.PI * 2) * 5 : 0;
  const legLeftAngle = isWalking ? Math.sin(walkCycleProgress * Math.PI * 2) * 18 : 0;
  const legRightAngle = isWalking ? -Math.sin(walkCycleProgress * Math.PI * 2) * 18 : 0;
  const armLeftAngle = isWalking ? -Math.sin(walkCycleProgress * Math.PI * 2) * 20 : 0;
  const armRightAngle = isWalking ? Math.sin(walkCycleProgress * Math.PI * 2) * 20 : 0;

  // Pose adjustments
  let leftArmD = 'M 140 230 Q 110 330 115 420';
  let rightArmD = 'M 260 230 Q 290 330 285 420';
  let leftHandX = 115;
  let leftHandY = 425;
  let rightHandX = 285;
  let rightHandY = 425;

  if (pose === 'glamour') {
    // Hand on hip
    rightArmD = 'M 260 230 Q 305 300 265 350';
    rightHandX = 255;
    rightHandY = 350;
    leftArmD = 'M 140 230 Q 110 340 125 430';
  } else if (pose === 'cute') {
    // Both hands near cheeks/chin
    leftArmD = 'M 140 230 Q 115 200 155 170';
    rightArmD = 'M 260 230 Q 285 200 245 170';
    leftHandX = 160;
    leftHandY = 165;
    rightHandX = 240;
    rightHandY = 165;
  } else if (pose === 'fierce') {
    // Both hands on waist
    leftArmD = 'M 140 230 Q 95 300 135 350';
    rightArmD = 'M 260 230 Q 305 300 265 350';
    leftHandX = 145;
    leftHandY = 350;
    rightHandX = 255;
    rightHandY = 350;
  } else if (pose === 'elegant') {
    // One arm draped forward, one poised
    leftArmD = 'M 140 230 Q 120 320 170 370';
    rightArmD = 'M 260 230 Q 295 320 280 410';
    leftHandX = 175;
    leftHandY = 375;
    rightHandX = 280;
    rightHandY = 415;
  } else if (pose === 'dynamic') {
    // Runway victory / high fashion wave
    leftArmD = 'M 140 230 Q 80 200 95 130';
    rightArmD = 'M 260 230 Q 310 310 270 360';
    leftHandX = 95;
    leftHandY = 125;
    rightHandX = 260;
    rightHandY = 360;
  }

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}
    >
      <svg
        viewBox={viewBox}
        className="w-full h-full max-h-[85vh] drop-shadow-2xl transition-all duration-300"
        style={{ transform: `translateY(${walkBob}px) rotate(${walkSway * 0.2}deg)` }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="bodyShading" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
          </linearGradient>

          <radialGradient id="blushGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={blushItem?.color || '#FB7185'} stopOpacity={blushItem ? 0.65 : 0} />
            <stop offset="100%" stopColor={blushItem?.color || '#FB7185'} stopOpacity="0" />
          </radialGradient>

          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={hairColorHex} />
            <stop offset="100%" stopColor={hairColorHex} stopOpacity="0.8" />
          </linearGradient>

          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 0. Shadow under feet */}
        {showShadow && zoomMode === 'full' && (
          <ellipse
            cx="200"
            cy="680"
            rx={65 + Math.abs(walkBob) * 1.5}
            ry="14"
            fill="#09090B"
            opacity="0.35"
          />
        )}

        {/* 1. Wings (Back Layer) */}
        {wingsItem && (
          <g id="layer-wings-back" className="transition-transform duration-300">
            {wingsItem.visualType === 'wg_fairy_wings' && (
              <g opacity="0.85" filter="url(#glowFilter)">
                <path d="M 130 220 C 40 100, 20 60, 50 160 C 20 220, 60 280, 130 250 Z" fill={wingsItem.color} opacity="0.6" />
                <path d="M 270 220 C 360 100, 380 60, 350 160 C 380 220, 340 280, 270 250 Z" fill={wingsItem.color} opacity="0.6" />
                <path d="M 130 250 C 60 260, 50 340, 120 330 Z" fill={wingsItem.color} opacity="0.45" />
                <path d="M 270 250 C 340 260, 350 340, 280 330 Z" fill={wingsItem.color} opacity="0.45" />
              </g>
            )}
            {wingsItem.visualType === 'wg_angel_wings' && (
              <g opacity="0.95">
                <path d="M 140 220 C 50 80, 30 140, 60 240 C 20 290, 80 350, 140 260 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
                <path d="M 260 220 C 350 80, 370 140, 340 240 C 380 290, 320 350, 260 260 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
              </g>
            )}
            {wingsItem.visualType === 'wg_bat_wings' && (
              <g opacity="0.95">
                <path d="M 140 220 Q 50 120 30 90 Q 70 160 50 220 Q 90 230 110 270 Q 130 240 140 220 Z" fill={wingsItem.color || '#18181B'} />
                <path d="M 260 220 Q 350 120 370 90 Q 330 160 350 220 Q 310 230 290 270 Q 270 240 260 220 Z" fill={wingsItem.color || '#18181B'} />
              </g>
            )}
            {wingsItem.visualType === 'wg_cyber_wings' && (
              <g opacity="0.9">
                <polygon points="135,210 40,140 70,180 30,220 135,240" fill={wingsItem.color} />
                <polygon points="265,210 360,140 330,180 370,220 265,240" fill={wingsItem.color} />
              </g>
            )}
            {wingsItem.visualType === 'wg_fire_wings' && (
              <g opacity="0.95" filter="url(#glowFilter)">
                <path d="M 130 220 Q 30 90 20 50 Q 60 140 30 200 Q 80 220 130 250 Z" fill="#EA580C" />
                <path d="M 130 220 Q 50 110 50 80 Q 75 140 55 190 Z" fill="#FBBF24" />
                <path d="M 270 220 Q 370 90 380 50 Q 340 140 370 200 Q 320 220 270 250 Z" fill="#EA580C" />
                <path d="M 270 220 Q 350 110 350 80 Q 325 140 345 190 Z" fill="#FBBF24" />
              </g>
            )}
          </g>
        )}

        {/* 2. Hair (Back Volume for long hair) */}
        {hairItem && (
          <g id="layer-hair-back">
            {(hairItem.style === 'long' || hairItem.style === 'wavy' || hairItem.style === 'princess' || hairItem.style === 'fantasy') && (
              <path
                d="M 135 120 C 110 200, 95 320, 110 440 C 140 450, 260 450, 290 440 C 305 320, 290 200, 265 120 Z"
                fill={hairColorHex}
                opacity="0.95"
              />
            )}
            {hairItem.style === 'twin_tail' && (
              <g>
                <path d="M 130 110 C 80 150, 60 260, 75 380 C 95 380, 105 280, 120 150 Z" fill={hairColorHex} />
                <path d="M 270 110 C 320 150, 340 260, 325 380 C 305 380, 295 280, 280 150 Z" fill={hairColorHex} />
              </g>
            )}
            {hairItem.style === 'ponytail' && (
              <path d="M 240 100 C 290 120, 320 220, 295 340 C 275 320, 265 240, 240 140 Z" fill={hairColorHex} />
            )}
            {hairItem.style === 'curly' && (
              <path
                d="M 120 120 C 80 180, 85 280, 95 380 C 130 400, 270 400, 305 380 C 315 280, 320 180, 280 120 Z"
                fill={hairColorHex}
              />
            )}
          </g>
        )}

        {/* 3. Base Body (Skin) */}
        <g id="layer-body">
          {/* Neck */}
          <path d="M 180 170 L 180 230 Q 200 240 220 230 L 220 170 Z" fill={activeSkinTone} />
          {/* Neck shadow */}
          <path d="M 180 170 Q 200 185 220 170 L 220 180 Q 200 195 180 180 Z" fill="#000000" opacity="0.08" />

          {/* Shoulders & Torso */}
          <path
            d="M 140 230 C 155 225, 175 228, 200 228 C 225 228, 245 225, 260 230 C 275 235, 265 310, 255 350 C 250 370, 245 390, 255 420 C 225 430, 175 430, 145 420 C 155 390, 150 370, 145 350 C 135 310, 125 235, 140 230 Z"
            fill={activeSkinTone}
          />
          {/* Body subtle shade */}
          <path
            d="M 140 230 C 155 225, 175 228, 200 228 C 225 228, 245 225, 260 230 C 275 235, 265 310, 255 350 C 250 370, 245 390, 255 420 C 225 430, 175 430, 145 420 C 155 390, 150 370, 145 350 C 135 310, 125 235, 140 230 Z"
            fill="url(#bodyShading)"
          />

          {/* Legs */}
          {/* Left Leg */}
          <g style={{ transformOrigin: '175px 420px', transform: `rotate(${legLeftAngle}deg)` }}>
            <path
              d="M 160 420 Q 165 520 168 580 Q 169 630 166 660 L 188 660 Q 192 630 190 580 Q 192 520 195 420 Z"
              fill={activeSkinTone}
            />
            {/* Foot base */}
            <path d="M 166 655 L 155 675 L 188 675 L 188 655 Z" fill={activeSkinTone} />
          </g>
          {/* Right Leg */}
          <g style={{ transformOrigin: '225px 420px', transform: `rotate(${legRightAngle}deg)` }}>
            <path
              d="M 205 420 Q 208 520 210 580 Q 208 630 212 660 L 234 660 Q 231 630 232 580 Q 235 520 240 420 Z"
              fill={activeSkinTone}
            />
            {/* Foot base */}
            <path d="M 212 655 L 212 675 L 245 675 L 234 655 Z" fill={activeSkinTone} />
          </g>

          {/* Arms (Dynamic based on pose/walking) */}
          {/* Left Arm */}
          <g style={{ transformOrigin: '145px 235px', transform: `rotate(${armLeftAngle}deg)` }}>
            <path
              d={leftArmD}
              fill="none"
              stroke={activeSkinTone}
              strokeWidth="22"
              strokeLinecap="round"
            />
            {/* Hand */}
            <circle cx={leftHandX} cy={leftHandY} r="9" fill={activeSkinTone} />
          </g>
          {/* Right Arm */}
          <g style={{ transformOrigin: '255px 235px', transform: `rotate(${armRightAngle}deg)` }}>
            <path
              d={rightArmD}
              fill="none"
              stroke={activeSkinTone}
              strokeWidth="22"
              strokeLinecap="round"
            />
            {/* Hand */}
            <circle cx={rightHandX} cy={rightHandY} r="9" fill={activeSkinTone} />
          </g>

          {/* Head & Face Base */}
          <path
            d="M 145 110 C 145 65, 255 65, 255 110 C 255 145, 235 178, 200 180 C 165 178, 145 145, 145 110 Z"
            fill={activeSkinTone}
          />
          {/* Ears */}
          <circle cx="145" cy="115" r="9" fill={activeSkinTone} />
          <circle cx="255" cy="115" r="9" fill={activeSkinTone} />
        </g>

        {/* 4. Facial Features & Makeup */}
        <g id="layer-facial-makeup">
          {/* Blush */}
          <ellipse cx="166" cy="126" rx="14" ry="8" fill="url(#blushGlow)" />
          <ellipse cx="234" cy="126" rx="14" ry="8" fill="url(#blushGlow)" />

          {/* Eyeshadow */}
          {eyeshadowItem && (
            <g opacity="0.85">
              <path
                d="M 160 108 Q 174 96 186 108 Q 174 104 160 108 Z"
                fill={eyeshadowItem.color}
              />
              <path
                d="M 214 108 Q 226 96 240 108 Q 226 104 214 108 Z"
                fill={eyeshadowItem.color}
              />
            </g>
          )}

          {/* Eyes & Eyeballs */}
          {/* Left Eye */}
          <g id="left-eye">
            <ellipse cx="173" cy="112" rx="11" ry="7" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5" />
            <circle cx="173" cy="112" r="5" fill={character.eyeColor || '#451A03'} />
            <circle cx="173" cy="112" r="2.5" fill="#000000" />
            {/* Eye sparkle */}
            <circle cx="171" cy="110" r="1.5" fill="#FFFFFF" />
            <circle cx="175" cy="113" r="0.8" fill="#FFFFFF" />
          </g>

          {/* Right Eye */}
          <g id="right-eye">
            <ellipse cx="227" cy="112" rx="11" ry="7" fill="#FFFFFF" stroke="#000000" strokeWidth="0.5" />
            <circle cx="227" cy="112" r="5" fill={character.eyeColor || '#451A03'} />
            <circle cx="227" cy="112" r="2.5" fill="#000000" />
            {/* Eye sparkle */}
            <circle cx="225" cy="110" r="1.5" fill="#FFFFFF" />
            <circle cx="229" cy="113" r="0.8" fill="#FFFFFF" />
          </g>

          {/* Eyeliner */}
          {eyelinerItem ? (
            <g>
              <path
                d="M 160 110 Q 173 103 186 110 Q 190 106 193 104"
                fill="none"
                stroke={eyelinerItem.color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 240 110 Q 227 103 214 110 Q 210 106 207 104"
                fill="none"
                stroke={eyelinerItem.color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g>
              <path d="M 162 109 Q 173 105 184 109" fill="none" stroke="#27272A" strokeWidth="1.5" />
              <path d="M 238 109 Q 227 105 216 109" fill="none" stroke="#27272A" strokeWidth="1.5" />
            </g>
          )}

          {/* Mascara Eyelashes */}
          {mascaraItem && (
            <g stroke={mascaraItem.color} strokeWidth="1.5" strokeLinecap="round">
              <line x1="164" y1="108" x2="161" y2="104" />
              <line x1="170" y1="106" x2="169" y2="101" />
              <line x1="176" y1="106" x2="177" y2="101" />
              <line x1="182" y1="108" x2="185" y2="104" />

              <line x1="218" y1="108" x2="215" y2="104" />
              <line x1="224" y1="106" x2="223" y2="101" />
              <line x1="230" y1="106" x2="231" y2="101" />
              <line x1="236" y1="108" x2="239" y2="104" />
            </g>
          )}

          {/* Eyebrows */}
          <path d="M 161 99 Q 173 94 185 98" fill="none" stroke={hairColorHex} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 239 99 Q 227 94 215 98" fill="none" stroke={hairColorHex} strokeWidth="2.5" strokeLinecap="round" />

          {/* Nose */}
          <path d="M 200 115 Q 197 130 195 133 Q 200 135 204 133" fill="none" stroke="#000000" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

          {/* Lips & Lipstick */}
          <g id="lips">
            <path
              d="M 188 150 Q 194 146 200 148 Q 206 146 212 150 Q 200 158 188 150 Z"
              fill={lipstickItem?.color || '#FB7185'}
            />
            {/* Lip shine */}
            <ellipse cx="200" cy="151" rx="4" ry="1.5" fill="#FFFFFF" opacity="0.45" />
          </g>

          {/* Face Decoration */}
          {faceDecoItem && (
            <g id="face-deco">
              {faceDecoItem.visualType === 'fd_sparkle_gems' && (
                <g fill={faceDecoItem.color}>
                  <circle cx="157" cy="120" r="2" />
                  <circle cx="243" cy="120" r="2" />
                  <circle cx="159" cy="124" r="1.5" />
                  <circle cx="241" cy="124" r="1.5" />
                </g>
              )}
              {faceDecoItem.visualType === 'fd_star_freckles' && (
                <g fill={faceDecoItem.color}>
                  <circle cx="178" cy="126" r="1.5" />
                  <circle cx="185" cy="128" r="1.5" />
                  <circle cx="215" cy="128" r="1.5" />
                  <circle cx="222" cy="126" r="1.5" />
                </g>
              )}
              {faceDecoItem.visualType === 'fd_butterfly_cheek' && (
                <path d="M 152 125 C 147 120 148 128 152 127 C 156 128 157 120 152 125 Z" fill={faceDecoItem.color} />
              )}
              {faceDecoItem.visualType === 'fd_cyber_circuit' && (
                <path d="M 238 120 L 246 120 L 250 128" fill="none" stroke={faceDecoItem.color} strokeWidth="1.5" />
              )}
              {faceDecoItem.visualType === 'fd_teardrop_crystal' && (
                <path d="M 173 124 Q 175 128 173 130 Q 171 128 173 124 Z" fill={faceDecoItem.color} />
              )}
            </g>
          )}
        </g>

        {/* 5. Bottoms (Pants / Skirt) - Renders under Tops unless dress is used */}
        {!dressItem && (
          <g id="layer-bottoms">
            {/* Pants */}
            {pantsItem && (
              <g>
                <path
                  d="M 148 350 L 252 350 L 255 420 L 242 640 L 208 640 L 200 450 L 192 640 L 158 640 L 145 420 Z"
                  fill={pantsItem.color}
                />
                {/* Crease / shading */}
                <line x1="200" y1="360" x2="200" y2="450" stroke="#000000" strokeWidth="2" opacity="0.2" />
              </g>
            )}

            {/* Skirts */}
            {skirtItem && (
              <g>
                {skirtItem.visualType === 'skirt_pleated' && (
                  <polygon points="148,345 252,345 270,440 130,440" fill={skirtItem.color} />
                )}
                {skirtItem.visualType === 'skirt_tulle' && (
                  <path d="M 148 345 Q 200 350 252 345 Q 285 450 200 460 Q 115 450 148 345 Z" fill={skirtItem.color} opacity="0.9" />
                )}
                {skirtItem.visualType === 'skirt_pencil' && (
                  <polygon points="150,345 250,345 240,460 160,460" fill={skirtItem.color} />
                )}
                {skirtItem.visualType === 'skirt_boho_maxi' && (
                  <path d="M 150 345 Q 200 350 250 345 L 285 640 Q 200 655 115 640 Z" fill={skirtItem.color} />
                )}
                {/* Default skirt shape */}
                {!['skirt_pleated', 'skirt_tulle', 'skirt_pencil', 'skirt_boho_maxi'].includes(skirtItem.visualType || '') && (
                  <polygon points="148,345 252,345 268,430 132,430" fill={skirtItem.color} />
                )}
              </g>
            )}
          </g>
        )}

        {/* 6. Tops / Dresses */}
        {dressItem ? (
          <g id="layer-dress">
            {dressItem.visualType === 'dress_ballgown' && (
              <g>
                {/* Bodice */}
                <path d="M 155 240 Q 200 250 245 240 L 245 350 L 155 350 Z" fill={dressItem.color} />
                {/* Big Princess Skirt */}
                <path d="M 155 348 Q 200 355 245 348 C 340 450 350 630 330 660 C 200 670 100 660 70 660 C 50 630 60 450 155 348 Z" fill={dressItem.color} />
              </g>
            )}
            {dressItem.visualType === 'dress_slit_gown' && (
              <g>
                <path d="M 150 235 L 250 235 L 248 400 L 235 660 L 165 660 L 168 460 Q 185 410 152 400 Z" fill={dressItem.color} />
              </g>
            )}
            {dressItem.visualType === 'dress_bridal' && (
              <g>
                <path d="M 155 235 Q 200 245 245 235 L 245 350 L 155 350 Z" fill={dressItem.color} />
                <path d="M 155 348 C 290 440 330 640 320 665 C 200 675 100 665 80 665 C 70 640 110 440 155 348 Z" fill={dressItem.color} />
                {/* Lace overlay */}
                <path d="M 155 348 C 280 430 310 600 290 630 C 200 640 120 630 110 630 C 90 600 120 430 155 348 Z" fill="#FFFFFF" opacity="0.3" />
              </g>
            )}
            {dressItem.visualType === 'dress_mini' && (
              <polygon points="152,235 248,235 260,420 140,420" fill={dressItem.color} />
            )}
            {/* Default dress shape */}
            {!['dress_ballgown', 'dress_slit_gown', 'dress_bridal', 'dress_mini'].includes(dressItem.visualType || '') && (
              <g>
                <path d="M 152 235 Q 200 242 248 235 L 250 350 L 150 350 Z" fill={dressItem.color} />
                <path d="M 150 348 Q 200 355 250 348 L 270 560 Q 200 575 130 560 Z" fill={dressItem.color} />
              </g>
            )}
          </g>
        ) : (
          topItem && (
            <g id="layer-top">
              {topItem.visualType === 'top_crop_tee' && (
                <g>
                  <polygon points="142,230 258,230 250,310 150,310" fill={topItem.color} />
                  {/* Sleeves */}
                  <polygon points="142,230 125,270 145,280 152,240" fill={topItem.color} />
                  <polygon points="258,230 275,270 255,280 248,240" fill={topItem.color} />
                </g>
              )}
              {topItem.visualType === 'top_corset' && (
                <path d="M 152 240 Q 200 260 248 240 L 246 345 Q 200 365 154 345 Z" fill={topItem.color} />
              )}
              {topItem.visualType === 'top_hoodie' && (
                <g>
                  <polygon points="135,225 265,225 260,350 140,350" fill={topItem.color} />
                  <path d="M 135 225 L 115 320 L 130 325 L 145 240 Z" fill={topItem.color} />
                  <path d="M 265 225 L 285 320 L 270 325 L 255 240 Z" fill={topItem.color} />
                </g>
              )}
              {/* Default top */}
              {!['top_crop_tee', 'top_corset', 'top_hoodie'].includes(topItem.visualType || '') && (
                <polygon points="145,230 255,230 250,345 150,345" fill={topItem.color} />
              )}
            </g>
          )
        )}

        {/* 7. Shoes */}
        {shoesItem && zoomMode !== 'face' && (
          <g id="layer-shoes">
            {shoesItem.visualType === 'shoes_boots_knee' ? (
              <g fill={shoesItem.color}>
                <polygon points="164,520 193,520 188,675 152,675" />
                <polygon points="207,520 236,520 246,675 210,675" />
              </g>
            ) : shoesItem.visualType === 'shoes_stilettos' ? (
              <g fill={shoesItem.color}>
                {/* Left high heel */}
                <polygon points="163,650 188,650 188,675 155,675" />
                <rect x="183" y="655" width="4" height="20" />
                {/* Right high heel */}
                <polygon points="212,650 237,650 245,675 212,675" />
                <rect x="213" y="655" width="4" height="20" />
              </g>
            ) : (
              <g fill={shoesItem.color}>
                <rect x="154" y="655" width="34" height="20" rx="4" />
                <rect x="212" y="655" width="34" height="20" rx="4" />
              </g>
            )}
          </g>
        )}

        {/* 8. Gloves & Jackets */}
        {glovesItem && (
          <g id="layer-gloves" fill={glovesItem.color}>
            {glovesItem.visualType === 'glv_opera_white' || glovesItem.visualType === 'glv_opera_black' ? (
              <g>
                <circle cx={leftHandX} cy={leftHandY} r="10" />
                <circle cx={rightHandX} cy={rightHandY} r="10" />
              </g>
            ) : (
              <g>
                <circle cx={leftHandX} cy={leftHandY} r="9" />
                <circle cx={rightHandX} cy={rightHandY} r="9" />
              </g>
            )}
          </g>
        )}

        {jacketItem && (
          <g id="layer-jacket">
            {jacketItem.visualType === 'jacket_biker' && (
              <g fill={jacketItem.color}>
                <polygon points="135,225 175,230 165,340 135,330" />
                <polygon points="265,225 225,230 235,340 265,330" />
                {/* Collar lapels */}
                <polygon points="175,230 190,260 170,270" fill="#27272A" />
                <polygon points="225,230 210,260 230,270" fill="#27272A" />
              </g>
            )}
            {jacketItem.visualType === 'jacket_fur' && (
              <g fill={jacketItem.color} stroke="#E2E8F0" strokeWidth="2">
                <path d="M 130 220 Q 100 280 115 370 Q 155 370 160 340 L 140 225 Z" />
                <path d="M 270 220 Q 300 280 285 370 Q 245 370 240 340 L 260 225 Z" />
              </g>
            )}
            {jacketItem.visualType === 'jacket_cape_fur' || jacketItem.visualType === 'jacket_cloak' ? (
              <path d="M 140 225 Q 200 235 260 225 L 300 580 Q 200 610 100 580 Z" fill={jacketItem.color} opacity="0.9" />
            ) : (
              <g fill={jacketItem.color}>
                <polygon points="135,225 170,230 160,350 135,340" />
                <polygon points="265,225 230,230 240,350 265,340" />
              </g>
            )}
          </g>
        )}

        {/* 9. Front Hair Styles */}
        {hairItem && (
          <g id="layer-hair-front">
            {/* Bangs / Fringe base */}
            <path
              d="M 140 100 C 145 60, 255 60, 260 100 C 255 110, 245 95, 230 102 C 210 90, 190 90, 170 102 C 155 95, 145 110, 140 100 Z"
              fill={hairColorHex}
            />

            {/* Bob / Short front locks */}
            {hairItem.style === 'bob' && (
              <g fill={hairColorHex}>
                <path d="M 140 90 C 130 140, 135 180, 150 210 C 142 160, 145 120, 148 90 Z" />
                <path d="M 260 90 C 270 140, 265 180, 250 210 C 258 160, 255 120, 252 90 Z" />
              </g>
            )}

            {/* Space Buns */}
            {hairItem.style === 'space_bun' && (
              <g fill={hairColorHex}>
                <circle cx="130" cy="65" r="24" />
                <circle cx="270" cy="65" r="24" />
              </g>
            )}

            {/* Top Bun */}
            {hairItem.style === 'bun' && (
              <circle cx="200" cy="50" r="28" fill={hairColorHex} />
            )}

            {/* Pixie Cut Fringe */}
            {hairItem.style === 'short' && (
              <path d="M 145 95 Q 165 75 190 100 Q 215 75 255 95 Z" fill={hairColorHex} />
            )}

            {/* Glamour Waves front curls */}
            {hairItem.style === 'wavy' && (
              <g fill={hairColorHex}>
                <path d="M 140 90 C 130 140, 120 220, 145 300 C 135 240, 138 160, 148 90 Z" />
                <path d="M 260 90 C 270 140, 280 220, 255 300 C 265 240, 262 160, 252 90 Z" />
              </g>
            )}
          </g>
        )}

        {/* 10. Accessories */}
        {/* Necklace */}
        {necklaceItem && (
          <g id="layer-necklace">
            {necklaceItem.visualType === 'nk_choker_diamond' ? (
              <path d="M 180 185 Q 200 195 220 185" fill="none" stroke={necklaceItem.color} strokeWidth="4" strokeLinecap="round" />
            ) : necklaceItem.visualType === 'nk_pearl_strand' ? (
              <path d="M 175 195 Q 200 225 225 195" fill="none" stroke={necklaceItem.color} strokeWidth="5" strokeDasharray="3 4" strokeLinecap="round" />
            ) : (
              <path d="M 175 195 Q 200 225 225 195" fill="none" stroke={necklaceItem.color} strokeWidth="3" strokeLinecap="round" />
            )}
          </g>
        )}

        {/* Earrings */}
        {earringsItem && (
          <g id="layer-earrings" fill={earringsItem.color}>
            {earringsItem.visualType === 'er_hoops_gold' ? (
              <g>
                <circle cx="143" cy="122" r="6" fill="none" stroke={earringsItem.color} strokeWidth="2.5" />
                <circle cx="257" cy="122" r="6" fill="none" stroke={earringsItem.color} strokeWidth="2.5" />
              </g>
            ) : (
              <g>
                <circle cx="144" cy="122" r="3" />
                <circle cx="256" cy="122" r="3" />
                <polygon points="144,125 141,136 147,136" />
                <polygon points="256,125 253,136 259,136" />
              </g>
            )}
          </g>
        )}

        {/* Glasses */}
        {glassesItem && (
          <g id="layer-glasses">
            {glassesItem.visualType === 'gl_cat_eye' ? (
              <g fill={glassesItem.color} opacity="0.85">
                <polygon points="156,106 186,104 184,118 160,118" />
                <polygon points="244,106 214,104 216,118 240,118" />
                <line x1="186" y1="108" x2="214" y2="108" stroke={glassesItem.color} strokeWidth="2" />
              </g>
            ) : glassesItem.visualType === 'gl_cyber_visor' ? (
              <rect x="152" y="103" width="96" height="18" rx="4" fill={glassesItem.color} opacity="0.85" filter="url(#glowFilter)" />
            ) : (
              <g fill="none" stroke={glassesItem.color} strokeWidth="2.5">
                <circle cx="173" cy="112" r="12" />
                <circle cx="227" cy="112" r="12" />
                <line x1="185" y1="112" x2="215" y2="112" />
              </g>
            )}
          </g>
        )}

        {/* Crown / Tiara */}
        {crownItem && (
          <g id="layer-crown" filter="url(#glowFilter)">
            {crownItem.visualType === 'cr_tiara_crystal' ? (
              <polygon points="180,82 190,65 200,55 210,65 220,82" fill={crownItem.color} stroke="#FFFFFF" strokeWidth="1" />
            ) : crownItem.visualType === 'cr_crown_royal' ? (
              <g fill={crownItem.color}>
                <polygon points="175,80 182,55 192,70 200,48 208,70 218,55 225,80" />
                <circle cx="200" cy="45" r="3" fill="#DC2626" />
              </g>
            ) : crownItem.visualType === 'cr_celestial_halo' ? (
              <circle cx="200" cy="70" r="45" fill="none" stroke={crownItem.color} strokeWidth="3" opacity="0.8" />
            ) : (
              <polygon points="178,80 190,62 200,52 210,62 222,80" fill={crownItem.color} />
            )}
          </g>
        )}

        {/* Hair Accessories (Barrettes, flowers, ribbons) */}
        {hairAccItem && (
          <g id="layer-hair-acc" fill={hairAccItem.color}>
            {hairAccItem.visualType === 'ha_velvet_bow' ? (
              <g>
                <polygon points="195,65 175,55 175,75" />
                <polygon points="205,65 225,55 225,75" />
                <circle cx="200" cy="65" r="4" />
              </g>
            ) : hairAccItem.visualType === 'ha_hibiscus' ? (
              <circle cx="150" cy="85" r="12" fill={hairAccItem.color} />
            ) : (
              <g>
                <circle cx="160" cy="80" r="5" />
                <circle cx="240" cy="80" r="5" />
              </g>
            )}
          </g>
        )}

        {/* Bracelet */}
        {braceletItem && (
          <circle cx={leftHandX - 4} cy={leftHandY - 12} r="6" fill="none" stroke={braceletItem.color} strokeWidth="3" />
        )}

        {/* Handbag */}
        {handbagItem && zoomMode === 'full' && (
          <g id="layer-handbag" style={{ transformOrigin: `${rightHandX}px ${rightHandY}px` }}>
            <rect x={rightHandX - 16} y={rightHandY + 12} width="32" height="26" rx="4" fill={handbagItem.color} />
            {/* Strap */}
            <path d={`M ${rightHandX - 10} ${rightHandY + 12} Q ${rightHandX} ${rightHandY} ${rightHandX + 10} ${rightHandY + 12}`} fill="none" stroke="#E2E8F0" strokeWidth="2" />
          </g>
        )}
      </svg>
    </div>
  );
};
