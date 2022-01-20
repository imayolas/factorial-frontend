import "chart.js/auto"
import { useMetrics } from "hooks/appHooks"
import { useEffect, useState } from "react"

import LineChart from "components/ui/LineChart"

const Main = () => {
  const { data: metrics, error, isLoading } = useMetrics()

  const [primaryDimension, setPrimaryDimension] = useState<string | undefined>()
  const [secondaryDimension, setSecondaryDimension] = useState<string | undefined>()

  useEffect(() => {
    if (metrics) {
      const dimensions = Object.keys(metrics)
      if (dimensions.length) {
        setPrimaryDimension(dimensions[0])
      }
      if (dimensions.length > 1) {
        setSecondaryDimension(dimensions[1])
      }
    }
  }, [metrics])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    throw error
  }

  const primaryDimensionData = metrics &&
    primaryDimension && {
      name: primaryDimension,
      data: metrics[primaryDimension],
    }

  const secondaryDimensionData =
    metrics && secondaryDimension
      ? {
          name: secondaryDimension,
          data: metrics[secondaryDimension],
        }
      : undefined

  return (
    <div>
      <div className="max-w-4xl mx-auto mb-4">
        {primaryDimensionData && (
          <LineChart
            groupBy="day"
            primaryDimension={primaryDimensionData}
            secondaryDimension={secondaryDimensionData}
          />
        )}
      </div>
    </div>
  )
}

export default Main
