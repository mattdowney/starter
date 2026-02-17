import type { Room, Fixture, FurnitureItem, RoomStructure } from './types'

export const room: Room = {
  width: 148, // inches
  depth: 199, // inches
  height: 96, // 8ft ceiling
}

// ═══════════════════════════════════════════════════════════════════
// FIXED FIXTURES - Doors and architectural elements that NEVER move
// ═══════════════════════════════════════════════════════════════════

export const fixtures: Fixture[] = [
  // Left door on north wall - 6.25" from west wall
  {
    id: 'door-left',
    name: 'Door (N-Left)',
    type: 'door',
    dimensions: { width: 29, depth: 1.5, height: 80 },
    position: { x: 6, y: 0, rotation: 0 },
    color: '#8B5A2B',
    wallSide: 'north',
    swingDirection: 'left-to-right',
  },

  // Right door on north wall - 16.5" from east wall
  {
    id: 'door-right',
    name: 'Door (N-Right)',
    type: 'door',
    dimensions: { width: 29, depth: 1.5, height: 80 },
    position: { x: 103, y: 0, rotation: 0 },
    color: '#8B5A2B',
    wallSide: 'north',
    swingDirection: 'left-to-right',
  },

  // Main Entrance on west wall - 1" from north wall
  {
    id: 'entrance',
    name: 'Entrance',
    type: 'door',
    dimensions: { width: 1.5, depth: 36, height: 80 },
    position: { x: 0, y: 1, rotation: 0 },
    color: '#6D4C41',
    wallSide: 'west',
    swingDirection: 'right-to-left',
  },
]

// Complete room structure (room + fixtures)
export const roomStructure: RoomStructure = {
  room,
  fixtures,
}

// ═══════════════════════════════════════════════════════════════════
// MOVABLE FURNITURE - These can be rearranged
// ═══════════════════════════════════════════════════════════════════

export const initialFurniture: FurnitureItem[] = [
  // TV - wall mounted, centered between the two doors
  {
    id: 'tv',
    name: 'TV',
    type: 'tv',
    dimensions: { width: 38.25, depth: 2, height: 22 },
    position: { x: 50, y: 0, rotation: 0 },
    color: '#1a1a2e',
    isWallMounted: true,
    wallSide: 'north',
  },

  // Media Console - centered between the two doors
  {
    id: 'media-console',
    name: 'Media Console',
    type: 'media-console',
    dimensions: { width: 44, depth: 18.5, height: 29.5 },
    position: { x: 47, y: 0, rotation: 0 },
    color: '#5D4037',
  },

  // Shelf #2 - below entrance with proper gap
  {
    id: 'shelf-2',
    name: 'Shelf #2',
    type: 'shelf',
    dimensions: { width: 12, depth: 30, height: 69.75 },
    position: { x: 0, y: 68, rotation: 0 },
    color: '#A1887F',
  },

  // Shelf #1 - below Shelf #2 with 6.5" gap
  {
    id: 'shelf-1',
    name: 'Shelf #1',
    type: 'shelf',
    dimensions: { width: 12, depth: 30, height: 69.75 },
    position: { x: 0, y: 105, rotation: 0 },
    color: '#A1887F',
  },

  // Glass Board - 22" above Desk #1
  {
    id: 'glass-board',
    name: 'Glass Board',
    type: 'glass-board',
    dimensions: { width: 2, depth: 35.5, height: 44.5 },
    position: { x: 146, y: 40, rotation: 0 },
    color: 'rgba(100, 200, 255, 0.7)',
    isWallMounted: true,
    wallSide: 'east',
  },

  // Desk #1 - VERTICAL along right wall
  {
    id: 'desk-1',
    name: 'Desk #1',
    type: 'desk',
    dimensions: { width: 30, depth: 72, height: 30 },
    position: { x: 118, y: 97, rotation: 0 },
    color: '#D7CCC8',
  },

  // Desk #2 - HORIZONTAL along bottom wall
  {
    id: 'desk-2',
    name: 'Desk #2',
    type: 'desk',
    dimensions: { width: 72, depth: 30, height: 30 },
    position: { x: 76, y: 169, rotation: 0 },
    color: '#D7CCC8',
  },

  // Chair - tucked into bottom-LEFT corner, angled
  {
    id: 'chair',
    name: 'Chair',
    type: 'chair',
    dimensions: { width: 28, depth: 32, height: 38 },
    position: { x: 8, y: 158, rotation: -40 },
    color: '#424242',
  },

  // Side Table (ROUND) - tucked next to chair
  {
    id: 'side-table',
    name: 'Table',
    type: 'table',
    dimensions: { width: 17, depth: 17, height: 21 },
    position: { x: 38, y: 182, rotation: 0 },
    color: '#8D6E63',
  },
]
