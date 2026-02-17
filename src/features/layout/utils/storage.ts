import type { Layout, FurnitureItem } from '../types'

/**
 * Export a layout as a downloadable JSON file
 * Only saves furniture positions - room structure/fixtures are constant
 */
export function exportLayout(name: string, furniture: FurnitureItem[]): void {
  const layout: Layout = {
    name,
    timestamp: new Date().toISOString(),
    furniture,
  }

  const blob = new Blob([JSON.stringify(layout, null, 2)], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-layout.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Import a layout from a JSON file
 * Returns furniture positions to apply to current room structure
 */
export async function importLayout(file: File): Promise<Layout> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const parsed = JSON.parse(content)

        // Validate the parsed data
        if (!isValidLayout(parsed)) {
          throw new Error('Invalid layout file format')
        }

        resolve(parsed as Layout)
      } catch {
        reject(new Error('Failed to parse layout file'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Validate that an object matches the Layout schema
 */
function isValidLayout(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false

  const layout = obj as Record<string, unknown>

  // Check required fields
  if (typeof layout.name !== 'string') return false
  if (typeof layout.timestamp !== 'string') return false

  // Validate furniture array
  if (!Array.isArray(layout.furniture)) return false
  for (const item of layout.furniture) {
    if (!isValidFurnitureItem(item)) return false
  }

  return true
}

/**
 * Validate that an object matches the FurnitureItem schema
 */
function isValidFurnitureItem(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return false

  const item = obj as Record<string, unknown>

  if (typeof item.id !== 'string') return false
  if (typeof item.name !== 'string') return false
  if (typeof item.type !== 'string') return false
  if (typeof item.color !== 'string') return false

  // Validate dimensions
  if (!item.dimensions || typeof item.dimensions !== 'object') return false
  const dims = item.dimensions as Record<string, unknown>
  if (typeof dims.width !== 'number') return false
  if (typeof dims.depth !== 'number') return false
  if (typeof dims.height !== 'number') return false

  // Validate position
  if (!item.position || typeof item.position !== 'object') return false
  const pos = item.position as Record<string, unknown>
  if (typeof pos.x !== 'number') return false
  if (typeof pos.y !== 'number') return false
  if (typeof pos.rotation !== 'number') return false

  return true
}
