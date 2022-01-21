import { useMemo } from "react"
import useSWR from "swr"
import queryString from "query-string"
import moment from "moment"

export interface MetricsRawData {
  [key: string]: Array<[string, number]>
}

export interface MetricsParsedData {
  [key: string]: Array<[Date, number]>
}

export type GroupBy = "day" | "hour" | "minute"

interface UseMetricsProps {
  groupBy?: GroupBy
  dateFrom?: string
  dateTo?: string
}

export const useDimensions = () => {
  const url = `http://localhost:4001/dimensions`

  let { data, error, mutate } = useSWR<string[]>(url, {
    dedupingInterval: 999999,
  })

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  }
}

export const useMetrics = (props?: UseMetricsProps) => {
  const groupBy = props?.groupBy || "day"
  const dateFrom = props?.dateFrom && moment(props.dateFrom).toDate()
  const dateTo = props?.dateTo && moment(props.dateTo).toDate()

  const qs = queryString.stringify({ groupBy, dateFrom, dateTo })

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
