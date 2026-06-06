import { useEffect, useRef, useState } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

export type MarkerColor = 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'purple' | 'pink' | 'teal' | 'white';
export type MarkerShape = 'circle' | 'triangle' | 'square' | 'rhombus' | 'pentagon' | 'hexagon';

interface Props {
  position: [number, number];
  value: number | string;
  title?: string;
  color?: MarkerColor;
  shape?: MarkerShape | null;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  isTooltipActive?: boolean;
}

export const colorValues: Record<
  MarkerColor,
  { normal: { fill: string; text: string }; hover: { fill: string; text: string } }
> = {
  red: { normal: { fill: '#ef4444', text: '#ffffff' }, hover: { fill: '#fca5a5', text: '#1f2937' } },
  green: { normal: { fill: '#22c55e', text: '#ffffff' }, hover: { fill: '#86efac', text: '#1f2937' } },
  blue: { normal: { fill: '#3b82f6', text: '#ffffff' }, hover: { fill: '#93c5fd', text: '#1f2937' } },
  yellow: { normal: { fill: '#facc15', text: '#1f2937' }, hover: { fill: '#fef08a', text: '#1f2937' } },
  orange: { normal: { fill: '#f97316', text: '#ffffff' }, hover: { fill: '#fdba74', text: '#1f2937' } },
  purple: { normal: { fill: '#a855f7', text: '#ffffff' }, hover: { fill: '#d8b4fe', text: '#1f2937' } },
  pink: { normal: { fill: '#ec4899', text: '#ffffff' }, hover: { fill: '#f9a8d4', text: '#1f2937' } },
  teal: { normal: { fill: '#14b8a6', text: '#ffffff' }, hover: { fill: '#5eead4', text: '#1f2937' } },
  white: { normal: { fill: '#ffffff', text: '#1f2937' }, hover: { fill: '#f3f4f6', text: '#1f2937' } },
};

const shapeData: Record<MarkerShape, { svgShape: string; textY: number }> = {
  circle: { svgShape: '<circle cx="16" cy="16" r="14.5" />', textY: 16 },
  square: { svgShape: '<rect x="0.5" y="0.5" width="31" height="31" />', textY: 16 },
  triangle: { svgShape: '<polygon points="16,1.5 30.5,30.5 1.5,30.5" />', textY: 21 },
  rhombus: { svgShape: '<polygon points="16,1.5 30.5,16 16,30.5 1.5,16" />', textY: 16 },
  pentagon: { svgShape: '<polygon points="16,1.5 29.8,11.5 24.5,27.7 7.5,27.7 2.2,11.5" />', textY: 17 },
  hexagon: { svgShape: '<polygon points="16,1.5 28.6,8.75 28.6,23.25 16,30.5 3.4,23.25 3.4,8.75" />', textY: 16 },
};

export const MainMarker = ({
  position,
  value,
  title,
  color = 'white',
  shape,
  onClick,
  onMouseOver,
  onMouseOut,
  isTooltipActive,
}: Props) => {
  const [hovered, setHovered] = useState(false);
  const markerRef = useRef<L.Marker | null>(null);

  const { normal, hover } = colorValues[color];
  const { fill, text: textColor } = hovered ? hover : normal;
  const resolvedShape = shape ?? 'circle';
  const { svgShape, textY } = shapeData[resolvedShape];

  const icon = L.divIcon({
    className: 'cursor-pointer',
    html: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="${fill}" stroke="#374151" stroke-width="1">${svgShape}</g>
      <text x="16" y="${textY}" text-anchor="middle" dominant-baseline="central" font-size="12" font-weight="600" fill="${textColor}" font-family="sans-serif">${value}</text>
    </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  useEffect(() => {
    if (!title || !markerRef.current || isTooltipActive === undefined) {
      return;
    }

    if (isTooltipActive) {
      markerRef.current.openTooltip();
      return;
    }

    markerRef.current.closeTooltip();
  }, [isTooltipActive, title]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => {
          onClick?.();
        },
        mouseover: () => {
          setHovered(true);
          onMouseOver?.();
        },
        mouseout: () => {
          setHovered(false);
          onMouseOut?.();
        },
      }}
    >
      {title && <Tooltip direction="top">{title}</Tooltip>}
    </Marker>
  );
};
