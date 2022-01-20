import { useMemo } from "react"
import { Chart as ChartJS } from "react-chartjs-2"
import moment from "moment"

export interface LineChartDimensionParams {
  name: string
  data: Array<[Date, number]>
}

export interface LineChartProps {
  primaryDimension: LineChartDimensionParams
  secondaryDimension?: LineChartDimensionParams
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

const _getChartLabels = (params: LineChartProps) => {
  const { primaryDimension, secondaryDimension, groupBy } = params

  const primaryDimensionDates = primaryDimension.data.map(([date]) => date)
  const secondaryDimensionDates = secondaryDimension && secondaryDimension.data.map(([date]) => date)

  const { minDate, maxDate } = _getMinMaxDates(primaryDimensionDates, secondaryDimensionDates)

  let dateFormat: string = "YYYY-MM-DD"
  if (groupBy === "minute") {
    dateFormat += " HH:mm"
  } else if (groupBy === "hour") {
    dateFormat += " HH"
  }
  return _getFillerDates(minDate, maxDate, groupBy).map((date) => moment(date).format(dateFormat))
}

const _getChartDatasets = (params: LineChartProps) => {
  const { primaryDimension, secondaryDimension, groupBy } = params

  const primaryDimensionDates = primaryDimension.data.map(([date]) => date)
  const secondaryDimensionDates = secondaryDimension && secondaryDimension.data.map(([date]) => date)
  const { minDate, maxDate } = _getMinMaxDates(primaryDimensionDates, secondaryDimensionDates)

  const startMoment = moment(minDate)
  const endMoment = moment(maxDate)

  const primaryDimensionDataFilledWithBlanks = []
  const secondaryDimensionDataFilledWithBlanks = []

  while (startMoment.isSameOrBefore(endMoment)) {
    const primaryDataPoint = primaryDimension.data.find(([date]) => moment(date).isSame(startMoment))
    primaryDimensionDataFilledWithBlanks.push(primaryDataPoint ? primaryDataPoint[1] : null)

    if (secondaryDimension) {
      const secondaryDataPoint = secondaryDimension.data.find(([date]) => moment(date).isSame(startMoment))
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
      label: primaryDimension.name,
      data: primaryDimensionDataFilledWithBlanks,
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.5,
    },
  ]

  if (secondaryDimension) {
    datasets.push({
      label: secondaryDimension.name,
      data: secondaryDimensionDataFilledWithBlanks,
      fill: false,
      borderColor: "rgb(90, 180, 321)",
      tension: 0.5,
    })
  }
  return datasets
}

const _transformInputDataToChartJsSchema = (params: LineChartProps) => {
  const { primaryDimension, secondaryDimension, groupBy } = params

  // Set all input dates to the beginning of the groupBy period
  const primaryDimensionDataNormalized: [Date, number][] = primaryDimension.data.map(([date, value]) => {
    return [moment(date).startOf(groupBy).toDate(), value]
  })
  const secondaryDimensionDataNormalized: [Date, number][] | undefined =
    secondaryDimension &&
    secondaryDimension.data.map(([date, value]) => {
      return [moment(date).startOf(groupBy).toDate(), value]
    })

  const normalizedParams: LineChartProps = {
    groupBy,
    primaryDimension: { name: primaryDimension.name, data: primaryDimensionDataNormalized },
  }

  if (secondaryDimension && secondaryDimensionDataNormalized) {
    normalizedParams.secondaryDimension = { name: secondaryDimension.name, data: secondaryDimensionDataNormalized }
  }

  return {
    labels: _getChartLabels(normalizedParams),
    datasets: _getChartDatasets(normalizedParams),
  }
}

const LineChart = (props: LineChartProps) => {
  const { primaryDimension, secondaryDimension, groupBy } = props

  const chartjsData = useMemo(() => {
    if (groupBy && primaryDimension) {
      return _transformInputDataToChartJsSchema({ primaryDimension, secondaryDimension, groupBy })
    }
  }, [primaryDimension, secondaryDimension, groupBy])

  if (!chartjsData) {
    return null
  }

  return <ChartJS type="line" data={chartjsData} />
}

export default LineChart
