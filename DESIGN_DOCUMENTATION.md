# The Curve — Virar West: Website Design System & Motion Specification

> **Project Name:** The Curve by Abhinav Group  
> **URL:** [thecurvevirarwest.com](https://www.thecurvevirarwest.com/)  
> **Design Philosophy:** Ultra-Luxury Architectural Minimalist (Zorge 9 / European Luxury Real Estate Aesthetic)

---

## 🎨 1. Color Palette & Visual Theme

The website uses a curated, warm champagne luxury color palette carefully balanced with high-contrast warm darks and soft ivory canvases.

### Primary Brand Colors
| Token Name | Hex / Value | Visual Representation & Usage |
|---|---|---|
| `--gold` | `#B8963E` | **True Champagne Gold** — Primary brand accent, luxury borders, icons, active tab highlights, and primary CTA accents. |
| `--gold-light` | `#D4B469` | **Light Champagne Gold** — Hover states, gradient stops, and interactive shimmer effects. |
| `--gold-muted` | `rgba(184, 150, 62, 0.12)` | **Subtle Gold Tint** — Badge background fills, soft pill container highlights. |

### Canvas & Background Surfaces
| Token Name | Hex / Value | Visual Representation & Usage |
|---|---|---|
| `--bg-dark` | `#FAF7F2` | **Warm Ivory Main Canvas** — Primary background color for the overall site body. |
| `--bg-light` | `#F0EBE1` | **Deeper Warm Ivory** — Alternating section backgrounds (e.g., Proximity & Connectivity sections). |
| `--bg-card` | `#FEFCF9` | **Near-White Card Surface** | Elevates cards, forms, and dialog containers above the main canvas. |
| `--bg-dark-section` | `#1A1714` | **Onyx Warm Charcoal** | Used for high-contrast luxury sections, hero overlays, and deep-themed components. |

### Typography & Text Colors
| Token Name | Hex / Value | Usage |
|---|---|---|
| `--text-main` | `#1C1A16` | Deep Warm Black — Used for all high-contrast titles, primary body copy, and navigation links. |
| `--text-muted` | `#7A7369` | Warm Muted Grey — Subtitles, captions, disclaimers, and metadata. |
| `--text-gold` | `#B8963E` | Highlighted text, key numbers, and luxury accent titles. |

### Auxiliary & Accent Colors
| Token Name | Hex / Value | Usage |
|---|---|---|
| `--abhinav-blue` | `#0082C8` | Abhinav Group corporate logo accent color. |
| `--accent-blue` | `rgba(0, 130, 200, 0.08)` | Soft corporate tint for builder trust sections. |
| **WhatsApp Green** | `#25D366` → `#128C7E` | Floating WhatsApp Action Button gradient. |

---

## ✒️ 2. Typography Hierarchy

The site features a 3-tier font system blending classical editorial elegance with modern digital legibility.

1. **Display & Brand Typography (`--font-display`)**:
   - **Font Family**: `'Cinzel Decorative'`, serif (Google Fonts)
   - **Usage**: Hero tagline, luxury highlights, brand monograms.
   - **Style**: Ultra-high contrast, Roman architectural letterforms.

2. **Heading Typography (`--font-heading`)**:
   - **Font Family**: `'Playfair Display'`, serif (Google Fonts)
   - **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-Bold)
   - **Usage**: `<h1>` to `<h3>` section titles, card headers, modal titles.

3. **Editorial Subtitles**:
   - **Font Family**: `'Cormorant Garamond'`, serif (Google Fonts)
   - **Usage**: Italicized descriptive subtitles, decorative section accents.

4. **Body & Interface Typography (`--font-body`)**:
   - **Font Family**: `'Inter'`, sans-serif (Google Fonts)
   - **Weights**: 300 (Light), 400 (Regular), 500 (Medium)
   - **Usage**: Body text, form inputs, button labels, navigation bar, footers.

---

## 🎬 3. Motion Design & Animation System

The website features an **IntersectionObserver-driven pure CSS animation system**, ensuring 60 FPS performance without heavy JavaScript animation libraries.

### Easing Functions
- **Luxury Exponential Ease (`--ease-expo`)**: `cubic-bezier(0.16, 1, 0.3, 1)`  
  *Provides a swift initial motion followed by an ultra-smooth, long tail decelerating stop.*
- **Standard Smooth Ease (`--ease-smooth`)**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

### Scroll-Driven Reveal Animations (`data-reveal`)

| Attribute Value | Initial State | Animate-To State | Duration | Usage |
|---|---|---|---|---|
| `data-reveal="up"` | `translateY(60px)`, `opacity: 0` | `translateY(0)`, `opacity: 1` | `0.85s` | Cards, titles, content blocks |
| `data-reveal="down"` | `translateY(-40px)`, `opacity: 0` | `translateY(0)`, `opacity: 1` | `0.85s` | Top navigation & dropdown elements |
| `data-reveal="left"` | `translateX(-60px)`, `opacity: 0` | `translateX(0)`, `opacity: 1` | `0.85s` | Left column splits, image showcases |
| `data-reveal="right"` | `translateX(60px)`, `opacity: 0` | `translateX(0)`, `opacity: 1` | `0.85s` | Right column splits, detail text |
| `data-reveal="scale"` | `scale(0.85)`, `opacity: 0` | `scale(1.0)`, `opacity: 1` | `0.85s` | Video containers, floorplan previews |
| `data-reveal="fade"` | `opacity: 0` | `opacity: 1` | `0.85s` | Overlay backgrounds, subtle dividers |

### Staggered Group Animation (`data-reveal-group`)
Children of a `[data-reveal-group]` automatically receive incremental staggered transition delays:
- **Child 1**: `0ms` delay
- **Child 2**: `100ms` delay
- **Child 3**: `200ms` delay
- **Child 4**: `300ms` delay
- ... up to **Child 10+**: `1000ms` delay

### Special Keyframe Animations

#### 1. Dual-Track Infinite Gallery Marquee (`@keyframes galleryScroll` / `galleryScrollReverse`)
- **Forward Track**: `translateX(0)` to `translateX(calc(-50% - 1rem))` over `40s` linear infinite.
- **Reverse Track**: `translateX(calc(-50% - 1rem))` to `translateX(0)` over `40s` linear infinite.
- **Hover Behavior**: Pauses smooth scrolling on mouse hover for interactive image inspection.

#### 2. Line Reveal (`data-line-reveal`)
- Text spans wrapped in overflow-hidden containers start at `translateY(110%)` and slide up smoothly to `translateY(0)` in `0.9s`.

#### 3. Reduced Motion Support (`prefers-reduced-motion: reduce`)
- Automatically disables all translate/scale transforms for users with motion sensitivity preferences, defaulting instantly to `opacity: 1` and `transform: none`.

---

## 🧩 4. Layout Architecture & Key Components

### 1. Navigation Bar (Header)
- **Glassmorphism Backdrop**: Sticky position with `backdrop-filter: blur(12px)` and subtle bottom border `rgba(28,26,22,0.08)`.
- **Navigation Links**: Inter font with custom hover state using expanding gold pseudo-element underline (`::after` width `0%` → `100%`).
- **Brand Logo**: Dual-brand lockup featuring **The Curve** and **Abhinav Group** logos separated by a vertical gold divider.

### 2. Hero Section
- **Background Strategy**: High-resolution responsive `<picture>` tag switching between desktop (`hero-desktopnew.webp`) and mobile (`hero-mobile-final.webp`).
- **Typography & CTAs**: Visually hidden SEO-rich `<h1>` tag with interactive gold CTA buttons floating elegantly over the architectural rendering.

### 3. Interactive Amenity Showcase
- **List & Detail View**: Clickable amenity items with active state indicator arrows (`→`).
- **Dynamic Image Swap**: Smooth cross-fade transition when switching amenity preview images.

### 4. Interactive Floor Plan Unlocker
- **Gated Experience**: Floor plans are locked behind a lead capture form.
- **Unlock Animation**: `@keyframes layoutFadeIn` smoothly unveils the interactive 2 BHK, 3 BHK, and Jodi floorplan tabs upon form submission.

### 5. Media Video Player ("Explore the Project")
- **Container Styling**: Curved border-radius (`12px`), deep drop-shadow (`0 15px 40px rgba(0,0,0,0.15)`), and max-width contained layout.
- **Optimized Stream**: WebP poster frame (`t=2.0s`) with native `playsinline` HTML5 controls and `preload="none"`.

### 6. Mobile Floating Action Buttons (FABs)
- **Independent Left/Right Separation**:
  - **Left**: Gold Call button (`tel:+917517514567`)
  - **Right**: Emerald WhatsApp button (`wa.me`)
- **Mobile Design**: Circular `48×48px` floating action buttons on mobile screens (`<768px`) with soft drop-shadows and instant action triggers.

---

## 🛠️ 5. Technical Stack Summary

| Layer | Technologies Used |
|---|---|
| **Core Architecture** | HTML5 Semantic Markup, Vanilla CSS3, Modern ES6+ JavaScript |
| **Icons & Media** | SVG Inline Icons, WebP Compressed Images, FastStart H.264 MP4 |
| **Form Processing** | Web3Forms AJAX Submission API + `intlTelInput` International Phone Validation |
| **SEO & Performance** | Schema.org JSON-LD Structured Data, WebP `<picture>` Fallbacks, `loading="lazy"` Native Image Optimization |

---
*Documentation generated for The Curve Virar West codebase.*
