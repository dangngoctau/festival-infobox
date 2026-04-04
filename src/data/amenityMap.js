import {
  ShowerHead, Car, Cross, GlassWater,
  Banknote, Info, Accessibility, Bike,
  Bus, Wifi, Camera, AlertTriangle
} from 'lucide-react'

export const amenityMap = {
  wc:           { icon: ShowerHead,    label: 'Nhà vệ sinh',     label_en: 'Restroom' },
  parking_car:  { icon: Car,           label: 'Bãi đỗ ô tô',    label_en: 'Car Parking' },
  parking_bike: { icon: Bike,          label: 'Bãi xe máy',      label_en: 'Motorbike Parking' },
  medical:      { icon: Cross,         label: 'Y tế / Sơ cứu',  label_en: 'First Aid' },
  water:        { icon: GlassWater,    label: 'Nước uống',       label_en: 'Drinking Water' },
  atm:          { icon: Banknote,      label: 'ATM',             label_en: 'ATM' },
  info:         { icon: Info,          label: 'Thông tin',       label_en: 'Information' },
  accessible:   { icon: Accessibility, label: 'Xe lăn',          label_en: 'Wheelchair Access' },
  bus_stop:     { icon: Bus,           label: 'Trạm xe bus',     label_en: 'Bus Stop' },
  wifi:         { icon: Wifi,          label: 'WiFi miễn phí',   label_en: 'Free WiFi' },
  photo_spot:   { icon: Camera,        label: 'Điểm chụp ảnh',  label_en: 'Photo Spot' },
  restricted:   { icon: AlertTriangle, label: 'Khu vực hạn chế', label_en: 'Restricted Area' },
}

export const amenityTypes = Object.keys(amenityMap)
