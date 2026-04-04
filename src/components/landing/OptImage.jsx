import { useState } from 'react'

const BASE = import.meta.env.BASE_URL
const WIDTHS = [400, 800, 1200]

/**
 * Responsive image component with WebP + JPEG fallback.
 *
 * Generates srcSet from naming convention:
 *   {BASE}images/landing/{name}-{width}w.{ext}
 *
 * @param {string} name   - Base name (e.g. "hero-bg")
 * @param {string} alt    - Alt text
 * @param {string} [sizes] - sizes attribute (default "100vw")
 * @param {string} [loading] - "lazy" (default) or "eager"
 * @param {string} [className]
 * @param {object} [style]
 * @param {function} [onLoad]
 * @param {function} [onError] - Called on error; component returns null by default
 * @param {object} [rest] - Additional props passed to <img>
 */
export default function OptImage({
  name,
  alt,
  sizes = '100vw',
  loading = 'lazy',
  className,
  style,
  onLoad,
  onError,
  ...rest
}) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  const path = `${BASE}images/landing/${name}`
  const webpSrcSet = WIDTHS.map((w) => `${path}-${w}w.webp ${w}w`).join(', ')
  const jpgSrcSet = WIDTHS.map((w) => `${path}-${w}w.jpg ${w}w`).join(', ')

  return (
    <picture className="contents">
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={`${path}-800w.jpg`}
        srcSet={jpgSrcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        className={className}
        style={style}
        onLoad={onLoad}
        onError={(e) => {
          setFailed(true)
          onError?.(e)
        }}
        {...rest}
      />
    </picture>
  )
}
