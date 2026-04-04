export const locationColors = {
  'le-dai': '#8B2500',
  'chua': '#B8860B',
  'trienlam-thieunhi': '#C06080',
  'dao-trang': '#8B6914',
  'bai-xe-btc': '#888888',
  'mieu-huyen-tran': '#9B5E6E',
  'chua-thai-son': '#7B6B5A',
  'sk-dan-gian': '#2E5A88',
  'ocop': '#D4760A',
  'trienlam-anh': '#5A8F7B',
  'da-my-nghe': '#7B8B6F',
  'dam-sen': '#4A6741',
  'song-co-co': '#6A3D7D',
  'dieu-hanh': '#B5651D',
  'cong-chao': '#A08060',
  'bai-xe-1': '#888888',
  'bai-xe-2': '#888888',
  'wc-1': '#666666',
  'wc-2': '#666666',
  'wc-3': '#666666',
}

export const categoryColors = {
  ceremony: '#C8A35A',
  dharma: '#8B6914',
  folk: '#2E7D32',
  exhibition: '#2E5A88',
  culinary: '#E65100',
  art: '#6A3D7D',
}

export const categoryLabels = {
  ceremony: 'Lễ nghi',
  dharma: 'Phật pháp',
  folk: 'Dân gian',
  exhibition: 'Triển lãm',
  culinary: 'Ẩm thực chay',
  art: 'Nghệ thuật',
}

export const categoryToGroup = {
  ceremony: 'buddhist-ceremony',
  dharma: 'buddhist-ceremony',
  art: 'performing-arts',
  exhibition: 'exhibition',
  folk: 'folk-culture',
  culinary: 'cuisine',
}

// cat group → icon component ID
export const catGroupToIconId = {
  'buddhist-ceremony': 'buddhist',
  'performing-arts': 'performance',
  'exhibition': 'craft',
  'folk-culture': 'folk',
  'cuisine': 'cuisine',
}

// Icon ID → accent color (from categories.json accentColor)
export const categoryIconColors = {
  buddhist: '#C8A35A',
  performance: '#6A3D7D',
  craft: '#2E5A88',
  folk: '#2E7D32',
  cuisine: '#E65100',
}

// Zone colors — each zone takes the color of its primary location
export const zoneColors = {
  'chua': '#C8A35A',
  'svh': '#4A7FB5',
  'song': '#7B5EA7',
  'cv': '#4A6741',
  'cong': '#D4845A',
}

// Zone → location IDs mapping (which locations belong to each zone)
export const zoneToLocations = {
  'chua': ['le-dai', 'chua', 'trienlam-thieunhi', 'dao-trang'],
  'svh': ['sk-dan-gian', 'trienlam-anh', 'da-my-nghe', 'ocop', 'mieu-huyen-tran', 'chua-thai-son'],
  'song': ['song-co-co'],
  'cv': ['dam-sen'],
  'cong': ['cong-chao'],
}

// Reverse lookup: location ID → zone ID
export const locationToZone = Object.entries(zoneToLocations).reduce((acc, [zoneId, locIds]) => {
  locIds.forEach(locId => { acc[locId] = zoneId })
  return acc
}, {})
