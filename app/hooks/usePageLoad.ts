// Custom hook to manage page loading state
// You can adjust the loading duration by changing the timeout value in the component

export function usePageLoad(durationMs: number = 3000) {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, durationMs)

    return () => clearTimeout(timer)
  }, [durationMs])

  return isLoading
}
