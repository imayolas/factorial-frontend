import "chart.js/auto"
import { useMetrics, Metric } from "hooks/appHooks"
import { Chart } from "react-chartjs-2"

const transformApiDataToChartJsData = (apiData: Metric[]) => {}

const Main = () => {
  const { data: metrics, error, isLoading } = useMetrics()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    throw error
  }

  console.log(2, metrics)

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <Chart
          type="line"
          datasetIdKey="id"
          data={{
            labels: ["Jun", "Jul", "Aug"],
            datasets: [
              {
                // id: 1,
                label: "lorem",
                data: [5, 6, 7],
              },
              {
                // id: 2,
                label: "ipsum",
                data: [3, 2, 1],
              },
            ],
          }}
        />
      </div>
    </div>
  )
}

export default Main
