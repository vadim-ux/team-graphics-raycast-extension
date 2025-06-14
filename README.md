<div align="center">
  <img src="assets/extension-icon.png" alt="Team Graphics Library" width="128" height="128">
  
  # Team Graphics Library
  
  *Raycast extension for quick access to team graphics and logos*
  
  [![Raycast](https://img.shields.io/badge/Raycast-Extension-red)](https://raycast.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-blue)](https://www.typescriptlang.org/)
</div>

# Team Graphics Library

Raycast extension for quick access to team PNG assets - logos, icons, templates and other graphics.

## Features

- 🔍 Search through team graphics library
- 🎨 Grid view with image previews
- 📂 Organized by categories (logos, icons, templates)
- 🔗 One-click access to images
- ⚡ Fast browsing and copying

## Setup

1. Clone this repository
2. Run `npm install`
3. Run `npm run dev` to start development
4. Open Raycast and search for "Search Assets"

## Configuration

The extension loads graphics data from your team's GitHub repository via `metadata.json` file. Update the `METADATA_URL` in `src/search-assets.tsx` to point to your graphics repository.

## Development

- `npm run dev` - Start development mode
- `npm run build` - Build for production
- `npm run lint` - Run linting
- `npm run publish` - Publish to private store

## Adding New Graphics

1. Upload PNG files to your graphics repository
2. Update `metadata.json` with new entries
3. Extension will automatically show new assets (refresh with ⌘+R)

## Usage

1. Open Raycast (⌘ + Space)
2. Type "Search Assets"
3. Browse or search for graphics
4. Press Enter to open image in browser
5. Right-click → Copy Image
6. Paste in any application
