import "chart.js/auto"
import { useMetrics, MetricsParsedData } from "hooks/appHooks"
import { useEffect, useMemo, useState } from "react"
import { Chart } from "react-chartjs-2"
import moment from "moment"

const myData = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.5,
    },
    {
      label: "My Second Datasetxxx",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      borderColor: "rgb(90, 50, 30)",
      tension: 0.5,
    },
  ],
}

interface TransformerParams {
  data: MetricsParsedData
  primaryDimension: string
  secondaryDimension?: string
  groupBy: "minute" | "hour" | "day"
}

const transformApiDataToChartJsDataset = (apiData: MetricsParsedData) => {
  const labels = Object.keys(apiData)

  const datasets = Object.entries(apiData).map(([metricName, data], index) => {
    return {
      id: index + 1,
      label: metricName,
      data: data[1],
    }
  })

  return myData
  return {
    // labels,
    // datasets,
  }
}

const _getMinMaxDates = (datesCollection: Array<Date>) => {
  const momentizedDates = datesCollection.map((date) => moment(date))
  const minDate = moment.min(momentizedDates).toDate()
  const maxDate = moment.max(momentizedDates).toDate()
  return { minDate, maxDate }
}

const _getFillerDates = (startDate: Date, endDate: Date, groupBy: "minute" | "hour" | "day") => {
  const startMoment = moment(startDate)
  const endMoment = moment(endDate)
  const fillerDates = []
  while (startMoment.isSameOrBefore(endMoment)) {
    fillerDates.push(startMoment.toDate())
    if (groupBy === "minute") {
      startMoment.add(1, "minute")
    } else if (groupBy === "hour") {
      startMoment.add(1, "hour")
    } else if (groupBy === "day") {
      startMoment.add(1, "day")
    }
  }
  return fillerDates
}

const transformer = (params: TransformerParams) => {
  const { data, primaryDimension, secondaryDimension, groupBy } = params
  const primaryDimensionData = data[primaryDimension]
  const secondaryDimensionData = secondaryDimension ? data[secondaryDimension] : undefined

  const primaryDimensionDates = primaryDimensionData.map(([date]) => date)
  const secondaryDimensionDates = secondaryDimensionData && secondaryDimensionData.map(([date]) => date)

  const mergedDates = [...primaryDimensionDates].concat(secondaryDimensionDates || [])

  const { minDate, maxDate } = _getMinMaxDates(mergedDates)
  const fillerDates = _getFillerDates(minDate, maxDate, groupBy).map((date) => moment(date).format("YYYY-MM-DD"))
  console.log(1, fillerDates)

  return {
    labels: fillerDates,
    datasets: [
      {
        label: "My First Dataset",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.5,
      },
      {
        label: "My Second Dataset",
        data: [28, 32, 90, 19, 86, 27, 90],
        fill: false,
        borderColor: "rgb(80, 120, 15)",
        tension: 0.5,
        spanGaps: true,
      },
    ],
  }
}

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

  const chartjsData = useMemo(() => {
    if (metrics && primaryDimension) {
      return transformer({ data: metrics, groupBy: "day", primaryDimension, secondaryDimension })
    }
  }, [metrics, primaryDimension, secondaryDimension])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    throw error
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        {chartjsData && <Chart type="line" datasetIdKey="id" data={chartjsData} />}
      </div>
    </div>
  )
}

export default Main
