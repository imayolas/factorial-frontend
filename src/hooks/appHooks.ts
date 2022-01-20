import { useMemo } from "react"
import useSWR from "swr"
import queryString from "query-string"

export interface MetricsRawData {
  [key: string]: Array<[string, number]>
}

export interface MetricsParsedData {
  [key: string]: Array<[Date, number]>
}

export type GroupBy = "day" | "hour" | "minute"

interface UseMetricsProps {
  groupBy?: GroupBy
  dateFrom?: Date
  dateTo?: Date
  dimension1?: string
  dimension2?: string
}

export const useMetrics = (props?: UseMetricsProps) => {
  if (!props) {
    props = { groupBy: "day" }
  }
  if (!props.groupBy) {
    props.groupBy = "day"
  }

  const qs = queryString.stringify(props)
  const url = `http://localhost:4001/metrics?${qs}`

  let { data, error, mutate } = useSWR<MetricsRawData>(url, {
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
