const COLOR_MAP = {
  caries: '#ef4444',     // rojo
  gingivitis: '#f97316', // naranja
}

const DEFAULT_COLOR = '#3b82f6'

/**
 * SVG superpuesto sobre la imagen dental con los bounding boxes del modelo.
 * Espera que el contenedor sea `position: relative`.
 *
 * @param {{ boxes: BoundingBox[], imageWidth: number, imageHeight: number }} props
 */
export default function BoundingBoxOverlay({ boxes = [], imageWidth, imageHeight }) {
  if (!boxes.length || !imageWidth || !imageHeight) return null

  return (
    <svg
      viewBox={`0 0 ${imageWidth} ${imageHeight}`}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    >
      {boxes.map((box, i) => {
        const color = COLOR_MAP[box.label] ?? DEFAULT_COLOR
        const w = box.x2 - box.x1
        const h = box.y2 - box.y1
        return (
          <g key={i}>
            <rect
              x={box.x1} y={box.y1} width={w} height={h}
              fill="none" stroke={color} strokeWidth="2"
            />
            <rect
              x={box.x1} y={box.y1 - 18} width={w < 80 ? 80 : w} height={18}
              fill={color}
            />
            <text
              x={box.x1 + 4} y={box.y1 - 4}
              fill="white" fontSize="12" fontWeight="600"
            >
              {box.label} {Math.round(box.confidence * 100)}%
            </text>
          </g>
        )
      })}
    </svg>
  )
}
