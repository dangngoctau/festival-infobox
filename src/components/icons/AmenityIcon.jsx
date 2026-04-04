import { amenityMap } from '../../data/amenityMap'
import { Info } from 'lucide-react'

const variantStyles = {
  map: {
    container: (size) => ({
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: '#D4B896',
      border: '1.5px solid #FFFDF8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
    }),
    iconColor: '#FFFDF8',
    iconRatio: 14 / 24,
  },
  list: {
    container: (size) => ({
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: '#FFFDF7',
      border: '1.5px solid #D4B896',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    iconColor: '#6B4226',
    iconRatio: 18 / 32,
  },
  chip: {
    container: (size) => ({
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: 'rgba(212, 184, 150, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    iconColor: '#6B4226',
    iconRatio: 14 / 20,
  },
}

export default function AmenityIcon({ type, size, variant = 'list', className = '' }) {
  const entry = amenityMap[type]
  const IconComponent = entry ? entry.icon : Info
  const v = variantStyles[variant] || variantStyles.list

  const defaultSize = variant === 'map' ? 24 : variant === 'chip' ? 20 : 32
  const s = size || defaultSize
  const iconSize = Math.round(s * v.iconRatio)

  const containerStyle = v.container(s)
  if (!entry) {
    containerStyle.backgroundColor = variant === 'map' ? '#9E9E9E' : '#F0F0F0'
    if (variant === 'map') containerStyle.border = '1.5px solid #FFFDF8'
  }

  return (
    <div style={containerStyle} className={className}>
      <IconComponent
        size={iconSize}
        color={!entry && variant !== 'map' ? '#9E9E9E' : v.iconColor}
        strokeWidth={2}
      />
    </div>
  )
}
