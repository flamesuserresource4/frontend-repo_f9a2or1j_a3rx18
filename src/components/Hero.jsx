import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative h-[420px] sm:h-[520px] w-full overflow-hidden rounded-2xl bg-[#0b0b12]">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-8 text-center">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          Interactive Server Admin Simulator
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-violet-100/90">
          Monitor servers, respond to incidents, build automations, and earn a high score.
        </p>
      </div>
    </section>
  )
}

export default Hero
