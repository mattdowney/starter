'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  PerspectiveCamera,
  PointerLockControls,
} from '@react-three/drei'
import type { FurnitureItem, Fixture, Room } from '../types'
import {
  room as defaultRoom,
  fixtures as defaultFixtures,
  initialFurniture,
} from '../data'
import * as THREE from 'three'

type CameraMode = 'orbit' | 'firstPerson'

interface Layout3DViewProps {
  room?: Room
  fixtures?: Fixture[]
  furniture?: FurnitureItem[]
}

// Wall component
function Wall({
  position,
  size,
}: {
  position: [number, number, number]
  size: [number, number, number]
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  )
}

// Floor component
function Floor({ width, depth }: { width: number; depth: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[width / 2, 0, depth / 2]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  )
}

// Fixture component (doors - rendered but distinguished)
function FixtureBox({ fixture }: { fixture: Fixture }) {
  const { dimensions, position, color } = fixture

  const x = position.x + dimensions.width / 2
  const z = position.y + dimensions.depth / 2
  const y = dimensions.height / 2

  return (
    <mesh position={[x, y, z]}>
      <boxGeometry
        args={[dimensions.width, dimensions.height, dimensions.depth]}
      />
      <meshStandardMaterial color={color} transparent opacity={0.7} />
    </mesh>
  )
}

// Furniture component
function FurnitureBox({ item }: { item: FurnitureItem }) {
  const { dimensions, position, color, type } = item
  const meshRef = useRef<THREE.Mesh>(null)

  const x = position.x + dimensions.width / 2
  const z = position.y + dimensions.depth / 2
  const y = dimensions.height / 2

  const rotationY = (position.rotation * Math.PI) / 180
  const isRound = type === 'table'

  return (
    <mesh ref={meshRef} position={[x, y, z]} rotation={[0, rotationY, 0]}>
      {isRound ? (
        <cylinderGeometry
          args={[
            dimensions.width / 2,
            dimensions.width / 2,
            dimensions.height,
            32,
          ]}
        />
      ) : (
        <boxGeometry
          args={[dimensions.width, dimensions.height, dimensions.depth]}
        />
      )}
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// Room structure with walls
function RoomStructure({ room }: { room: Room }) {
  const { width, depth, height } = room
  const wallThickness = 4

  return (
    <group>
      <Floor width={width} depth={depth} />
      <Wall
        position={[width / 2, height / 2, 0]}
        size={[width, height, wallThickness]}
      />
      <Wall
        position={[0, height / 2, depth / 2]}
        size={[wallThickness, height, depth]}
      />
      <Wall
        position={[width, height / 2, depth / 2]}
        size={[wallThickness, height, depth]}
      />
    </group>
  )
}

// First-person movement controller
function FirstPersonController({ room }: { room: Room }) {
  const { camera } = useThree()
  const moveSpeed = 3
  const keys = useRef({ w: false, a: false, s: false, d: false })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = true
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = false
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    const direction = new THREE.Vector3()
    const frontVector = new THREE.Vector3()
    const sideVector = new THREE.Vector3()

    camera.getWorldDirection(direction)
    direction.y = 0
    direction.normalize()

    frontVector.copy(direction)
    sideVector.crossVectors(camera.up, direction)

    const velocity = new THREE.Vector3()

    if (keys.current.w) velocity.add(frontVector.multiplyScalar(moveSpeed))
    if (keys.current.s) velocity.add(frontVector.multiplyScalar(-moveSpeed))
    if (keys.current.a) velocity.add(sideVector.multiplyScalar(moveSpeed))
    if (keys.current.d) velocity.add(sideVector.multiplyScalar(-moveSpeed))

    // Apply movement with bounds checking
    const newX = camera.position.x + velocity.x
    const newZ = camera.position.z + velocity.z

    // Keep within room bounds (with some padding)
    const padding = 12
    if (newX > padding && newX < room.width - padding) {
      camera.position.set(newX, camera.position.y, camera.position.z)
    }
    if (newZ > padding && newZ < room.depth - padding) {
      camera.position.set(camera.position.x, camera.position.y, newZ)
    }
  })

  return null
}

// Main 3D Scene
function Scene({
  room,
  fixtures,
  furniture,
  cameraMode,
}: {
  room: Room
  fixtures: Fixture[]
  furniture: FurnitureItem[]
  cameraMode: CameraMode
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[room.width / 2, room.height * 2, room.depth / 2]}
        intensity={1}
      />
      <pointLight
        position={[room.width / 2, room.height - 10, room.depth / 2]}
        intensity={0.5}
      />

      {/* Room structure */}
      <RoomStructure room={room} />

      {/* Fixed fixtures (doors) */}
      {fixtures.map((fixture) => (
        <FixtureBox key={fixture.id} fixture={fixture} />
      ))}

      {/* Movable furniture */}
      {furniture.map((item) => (
        <FurnitureBox key={item.id} item={item} />
      ))}

      {/* Camera controls based on mode */}
      {cameraMode === 'orbit' ? (
        <OrbitControls
          target={[room.width / 2, room.height / 3, room.depth / 2]}
          maxPolarAngle={Math.PI / 2}
          minDistance={50}
          maxDistance={500}
        />
      ) : (
        <>
          <PointerLockControls />
          <FirstPersonController room={room} />
        </>
      )}
    </>
  )
}

export function Layout3DView({
  room = defaultRoom,
  fixtures = defaultFixtures,
  furniture = initialFurniture,
}: Layout3DViewProps) {
  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit')

  // Camera positions
  const orbitCameraPosition: [number, number, number] = [
    room.width / 2,
    room.height * 1.5,
    room.depth * 1.5,
  ]

  const firstPersonCameraPosition: [number, number, number] = [
    room.width / 2,
    60, // Eye height ~5 feet
    room.depth - 40,
  ]

  const cameraPosition =
    cameraMode === 'orbit' ? orbitCameraPosition : firstPersonCameraPosition

  return (
    <div className="relative h-full min-h-[600px] w-full overflow-hidden rounded-lg bg-zinc-950">
      {/* Mode toggle */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 p-1">
        <button
          onClick={() => setCameraMode('orbit')}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
            cameraMode === 'orbit'
              ? 'bg-blue-600 text-white'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          Orbit
        </button>
        <button
          onClick={() => setCameraMode('firstPerson')}
          className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
            cameraMode === 'firstPerson'
              ? 'bg-blue-600 text-white'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
        >
          Walk
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10 rounded bg-zinc-900/80 px-3 py-2 text-xs text-zinc-500">
        {cameraMode === 'orbit' ? (
          <>Orbit: drag | Zoom: scroll | Pan: right-drag</>
        ) : (
          <>Click to lock | WASD to move | Mouse to look | ESC to unlock</>
        )}
      </div>

      <Canvas shadows>
        <PerspectiveCamera
          makeDefault
          position={cameraPosition}
          fov={cameraMode === 'firstPerson' ? 75 : 50}
        />
        <Scene
          room={room}
          fixtures={fixtures}
          furniture={furniture}
          cameraMode={cameraMode}
        />
      </Canvas>
    </div>
  )
}
