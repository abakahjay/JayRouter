// Small fixed credit shown on every screen, the sign-in page included, so a
// visitor arriving from the portfolio can tell whose deployment this is and
// where the upstream project lives.
const PORTFOLIO_URL = 'https://portfolio-8jmo.onrender.com'
const UPSTREAM_URL = 'https://github.com/tashfeenahmed/freellmapi'

export function DeployCredit() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-2">
      <p className="pointer-events-auto rounded-md bg-background/80 px-2 py-1 text-center text-[11px] text-muted-foreground backdrop-blur">
        JayRouter by{' '}
        <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
          Joshua Blessed
        </a>
        {' · '}based on{' '}
        <a href={UPSTREAM_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
          FreeLLMAPI
        </a>{' '}
        (MIT)
      </p>
    </div>
  )
}
