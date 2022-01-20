import "chart.js/auto"
import { useMetrics, GroupBy } from "hooks/appHooks"
import { useEffect, useReducer, Reducer } from "react"

import LineChart from "components/ui/LineChart"
import Select from "components/ui/Select"
import DateInput from "components/ui/DateInput"

interface MainState {
  primaryDimension: string | undefined
  secondaryDimension: string | undefined
  groupBy: GroupBy
  fromDate: Date | undefined
  toDate: Date | undefined
}

const initialState: MainState = {
  primaryDimension: undefined,
  secondaryDimension: undefined,
  groupBy: "day",
  fromDate: undefined,
  toDate: undefined,
}

type MainStateAction =
  | { type: "SET_PRIMARY_DIMENSION"; payload: string }
  | { type: "SET_SECONDARY_DIMENSION"; payload: string }
  | { type: "SET_GROUP_BY"; payload: GroupBy }
  | { type: "SET_FROM_DATE"; payload: Date }
  | { type: "SET_TO_DATE"; payload: Date }

const mainStateReducer = (state: MainState, action: MainStateAction): MainState => {
  switch (action.type) {
    case "SET_PRIMARY_DIMENSION":
      return { ...state, primaryDimension: action.payload }
    case "SET_SECONDARY_DIMENSION":
      return { ...state, secondaryDimension: action.payload }
    case "SET_GROUP_BY":
      return { ...state, groupBy: action.payload }
    case "SET_FROM_DATE":
      return { ...state, fromDate: action.payload }
    case "SET_TO_DATE":
      return { ...state, toDate: action.payload }
    default:
      return state
  }
}

const Main = () => {
  const [state, dispatch] = useReducer<Reducer<MainState, MainStateAction>>(mainStateReducer, initialState)

  const { data: metrics, error, isLoading } = useMetrics(state)

  useEffect(() => {
    if (metrics) {
      const dimensions = Object.keys(metrics)
      if (dimensions.length) {
        dispatch({ type: "SET_PRIMARY_DIMENSION", payload: dimensions[0] })
      }
      if (dimensions.length > 1) {
        dispatch({ type: "SET_SECONDARY_DIMENSION", payload: dimensions[1] })
      }
    }
  }, [metrics])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    throw error
  }

  const dimensions = metrics ? Object.keys(metrics) : []

  const primaryDimensionData = metrics &&
    state.primaryDimension && {
      name: state.primaryDimension,
      data: metrics[state.primaryDimension],
    }

  const secondaryDimensionData =
    metrics && state.secondaryDimension
      ? {
          name: state.secondaryDimension,
          data: metrics[state.secondaryDimension],
        }
      : undefined

  return (
    <div className="space-y-4 max-w-6xl mx-auto mb-4">
      <div className="grid grid-cols-5 gap-x-6">
        <div>
          <Select
            name="dimension1"
            label="Dimension 1"
            options={dimensions}
            value={state.primaryDimension}
            onChange={(value) => dispatch({ type: "SET_PRIMARY_DIMENSION", payload: value })}
          />
        </div>
        <div>
          <Select
            name="dimension2"
            label="Dimension 2"
            options={dimensions}
            value={state.secondaryDimension}
            onChange={(value) => dispatch({ type: "SET_SECONDARY_DIMENSION", payload: value })}
          />
        </div>
        <div>
          <Select
            name="groupBy"
            label="Group by"
            options={["day", "hour", "minute"]}
            value={state.groupBy}
            onChange={(value: GroupBy) => dispatch({ type: "SET_GROUP_BY", payload: value })}
          />
        </div>
        <div>
          <DateInput label="Date from" onChange={(value) => dispatch({ type: "SET_FROM_DATE", payload: value })} />
        </div>
        <div>
          <DateInput label="Date to" onChange={(value) => dispatch({ type: "SET_TO_DATE", payload: value })} />
        </div>
      </div>
      {primaryDimensionData && (
        <LineChart groupBy="day" primaryDimension={primaryDimensionData} secondaryDimension={secondaryDimensionData} />
      )}
    </div>
  )
}

export default Main
