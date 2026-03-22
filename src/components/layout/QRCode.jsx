import { useState } from 'react'

const QR_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data='

export default function QRCode({ url = 'https://lehoi-quantheam.vn' }) {
  const [error, setError] = useState(false)

  if (error) return null

  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={`${QR_URL}${encodeURIComponent(url)}`}
        alt="QR Code"
        width={120}
        height={120}
        className="rounded"
        onError={() => setError(true)}
      />
      <p className="text-xs text-warm-muted">Quét để truy cập</p>
    </div>
  )
}
