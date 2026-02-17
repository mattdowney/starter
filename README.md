# Office Layout Planner

Interactive office layout planning tool built with Next.js 16 + React 19.

The home page (`/`) is currently a full-screen planner with:
- 2D layout editing
- 3D room viewing
- Furniture add/remove + drag-in workflow
- JSON save/load for layouts

## Current Product Behavior

### 2D editor
- Drag furniture to reposition it.
- Snapping logic includes:
  - Wall snapping (flush to room boundaries)
  - Edge snapping against fixtures and other furniture
  - Light grid snapping fallback (12" grid)
- Hard room bounds are enforced using rotation-aware geometry, so items cannot sit outside the room envelope.
- `Cmd+Z` / `Ctrl+Z` undoes the last drag move.

### Sidebar workflow
- `Layout` card: rename, save JSON, load JSON.
- Room card: 2D/3D toggle + room dimensions.
- `Furniture` card:
  - Shows the full furniture catalog with `W × D × H` dimensions.
  - If an item is in the room: `Remove`.
  - If an item is removed: `Add` or `Drag` back into the room.
  - Drag-drop from sidebar places the item at cursor location (clamped to valid room bounds).

### 3D viewer
- Uses React Three Fiber + Drei.
- Room, fixtures, and furniture are rendered in 3D.
- Internal camera modes:
  - `Orbit`
  - `Walk` (pointer lock + WASD)

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm

### Install

```bash
pnpm install
```

### Run

```bash
pnpm dev
```

Open: `http://localhost:3000`

## Project Scope and Optional Modules

This repository started as a broader starter template and still contains optional modules for:
- Newsletter
- Analytics
- Auth scaffolding
- Drizzle/Neon database
- Resend email

Those modules are still present in `src/features/*` and `src/lib/*`, but the active app surface is the layout planner in `src/features/layout`.

## Environment Variables

For the layout planner alone, no external service credentials are required.

If you enable newsletter/email/database paths, copy `.env.example` to `.env.local` and provide values:

- `DATABASE_URL`
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID` (optional)

## Layout Data Model

Primary files:
- `src/features/layout/data.ts`
- `src/features/layout/types.ts`

All dimensions are in inches.

### Core concepts
- `Room`: room dimensions (`width`, `depth`, `height`)
- `Fixture`: non-movable architectural elements (doors, etc.)
- `FurnitureItem`: movable objects
- `Layout`: saved JSON payload (`name`, `timestamp`, `furniture`)

## Save/Load Format

Layout save/load is implemented in:
- `src/features/layout/utils/storage.ts`

Saved JSON includes:
- Layout name
- Timestamp
- Furniture array (positions, rotations, dimensions, metadata)

Room and fixture structure are treated as static and are not persisted in layout files.

## Key Source Files

- App entry: `src/app/page.tsx`
- Main planner shell: `src/features/layout/components/LayoutViewer.tsx`
- 2D canvas editor: `src/features/layout/components/LayoutEditor.tsx`
- 3D viewer: `src/features/layout/components/Layout3DView.tsx`
- Layout export/import: `src/features/layout/utils/storage.ts`

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript checks |
| `pnpm test` | Run Vitest once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm test:coverage` | Run Vitest with coverage |
| `pnpm format` | Format with Prettier |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run Drizzle migrations |
| `pnpm db:push` | Push schema changes |
| `pnpm db:studio` | Open Drizzle Studio |

## Known Limits

- Undo currently tracks drag-move actions (not every operation type).
- 3D mode is for visualization/navigation and does not provide direct 3D editing.
