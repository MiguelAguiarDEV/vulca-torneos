export default function Background() {
  return (
    <div className="fixed inset-0 z-0 h-full w-full
                    bg-gradient-to-br from-orange-50 to-accent
                    bg-cover bg-center overflow-hidden">
      {/* SVG de ruido superpuesto */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 200 200"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="10"
            stitchTiles="stitch"
          />
        </filter>
        <rect
          width="100%"
          height="100%"
          filter="url(#noiseFilter)"
          className="opacity-20"
        />
      </svg>

      {/* Aquí iría tu contenido encima */}
    </div>
  )
}
