import { MetricsParsedData } from "hooks/appHooks"

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
      label: "My Second Dataset",
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.5,
    },
  ],
}
export const transformApiDataToChartJsDataset = (apiData: MetricsParsedData) => {
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
