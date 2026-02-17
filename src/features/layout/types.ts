// All dimensions in inches
export interface Dimensions {
  width: number
  depth: number
  height: number
}

export interface Position {
  x: number // from left wall
  y: number // from top wall (north)
  rotation: number // degrees
}

// Fixed architectural elements (doors, windows, etc.) - these never move
export type FixtureType = 'door' | 'window' | 'outlet' | 'light-switch'

export interface Fixture {
  id: string
  name: string
  type: FixtureType
  dimensions: Dimensions
  position: Position
  color: string
  wallSide: 'north' | 'south' | 'east' | 'west'
  swingDirection?: 'left-to-right' | 'right-to-left' // for doors
}

// Movable furniture items
export type FurnitureType =
  | 'desk'
  | 'chair'
  | 'shelf'
  | 'media-console'
  | 'tv'
  | 'table'
  | 'glass-board'
  | 'floating-shelf'

export interface FurnitureItem {
  id: string
  name: string
  type: FurnitureType
  dimensions: Dimensions
  position: Position
  color: string
  isWallMounted?: boolean
  wallSide?: 'north' | 'south' | 'east' | 'west'
}

// Room structure with fixed elements
export interface Room {
  width: number // 148"
  depth: number // 199"
  height: number // ceiling height, assume 96" (8ft)
}

export interface RoomStructure {
  room: Room
  fixtures: Fixture[] // doors, windows, etc. - NEVER change
}

export interface LayoutState {
  room: Room
  fixtures: Fixture[]
  furniture: FurnitureItem[]
  selectedId: string | null
  scale: number // pixels per inch for rendering
}

// Saved layout - furniture positions only (room structure is constant)
export interface Layout {
  name: string
  timestamp: string // ISO date string
  furniture: FurnitureItem[] // only movable items
}
