import useBreakpoint from '../../hooks/useBreakpoint'

export default function ResponsiveLayout({ timeline, map }) {
  const { isMobile } = useBreakpoint()

  if (isMobile) {
    return null // handled by parent with tabs
  }

  return (
    <div className="flex gap-4 h-[calc(100dvh-200px)]">
      <div className="w-[60%] desktop:w-[65%] overflow-y-auto pr-2">
        {timeline}
      </div>
      <div className="w-[40%] desktop:w-[35%] sticky top-0">
        {map}
      </div>
    </div>
  )
}
