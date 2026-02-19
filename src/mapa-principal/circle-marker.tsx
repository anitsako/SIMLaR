import { useState } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';

type MarkerColor = 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'purple' | 'pink' | 'teal' | 'white';

interface Props {
  position: [number, number];
  value: number | string;
  title?: string;
  color?: MarkerColor;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
}

const colorClasses: Record<MarkerColor, { normal: string; hover: string }> = {
  red: { normal: 'bg-red-500 text-white', hover: 'bg-red-300 text-gray-800' },
  green: { normal: 'bg-green-500 text-white', hover: 'bg-green-300 text-gray-800' },
  blue: { normal: 'bg-blue-500 text-white', hover: 'bg-blue-300 text-gray-800' },
  yellow: { normal: 'bg-yellow-400 text-gray-800', hover: 'bg-yellow-200 text-gray-800' },
  orange: { normal: 'bg-orange-500 text-white', hover: 'bg-orange-300 text-gray-800' },
  purple: { normal: 'bg-purple-500 text-white', hover: 'bg-purple-300 text-gray-800' },
  pink: { normal: 'bg-pink-500 text-white', hover: 'bg-pink-300 text-gray-800' },
  teal: { normal: 'bg-teal-500 text-white', hover: 'bg-teal-300 text-gray-800' },
  white: { normal: 'bg-white text-gray-800', hover: 'bg-gray-100 text-gray-800' },
};

export const CircleMarker = ({ position, value, title, color = 'white', onMouseOver, onMouseOut }: Props) => {
  const [hovered, setHovered] = useState(false);

  const { normal, hover } = colorClasses[color];
  const activeColor = hovered ? hover : normal;

  const icon = L.divIcon({
    className: `!w-8 !h-8 rounded-full border border-gray-700 box-border cursor-pointer transition-colors ${activeColor}`,
    html: `<span class="flex items-center justify-center w-full h-full text-sm font-semibold">${value}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
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
