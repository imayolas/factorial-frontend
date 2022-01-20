import "chart.js/auto"
import { useMetrics } from "hooks/appHooks"
import { useEffect, useState } from "react"

import LineChart from "components/ui/LineChart"
import Select from "components/ui/Select"

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

  const dimensions = metrics ? Object.keys(metrics) : []

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
    <div className="space-y-4 max-w-4xl mx-auto mb-4">
      <div>
        Primary: {primaryDimension} / Secondary: {secondaryDimension}
      </div>
      <div className="grid grid-cols-4 gap-x-6">
        <div>
          <Select
            name="dimension1"
            label="Dimension 1"
            options={dimensions}
            value={primaryDimension}
            onChange={setPrimaryDimension}
          />
        </div>
        <div>
          <Select
            name="dimension2"
            label="Dimension 2"
            options={dimensions}
            value={secondaryDimension}
            onChange={setSecondaryDimension}
          />
        </div>
      </div>
      {primaryDimensionData && (
        <LineChart groupBy="day" primaryDimension={primaryDimensionData} secondaryDimension={secondaryDimensionData} />
      )}
    </div>
  )
}

export default Main
