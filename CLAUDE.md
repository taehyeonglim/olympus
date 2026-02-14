# CLAUDE.md - Development Guide

## Project Overview

The Olympus Projects is a portfolio landing page showcasing six vibe-coded products named after Greek mythology figures. The site uses a divine Greek temple aesthetic with immersive visual effects.

## File Structure

- `index.html` - Main page with hero section and infinite carousel of god cards
- `styles.css` - All styling including animations, card flip, carousel, responsive design
- `script.js` - JavaScript classes for particle system, lightning, carousel, scroll animations
- `favicon.svg` - Temple pillar SVG favicon

## Key Components

### God Cards
Each god card is an `<a>` tag with `data-god` attribute for styling hooks:
```html
<a href="..." class="god-card" data-god="athena">
  <div class="card-flipper">
    <div class="card-front">...</div>
    <div class="card-back">...</div>
  </div>
</a>
```

### Card Flip Effect
- Uses CSS 3D transforms with `perspective`, `rotateY`, `backface-visibility`
- Hover triggers 180deg Y-axis rotation
- Front shows English, back shows Korean translation

### SVG Symbols
Each god has a custom SVG symbol with inline colors. Important:
- CHIRON uses `<marker>` elements with unique IDs (`chiron-arrow-front`, `chiron-arrow-back`)
- IRIS uses `<linearGradient>` with unique IDs (`iris-rainbow-front`, `iris-rainbow-back`)
- Unique IDs prevent conflicts between front/back card faces
- `InfiniteCarousel` appends `-clone` suffix to IDs when duplicating cards for infinite scroll

### CSS Variables
Dual signature colors defined in `:root`:
```css
--athena-primary: #C0C0C0;
--athena-secondary: #6B8E23;
/* ... etc for each god */
```

### JavaScript Classes
- `ParticleSystem` - Golden floating particles on canvas with mouse interaction
- `LightningEffect` - Random lightning flashes (5-15s interval, 70% chance)
- `InfiniteCarousel` - Clones god cards for seamless infinite scroll
- `ScrollAnimations` - Parallax effect on hero section via scroll events
- `AmbientAudio` - Hover sound effects on cards (Web Audio API)
- `TypingEffect` - Cursor blink effect on subtitle
- `PageLoader` - Smooth fade-in on page load

## Project Links

| God | URL |
|-----|-----|
| ATHENA | https://taehyeonglim.github.io/athena |
| ATLAS | https://taehyeonglim.github.io/atlas |
| HERMES | https://taehyeonglim.github.io/hermes |
| VENUS | https://taehyeonglim.github.io/venus |
| CHIRON | https://chiron-thlim.vercel.app |
| IRIS | https://taehyeonglim.github.io/iris |

## Korean Translations

| English | Korean | Domain |
|---------|--------|--------|
| ATHENA | 아테나 | 지혜와 전략의 여신 |
| ATLAS | 아틀라스 | 인내의 티탄 |
| HERMES | 헤르메스 | 신들의 전령 |
| VENUS | 비너스 | 미와 사랑의 여신 |
| CHIRON | 케이론 | 현명한 켄타우로스 |
| IRIS | 아이리스 | 무지개의 여신 |

## Development Notes

- Google Fonts: Cinzel (headings), Cormorant Garamond (body), Noto Sans KR (Korean)
- Responsive breakpoints: 1200px (smaller cards), 768px (compact cards)
- Card dimensions: 320x420 (desktop), 280x370 (tablet), 260x340 (mobile)
- All animations use CSS keyframes or requestAnimationFrame
