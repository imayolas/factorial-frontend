import { useMemo } from "react"
import useSWR from "swr"

export interface MetricsRawData {
  [key: string]: Array<[string, number]>
}

export interface MetricsParsedData {
  [key: string]: Array<[Date, number]>
}

export const useMetrics = () => {
  let { data, error, mutate } = useSWR<MetricsRawData>(`http://localhost:4001/metrics?groupBy=day`, {
    dedupingInterval: 10000,
  })

  const parsedData = useMemo(() => {
    if (!data) {
      return null
    }

    const res: MetricsParsedData = {}

    Object.entries(data).forEach(([metricName, metricData]) => {
      res[metricName] = metricData.map(([date, value]) => [new Date(date), value])
    })
    return res
  }, [data])

  return {
    data: parsedData,
    isLoading: !error && !data,
    error,
    mutate,
  }
}
