'use client'

import { useState, useCallback, useRef } from 'react'
import type { FurnitureItem, Fixture, Room } from '../types'
import {
  room as defaultRoom,
  fixtures as defaultFixtures,
  initialFurniture,
} from '../data'
import { exportLayout, importLayout } from '../utils/storage'
import { LayoutEditor } from './LayoutEditor'
import { Layout3DView } from './Layout3DView'

type ViewMode = '2d' | '3d'

interface LayoutViewerProps {
  room?: Room
  fixtures?: Fixture[]
  initialFurnitureItems?: FurnitureItem[]
}

function normalizeRotation(rotation: number) {
  return ((rotation % 360) + 360) % 360
}

function getRotationMetrics(width: number, depth: number, rotation: number) {
  const radians = (normalizeRotation(rotation) * Math.PI) / 180
  const cos = Math.abs(Math.cos(radians))
  const sin = Math.abs(Math.sin(radians))
  const boundsWidth = width * cos + depth * sin
  const boundsDepth = width * sin + depth * cos

  return {
    offsetX: (boundsWidth - width) / 2,
    offsetY: (boundsDepth - depth) / 2,
  }
}

function clampValue(value: number, min: number, max: number) {
  const lower = Math.min(min, max)
  const upper = Math.max(min, max)
  return Math.min(upper, Math.max(lower, value))
}

function clampFurnitureToRoom(item: FurnitureItem, room: Room): FurnitureItem {
  const width = item.dimensions.width
  const depth = item.dimensions.depth
  const { offsetX, offsetY } = getRotationMetrics(
    width,
    depth,
    item.position.rotation
  )
  const clampedX = clampValue(
    item.position.x,
    offsetX,
    room.width - width - offsetX
  )
  const clampedY = clampValue(
    item.position.y,
    offsetY,
    room.depth - depth - offsetY
  )

  if (clampedX === item.position.x && clampedY === item.position.y) {
    return item
  }

  return {
    ...item,
    position: {
      ...item.position,
      x: clampedX,
      y: clampedY,
    },
  }
}

export function LayoutViewer({
  room = defaultRoom,
  fixtures = defaultFixtures,
  initialFurnitureItems = initialFurniture,
}: LayoutViewerProps) {
  const furnitureTemplates = initialFurnitureItems
  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  const [furniture, setFurniture] = useState<FurnitureItem[]>(
    furnitureTemplates.map((item) =>
      clampFurnitureToRoom(
        {
          ...item,
          dimensions: { ...item.dimensions },
          position: { ...item.position },
        },
        room
      )
    )
  )
  const [layoutName, setLayoutName] = useState('Current Layout')
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>(
    furnitureTemplates[0]?.id ?? null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFurnitureChange = useCallback(
    (newFurniture: FurnitureItem[]) => {
      setFurniture(newFurniture.map((item) => clampFurnitureToRoom(item, room)))
    },
    [room]
  )

  const handleSaveLayout = useCallback(() => {
    exportLayout(layoutName, furniture)
  }, [layoutName, furniture])

  const handleLoadLayout = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      try {
        const layout = await importLayout(file)
        setLayoutName(layout.name)
        const normalizedFurniture = layout.furniture.map((item) =>
          clampFurnitureToRoom(item, room)
        )
        setFurniture(normalizedFurniture)
        setSelectedFurnitureId(normalizedFurniture[0]?.id ?? null)
      } catch (error) {
        console.error('Failed to load layout:', error)
        alert('Failed to load layout file. Please check the file format.')
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [room]
  )

  const handleAddFurniture = useCallback(
    (itemId: string, dropPosition?: { x: number; y: number }) => {
      const template = furnitureTemplates.find((item) => item.id === itemId)
      if (!template) return

      setFurniture((prev) => {
        if (prev.some((item) => item.id === itemId)) return prev

        const nextItem: FurnitureItem = {
          ...template,
          dimensions: { ...template.dimensions },
          position: {
            ...template.position,
            x: dropPosition
              ? dropPosition.x - template.dimensions.width / 2
              : template.position.x,
            y: dropPosition
              ? dropPosition.y - template.dimensions.depth / 2
              : template.position.y,
          },
        }

        return [...prev, clampFurnitureToRoom(nextItem, room)]
      })

      setSelectedFurnitureId(itemId)
    },
    [furnitureTemplates, room]
  )

  const handleRemoveFurniture = useCallback((itemId: string) => {
    setFurniture((prev) => prev.filter((item) => item.id !== itemId))
    setSelectedFurnitureId((prev) => (prev === itemId ? null : prev))
  }, [])

  const handleTemplateDrop = useCallback(
    (itemId: string, dropPosition: { x: number; y: number }) => {
      handleAddFurniture(itemId, dropPosition)
    },
    [handleAddFurniture]
  )

  const handleTemplateDragStart = useCallback(
    (e: React.DragEvent<HTMLButtonElement>, itemId: string) => {
      e.dataTransfer.setData('application/x-layout-furniture-id', itemId)
      e.dataTransfer.effectAllowed = 'copy'
    },
    []
  )

  const placedIds = new Set(furniture.map((item) => item.id))

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white md:flex-row">
      <aside className="flex w-full flex-col gap-4 border-b border-zinc-800 bg-zinc-900/60 p-5 md:w-80 md:shrink-0 md:border-r md:border-b-0">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-300">
            Layout
          </h2>
          <input
            type="text"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
            className="mb-3 w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Layout name..."
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSaveLayout}
              className="rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Save
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded bg-zinc-700 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-600"
            >
              Load
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleLoadLayout}
            className="hidden"
          />
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-1">
            <button
              onClick={() => setViewMode('2d')}
              className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === '2d'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              2D
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`flex-1 rounded px-3 py-2 text-sm font-medium transition-colors ${
                viewMode === '3d'
                  ? 'bg-blue-600 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              3D
            </button>
          </div>
          <div className="space-y-1 font-mono text-sm text-zinc-400">
            <p>
              Width: {room.width}&quot; ({(room.width / 12).toFixed(1)} ft)
            </p>
            <p>
              Depth: {room.depth}&quot; ({(room.depth / 12).toFixed(1)} ft)
            </p>
            <p>Area: {((room.width * room.depth) / 144).toFixed(0)} sq ft</p>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-sm font-semibold tracking-wide text-zinc-300">
            Furniture
          </h2>
          <p className="text-xs text-zinc-500">
            Remove from room, then drag from here into the canvas to place it.
          </p>
          <div className="min-h-0 flex-1 space-y-2 overflow-auto pr-1">
            {furnitureTemplates.map((template) => {
              const isPlaced = placedIds.has(template.id)
              const isSelected = selectedFurnitureId === template.id

              return (
                <div
                  key={template.id}
                  className={`rounded-md border px-2 py-2 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/40'
                      : 'border-zinc-700 bg-zinc-800/70'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      isPlaced && setSelectedFurnitureId(template.id)
                    }
                    className={`w-full text-left text-sm ${
                      isPlaced ? 'text-white' : 'text-zinc-400'
                    }`}
                  >
                    <span className="block font-medium">{template.name}</span>
                    <span className="block text-xs text-zinc-500">
                      {template.dimensions.width}&quot; ×{' '}
                      {template.dimensions.depth}&quot; ×{' '}
                      {template.dimensions.height}&quot;
                    </span>
                  </button>
                  <div className="mt-2 flex gap-2">
                    {isPlaced ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveFurniture(template.id)}
                        className="flex-1 rounded bg-zinc-700 px-2 py-1.5 text-xs text-white hover:bg-zinc-600"
                      >
                        Remove
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleAddFurniture(template.id)}
                          className="flex-1 rounded bg-blue-600 px-2 py-1.5 text-xs text-white hover:bg-blue-500"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          draggable
                          onDragStart={(e) =>
                            handleTemplateDragStart(e, template.id)
                          }
                          className="cursor-grab rounded bg-zinc-700 px-2 py-1.5 text-xs text-white hover:bg-zinc-600 active:cursor-grabbing"
                        >
                          Drag
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-6">
        <div className="flex min-h-[60vh] w-full items-center justify-center overflow-auto md:h-[calc(100vh-3rem)]">
          {viewMode === '2d' ? (
            <LayoutEditor
              room={room}
              fixtures={fixtures}
              furniture={furniture}
              onFurnitureChange={handleFurnitureChange}
              selectedFurnitureId={selectedFurnitureId}
              onSelectedFurnitureChange={setSelectedFurnitureId}
              onFurnitureTemplateDrop={handleTemplateDrop}
            />
          ) : (
            <div className="h-full max-h-[860px] w-full max-w-6xl">
              <Layout3DView
                room={room}
                fixtures={fixtures}
                furniture={furniture}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
