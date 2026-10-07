const COLOR_MAP = {
  caries: '#ef4444',     // rojo
  gingivitis: '#e11d48',
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
      className="absolute inset-0 w-full h-full pointer-events-none"
    >
      {boxes.map((box, i) => {
        const color = COLOR_MAP[box.label] ?? DEFAULT_COLOR
        const w = box.x2 - box.x1
        const h = box.y2 - box.y1
        return (
          <g key={i}>
            {box.polygon?.length >= 3 && (
              <polygon
                points={box.polygon.map((point) => `${point.x},${point.y}`).join(' ')}
                fill={color} fillOpacity="0.28" stroke={color} strokeWidth="2"
              />
            )}
            <rect
              x={box.x1} y={box.y1} width={w} height={h}
              fill="none" stroke={color}
              strokeWidth={box.label === 'caries' ? 5 : 2}
              vectorEffect={box.label === 'caries' ? 'non-scaling-stroke' : undefined}
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
