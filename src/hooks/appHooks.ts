import useSWR from "swr"

export interface Metric {
  start_date: string
  name: string
  average: number
}

interface MetricsAPIResponse {
  meta: Array<{ name: string; type: string }>
  data: Array<Metric>
  rows: number
  statistics: {
    elapsed: number
    rows_read: number
    bytes_read: number
  }
  transferred: number
}

export const useMetrics = () => {
  let { data, error, mutate } = useSWR<MetricsAPIResponse>(`http://localhost:4001/metrics?groupBy=day`, {
    dedupingInterval: 10000,
  })

  console.log(2, data, error)

  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  }
}
