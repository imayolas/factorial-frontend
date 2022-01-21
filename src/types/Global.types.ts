export type GroupBy = "day" | "hour" | "minute"

export type Metric = Array<[Date, number]>

export interface MetricsCollection {
  [key: string]: Metric
}
