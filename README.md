<div align="center">
  <img src="png/assets/extension-icon.png" alt="Team Graphics Library" width="128" height="128">

# Team Graphics Library

*Raycast extensions for quick access to team graphics and logos*

[![Raycast](https://img.shields.io/badge/Raycast-Extension-red)](https://raycast.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue)](https://www.typescriptlang.org/)

</div>

Raycast extensions for quick access to team graphics assets - logos, icons, templates and other graphics in both PNG and SVG formats.

## Extensions

This repository contains two specialized Raycast extensions:

### 🖼️ PNG Assets Extension (`/png`)

- **Purpose**: Browse and open PNG files in browser for copying
- **Action**: Press Enter to open image URL in browser, then right-click → Copy Image
- **Best for**: Google Slides, PowerPoint, and other editors that work better with raster images

### 🎨 SVG Assets Extension (`/svg`)

- **Purpose**: Browse and copy SVG code directly to clipboard
- **Action**: Press Enter to copy SVG code to clipboard for immediate pasting
- **Best for**: Figma, Sketch, code editors, and vector-capable applications

## Why Two Separate Extensions?

Different design workflows require different formats:

- **SVG Extension**: Instant clipboard copying for vector editors like Figma where you can paste SVG code directly
- **PNG Extension**: Browser-based copying for applications like Google Slides that work better with raster images

This separation optimizes the workflow speed for designers and developers who frequently switch between different tools.

## Features

- 🔍 Search through team graphics library
- 🎨 Grid view with image previews
- 📂 Organized by categories (logos, icons, templates)
- 🔗 One-click access to images
- ⚡ Fast browsing and copying
- 🎯 Format-specific actions (PNG: open in browser, SVG: copy to clipboard)

## Setup

### Prerequisites

- [Raycast](https://raycast.com/) installed
- Node.js and npm

### Installation

1. Clone this repository:

```bash
git clone <repository-url>
cd team-graphics-raycast-extension
```

1. Install and setup PNG extension:

```bash
cd png
npm install
npm run dev
```

1. Install and setup SVG extension (in a new terminal):

```bash
cd svg
npm install
npm run dev
```

1. Open Raycast and search for:
- “Search Assets” (PNG extension)
- “Search SVG” (SVG extension)

## Configuration

Both extensions load graphics data from your team’s GitHub repository via `metadata.json` file. Update the `METADATA_URL` in the respective source files:

- PNG: `png/src/search-assets.tsx`
- SVG: `svg/src/search-svg.tsx`

## Development

### PNG Extension

```bash
cd png
npm run dev    # Start development mode
npm run build  # Build for production
npm run lint   # Run linting
npm run publish # Publish to private store
```

### SVG Extension

```bash
cd svg
npm run dev    # Start development mode
npm run build  # Build for production
npm run lint   # Run linting
npm run publish # Publish to private store
```

## Adding New Graphics

1. Upload PNG and SVG files to your graphics repository
1. Update `metadata.json` with new entries for both formats
1. Extensions will automatically show new assets (refresh with ⌘+R)

## Usage

### PNG Assets

1. Open Raycast (⌘ + Space)
1. Type “Search Assets”
1. Browse or search for graphics
1. Press Enter to open image in browser
1. Right-click → Copy Image
1. Paste in any application

### SVG Assets

1. Open Raycast (⌘ + Space)
1. Type “Search SVG”
1. Browse or search for graphics
1. Press Enter to copy SVG code to clipboard
1. Paste directly in Figma, code editors, or other SVG-capable applications

## Workflow Examples

- **Figma Design**: Use SVG extension → Press Enter → Paste directly into Figma
- **Adobe Illustrator**: Use SVG extension → Press Enter → Paste directly into editor
- **Google Slides**: Use PNG extension → Press Enter → Copy from browser → Paste into slides
- **Code Documentation**: Use SVG extension → Press Enter → Paste into markdown files
- **Whimsical**: Use PNG extension → Press Enter → Copy from browser → Paste into canvas
- **PowerPoint**: Use PNG extension → Press Enter → Copy from browser → Paste into presentation