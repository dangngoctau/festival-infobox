const festivalConfig = {
  version: '1.2.0',
  festivalName: 'Lễ hội Quán Thế Âm',
  location: 'Ngũ Hành Sơn, Đà Nẵng',
  year: 2026,
  lunarYear: 'Bính Ngọ',
  tagline: 'Di sản văn hóa phi vật thể quốc gia',
  startDate: '2026-04-04',
  endDate: '2026-04-07',
  lunarDates: ['17/02', '18/02', '19/02', '20/02'],
  dayLabels: ['Khai mạc', 'Ngày 2', 'Lễ chính', 'Bế mạc'],
  dates: ['2026-04-04', '2026-04-05', '2026-04-06', '2026-04-07'],
  gateCoords: { lat: 16.000484, lng: 108.259449 }, // Cổng chào Sư Vạn Hạnh × Lê Văn Hiến (verified)
  mapCenter: { lat: 15.9995, lng: 108.2560 },
  mapZoom: 16,
  languages: ['vi', 'en'],
  splashMode: 'svg',                // 'svg' | 'photo'
  splashPhoto: '/images/splash.jpg', // used when splashMode === 'photo'
  dayTaglines: [
    'Sáng khai kinh, chiều khai hội, tối hoa đăng',
    'Cà kheo rộn ràng, kinh kệ an nhiên',
    'Ngày vía Bồ tát — tâm điểm lễ hội',
    'Đi bộ vì hòa bình, khép lại mùa lễ',
  ],
}

export default festivalConfig
