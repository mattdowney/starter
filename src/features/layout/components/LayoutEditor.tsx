'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { FurnitureItem, Fixture, Room } from '../types'
import {
  room as defaultRoom,
  fixtures as defaultFixtures,
  initialFurniture,
} from '../data'

interface LayoutEditorProps {
  room?: Room
  fixtures?: Fixture[]
  furniture?: FurnitureItem[]
  onFurnitureChange?: (furniture: FurnitureItem[]) => void
  selectedFurnitureId?: string | null
  onSelectedFurnitureChange?: (id: string | null) => void
  onFurnitureTemplateDrop?: (
    itemId: string,
    dropPosition: { x: number; y: number }
  ) => void
}

// Scale: pixels per inch
const SCALE = 4
const WALL_SNAP_THRESHOLD = 6 // inches
const EDGE_SNAP_THRESHOLD = 3 // inches
const GRID_SNAP_THRESHOLD = 1.5 // inches
const GRID_SIZE = 12 // 1 foot
const POSITION_STEP = 1 // inch precision

interface Rect {
  left: number
  right: number
  top: number
  bottom: number
}

function normalizeRotation(rotation: number) {
  return ((rotation % 360) + 360) % 360
}

function getBaseSize(dimensions: { width: number; depth: number }) {
  return {
    width: dimensions.width,
    depth: dimensions.depth,
  }
}

function getRotationMetrics(width: number, depth: number, rotation: number) {
  const radians = (normalizeRotation(rotation) * Math.PI) / 180
  const cos = Math.abs(Math.cos(radians))
  const sin = Math.abs(Math.sin(radians))
  const boundsWidth = width * cos + depth * sin
  const boundsDepth = width * sin + depth * cos

  return {
    boundsWidth,
    boundsDepth,
    offsetX: (boundsWidth - width) / 2,
    offsetY: (boundsDepth - depth) / 2,
  }
}

function getItemRectAt(
  x: number,
  y: number,
  width: number,
  depth: number,
  rotation: number
): Rect {
  const { offsetX, offsetY } = getRotationMetrics(width, depth, rotation)

  return {
    left: x - offsetX,
    right: x + width + offsetX,
    top: y - offsetY,
    bottom: y + depth + offsetY,
  }
}

function getFurnitureRect(item: FurnitureItem): Rect {
  const size = getBaseSize(item.dimensions)
  return getItemRectAt(
    item.position.x,
    item.position.y,
    size.width,
    size.depth,
    item.position.rotation
  )
}

function getFixtureRect(fixture: Fixture): Rect {
  const size = getBaseSize(fixture.dimensions)
  return getItemRectAt(
    fixture.position.x,
    fixture.position.y,
    size.width,
    size.depth,
    fixture.position.rotation
  )
}

function rangesOverlap(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
  gap = 0
) {
  return aStart <= bEnd + gap && aEnd >= bStart - gap
}

function clampValue(value: number, min: number, max: number) {
  const lower = Math.min(min, max)
  const upper = Math.max(min, max)
  return Math.min(upper, Math.max(lower, value))
}

function clampPosition(x: number, y: number, item: FurnitureItem, room: Room) {
  const size = getBaseSize(item.dimensions)
  const { offsetX, offsetY } = getRotationMetrics(
    size.width,
    size.depth,
    item.position.rotation
  )
  const minX = offsetX
  const maxX = room.width - size.width - offsetX
  const minY = offsetY
  const maxY = room.depth - size.depth - offsetY

  return {
    x: clampValue(x, minX, maxX),
    y: clampValue(y, minY, maxY),
  }
}

function roundToStep(value: number, step: number) {
  return Math.round(value / step) * step
}

function findClosestSnap(
  current: number,
  candidates: number[],
  threshold: number
) {
  let best = current
  let bestDistance = threshold + 1

  for (const candidate of candidates) {
    const distance = Math.abs(candidate - current)
    if (distance <= threshold && distance < bestDistance) {
      best = candidate
      bestDistance = distance
    }
  }

  return best
}

function getSnappedPosition(
  x: number,
  y: number,
  item: FurnitureItem,
  furniture: FurnitureItem[],
  fixtures: Fixture[],
  room: Room
) {
  const size = getBaseSize(item.dimensions)
  const { offsetX, offsetY } = getRotationMetrics(
    size.width,
    size.depth,
    item.position.rotation
  )
  const clamped = clampPosition(x, y, item, room)
  const wallXCandidates = [offsetX, room.width - size.width - offsetX]
  const wallYCandidates = [offsetY, room.depth - size.depth - offsetY]
  const xEdgeCandidates: number[] = []
  const yEdgeCandidates: number[] = []
  const xGridCandidate = Math.round(clamped.x / GRID_SIZE) * GRID_SIZE
  const yGridCandidate = Math.round(clamped.y / GRID_SIZE) * GRID_SIZE

  const movingRect = getItemRectAt(
    clamped.x,
    clamped.y,
    size.width,
    size.depth,
    item.position.rotation
  )

  const snapTargets: Rect[] = [
    ...furniture.filter((other) => other.id !== item.id).map(getFurnitureRect),
    ...fixtures.map(getFixtureRect),
  ]

  for (const target of snapTargets) {
    if (
      rangesOverlap(
        movingRect.top,
        movingRect.bottom,
        target.top,
        target.bottom,
        EDGE_SNAP_THRESHOLD
      )
    ) {
      xEdgeCandidates.push(target.left + offsetX)
      xEdgeCandidates.push(target.right - size.width - offsetX)
      xEdgeCandidates.push(target.right + offsetX)
      xEdgeCandidates.push(target.left - size.width - offsetX)
    }

    if (
      rangesOverlap(
        movingRect.left,
        movingRect.right,
        target.left,
        target.right,
        EDGE_SNAP_THRESHOLD
      )
    ) {
      yEdgeCandidates.push(target.top + offsetY)
      yEdgeCandidates.push(target.bottom - size.depth - offsetY)
      yEdgeCandidates.push(target.bottom + offsetY)
      yEdgeCandidates.push(target.top - size.depth - offsetY)
    }
  }

  const wallSnappedX = findClosestSnap(
    clamped.x,
    wallXCandidates,
    WALL_SNAP_THRESHOLD
  )
  const wallSnappedY = findClosestSnap(
    clamped.y,
    wallYCandidates,
    WALL_SNAP_THRESHOLD
  )
  const edgeSnappedX =
    wallSnappedX !== clamped.x
      ? wallSnappedX
      : findClosestSnap(clamped.x, xEdgeCandidates, EDGE_SNAP_THRESHOLD)
  const edgeSnappedY =
    wallSnappedY !== clamped.y
      ? wallSnappedY
      : findClosestSnap(clamped.y, yEdgeCandidates, EDGE_SNAP_THRESHOLD)

  const snappedX =
    edgeSnappedX !== clamped.x
      ? edgeSnappedX
      : findClosestSnap(clamped.x, [xGridCandidate], GRID_SNAP_THRESHOLD)
  const snappedY =
    edgeSnappedY !== clamped.y
      ? edgeSnappedY
      : findClosestSnap(clamped.y, [yGridCandidate], GRID_SNAP_THRESHOLD)

  const roundedX = roundToStep(snappedX, POSITION_STEP)
  const roundedY = roundToStep(snappedY, POSITION_STEP)

  return clampPosition(roundedX, roundedY, item, room)
}

function clampFurnitureToRoom(item: FurnitureItem, room: Room): FurnitureItem {
  const clamped = clampPosition(item.position.x, item.position.y, item, room)
  if (clamped.x === item.position.x && clamped.y === item.position.y) {
    return item
  }

  return {
    ...item,
    position: {
      ...item.position,
      x: clamped.x,
      y: clamped.y,
    },
  }
}

function cloneFurniture(items: FurnitureItem[]) {
  return items.map((item) => ({
    ...item,
    dimensions: { ...item.dimensions },
    position: { ...item.position },
  }))
}

export function LayoutEditor({
  room = defaultRoom,
  fixtures = defaultFixtures,
  furniture: initialItems = initialFurniture,
  onFurnitureChange,
  selectedFurnitureId,
  onSelectedFurnitureChange,
  onFurnitureTemplateDrop,
}: LayoutEditorProps) {
  const [internalFurniture, setInternalFurniture] = useState<FurnitureItem[]>(
    initialItems.map((item) => clampFurnitureToRoom(item, room))
  )
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    selectedFurnitureId ?? null
  )
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const undoStackRef = useRef<FurnitureItem[][]>([])
  const dragStartSnapshotRef = useRef<FurnitureItem[] | null>(null)
  const dragMovedRef = useRef(false)
  const furniture = onFurnitureChange ? initialItems : internalFurniture
  const rawSelectedId = selectedFurnitureId ?? internalSelectedId
  const selectedId =
    rawSelectedId && furniture.some((item) => item.id === rawSelectedId)
      ? rawSelectedId
      : null

  const setSelectedFurniture = useCallback(
    (id: string | null) => {
      if (selectedFurnitureId === undefined) {
        setInternalSelectedId(id)
      }
      onSelectedFurnitureChange?.(id)
    },
    [onSelectedFurnitureChange, selectedFurnitureId]
  )

  const applyFurniture = useCallback(
    (nextItems: FurnitureItem[]) => {
      const normalized = nextItems.map((item) =>
        clampFurnitureToRoom(
          {
            ...item,
            dimensions: { ...item.dimensions },
            position: { ...item.position },
          },
          room
        )
      )

      if (onFurnitureChange) {
        onFurnitureChange(normalized)
      } else {
        setInternalFurniture(normalized)
      }
    },
    [onFurnitureChange, room]
  )

  const updateFurniture = useCallback(
    (updater: (prev: FurnitureItem[]) => FurnitureItem[]) => {
      applyFurniture(updater(furniture))
    },
    [applyFurniture, furniture]
  )

  useEffect(() => {
    const handleUndo = (e: KeyboardEvent) => {
      if (
        !(e.metaKey || e.ctrlKey) ||
        e.key.toLowerCase() !== 'z' ||
        e.shiftKey
      )
        return

      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }

      const previous = undoStackRef.current.pop()
      if (!previous) return

      e.preventDefault()
      applyFurniture(cloneFurniture(previous))
      setSelectedFurniture(null)
    }

    window.addEventListener('keydown', handleUndo)
    return () => window.removeEventListener('keydown', handleUndo)
  }, [applyFurniture, setSelectedFurniture])

  const canvasWidth = room.width * SCALE
  const canvasHeight = room.depth * SCALE

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, item: FurnitureItem) => {
      e.preventDefault()
      setSelectedFurniture(item.id)
      setDragging(item.id)
      dragStartSnapshotRef.current = cloneFurniture(furniture)
      dragMovedRef.current = false

      const rect = e.currentTarget.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    [furniture, setSelectedFurniture]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const contentLeft = containerRect.left + containerRef.current.clientLeft
      const contentTop = containerRect.top + containerRef.current.clientTop
      const x = (e.clientX - contentLeft - dragOffset.x) / SCALE
      const y = (e.clientY - contentTop - dragOffset.y) / SCALE

      updateFurniture((prev) => {
        let moved = false

        const next = prev.map((item) => {
          if (item.id !== dragging) return item

          const snapped = getSnappedPosition(x, y, item, prev, fixtures, room)
          const didChange =
            snapped.x !== item.position.x || snapped.y !== item.position.y

          if (!didChange) return item

          moved = true
          return {
            ...item,
            position: {
              ...item.position,
              x: snapped.x,
              y: snapped.y,
            },
          }
        })

        if (moved) {
          dragMovedRef.current = true
        }

        return next
      })
    },
    [dragging, dragOffset, fixtures, room, updateFurniture]
  )

  const handleMouseUp = useCallback(() => {
    if (dragging && dragMovedRef.current && dragStartSnapshotRef.current) {
      undoStackRef.current.push(dragStartSnapshotRef.current)
      if (undoStackRef.current.length > 100) {
        undoStackRef.current.shift()
      }
    }

    dragStartSnapshotRef.current = null
    dragMovedRef.current = false
    setDragging(null)
  }, [dragging])

  const handleCanvasDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    []
  )

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (!containerRef.current || !onFurnitureTemplateDrop) return

      const itemId = e.dataTransfer.getData('application/x-layout-furniture-id')
      if (!itemId) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const contentLeft = containerRect.left + containerRef.current.clientLeft
      const contentTop = containerRect.top + containerRef.current.clientTop
      const dropX = (e.clientX - contentLeft) / SCALE
      const dropY = (e.clientY - contentTop) / SCALE

      onFurnitureTemplateDrop(itemId, { x: dropX, y: dropY })
    },
    [onFurnitureTemplateDrop]
  )

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative box-content border-4 border-zinc-700 bg-zinc-900"
        style={{
          width: canvasWidth,
          height: canvasHeight,
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
      >
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #444 1px, transparent 1px),
              linear-gradient(to bottom, #444 1px, transparent 1px)
            `,
            backgroundSize: `${12 * SCALE}px ${12 * SCALE}px`, // 12" grid (1 foot)
          }}
        />

        {/* Wall labels */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-sm text-zinc-400">
          {room.width}&quot; ({(room.width / 12).toFixed(1)} ft)
        </div>
        <div
          className="absolute top-1/2 -left-16 -translate-y-1/2 font-mono text-sm text-zinc-400"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg) translateX(50%)',
          }}
        >
          {room.depth}&quot; ({(room.depth / 12).toFixed(1)} ft)
        </div>

        {/* Fixed fixtures (doors, etc.) - NOT draggable */}
        {fixtures.map((fixture) => {
          const displayWidth = fixture.dimensions.width
          const displayDepth = fixture.dimensions.depth

          return (
            <div
              key={fixture.id}
              className="pointer-events-none absolute"
              style={{
                left: fixture.position.x * SCALE,
                top: fixture.position.y * SCALE,
                width: displayWidth * SCALE,
                height: displayDepth * SCALE,
                backgroundColor: fixture.color,
                transform: `rotate(${fixture.position.rotation}deg)`,
                transformOrigin: 'center center',
                opacity: 0.9,
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center overflow-hidden p-1 text-center text-[10px] leading-tight font-medium text-white mix-blend-difference">
                {fixture.name}
              </span>
            </div>
          )
        })}

        {/* Movable furniture pieces */}
        {furniture.map((item) => {
          const displayWidth = item.dimensions.width
          const displayDepth = item.dimensions.depth
          const isRound = item.type === 'table' // Side table is round

          return (
            <div
              key={item.id}
              className={`absolute cursor-move transition-shadow ${
                selectedId === item.id
                  ? 'z-10 ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-900'
                  : 'hover:ring-1 hover:ring-zinc-500'
              }`}
              style={{
                left: item.position.x * SCALE,
                top: item.position.y * SCALE,
                width: displayWidth * SCALE,
                height: displayDepth * SCALE,
                backgroundColor: item.color,
                transform: `rotate(${item.position.rotation}deg)`,
                transformOrigin: 'center center',
                opacity: item.isWallMounted ? 0.8 : 1,
                borderRadius: isRound ? '50%' : undefined,
              }}
              onMouseDown={(e) => handleMouseDown(e, item)}
            >
              <span className="absolute inset-0 flex items-center justify-center overflow-hidden p-1 text-center text-[10px] leading-tight font-medium text-white mix-blend-difference">
                {item.name}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
