import "chart.js/auto"
import { useMetrics, MetricsParsedData } from "hooks/appHooks"
import { useEffect, useMemo, useState } from "react"
import { Chart as ChartJS } from "react-chartjs-2"
import moment from "moment"
import LineChart from "components/ui/LineChart"

interface TransformerParams {
  data: MetricsParsedData
  primaryDimension: string
  secondaryDimension?: string
  groupBy: "minute" | "hour" | "day"
}

const _getMinMaxDates = (datesCollection1: Array<Date>, datesCollection2?: Array<Date>) => {
  const datesCollection = [...datesCollection1].concat(datesCollection2 || [])
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

const _getLabel = (params: TransformerParams) => {
  const { data, primaryDimension, secondaryDimension, groupBy } = params
  const primaryDimensionData = data[primaryDimension]
  const secondaryDimensionData = secondaryDimension ? data[secondaryDimension] : undefined

  const primaryDimensionDates = primaryDimensionData.map(([date]) => date)
  const secondaryDimensionDates = secondaryDimensionData && secondaryDimensionData.map(([date]) => date)

  const { minDate, maxDate } = _getMinMaxDates(primaryDimensionDates, secondaryDimensionDates)

  let dateFormat: string = "YYYY-MM-DD"
  if (groupBy === "minute") {
    dateFormat += " HH:mm"
  } else if (groupBy === "hour") {
    dateFormat += " HH"
  }
  return _getFillerDates(minDate, maxDate, groupBy).map((date) => moment(date).format(dateFormat))
}

const _getDatasets = (params: TransformerParams) => {
  const { data, primaryDimension, secondaryDimension, groupBy } = params
  const primaryDimensionData = data[primaryDimension]
  const secondaryDimensionData = secondaryDimension ? data[secondaryDimension] : undefined

  const primaryDimensionDates = primaryDimensionData.map(([date]) => date)
  const secondaryDimensionDates = secondaryDimensionData && secondaryDimensionData.map(([date]) => date)

  const { minDate, maxDate } = _getMinMaxDates(primaryDimensionDates, secondaryDimensionDates)

  const startMoment = moment(minDate)
  const endMoment = moment(maxDate)

  const primaryDimensionDataFilledWithBlanks = []
  const secondaryDimensionDataFilledWithBlanks = []

  while (startMoment.isSameOrBefore(endMoment)) {
    const primaryDataPoint = primaryDimensionData.find(([date]) => moment(date).isSame(startMoment))
    primaryDimensionDataFilledWithBlanks.push(primaryDataPoint ? primaryDataPoint[1] : null)

    if (secondaryDimensionData) {
      const secondaryDataPoint = secondaryDimensionData.find(([date]) => moment(date).isSame(startMoment))
      secondaryDimensionDataFilledWithBlanks.push(secondaryDataPoint ? secondaryDataPoint[1] : null)
    }

    if (groupBy === "minute") {
      startMoment.add(1, "minute")
    } else if (groupBy === "hour") {
      startMoment.add(1, "hour")
    } else if (groupBy === "day") {
      startMoment.add(1, "day")
    }
  }

  const datasets = [
    {
      label: primaryDimension,
      data: primaryDimensionDataFilledWithBlanks,
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.5,
    },
  ]

  if (secondaryDimension) {
    datasets.push({
      label: secondaryDimension,
      data: secondaryDimensionDataFilledWithBlanks,
      fill: false,
      borderColor: "rgb(90, 180, 321)",
      tension: 0.5,
    })
  }
  return datasets
}

const transformer = (params: TransformerParams) => {
  const primaryDimensionDataNormalized = params.data[params.primaryDimension].map(([date, value]) => {
    return [moment(date).startOf(params.groupBy).toDate(), value]
  })

  const secondaryDimensionDataNormalized =
    params.secondaryDimension &&
    params.data[params.secondaryDimension].map(([date, value]) => {
      return [moment(date).startOf(params.groupBy).toDate(), value]
    })

  const normalizedParams = {
    ...params,
    primaryDimensionData: primaryDimensionDataNormalized,
    secondaryDimensionData: secondaryDimensionDataNormalized,
  }

  return {
    labels: _getLabel(normalizedParams),
    datasets: _getDatasets(normalizedParams),
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
      <LineChart data={metrics} primaryDimension={primaryDimension} secondaryDimension={secondaryDimension} />
      <div className="max-w-2xl mx-auto">
        {chartjsData && <ChartJS type="line" datasetIdKey="id" data={chartjsData} />}
      </div>
    </div>
  )
}

export default Main
