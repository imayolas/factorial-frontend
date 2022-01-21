import "chart.js/auto"
import { useMetrics, GroupBy, useDimensions } from "hooks/appHooks"
import { useEffect, useReducer, Reducer } from "react"

import LineChart from "components/ui/LineChart"
import Select from "components/ui/Select"
import DateInput from "components/ui/DateInput"
import moment from "moment"

interface MainState {
  primaryDimension: string | undefined
  secondaryDimension: string | undefined
  groupBy: GroupBy
  dateFrom: string | undefined
  dateTo: string | undefined
}

const initialState: MainState = {
  primaryDimension: undefined,
  secondaryDimension: undefined,
  groupBy: "day",
  dateFrom: moment().subtract(1, "month").format("YYYY-MM-DD"),
  dateTo: moment().format("YYYY-MM-DD"),
}

type MainStateAction =
  | { type: "SET_PRIMARY_DIMENSION"; payload: string }
  | { type: "SET_SECONDARY_DIMENSION"; payload: string }
  | { type: "SET_GROUP_BY"; payload: GroupBy }
  | { type: "SET_DATE_FROM"; payload: string }
  | { type: "SET_DATE_TO"; payload: string }

const mainStateReducer = (state: MainState, action: MainStateAction): MainState => {
  switch (action.type) {
    case "SET_PRIMARY_DIMENSION":
      return { ...state, primaryDimension: action.payload }
    case "SET_SECONDARY_DIMENSION":
      return { ...state, secondaryDimension: action.payload }
    case "SET_GROUP_BY":
      if (action.payload === "hour") {
        const ThreeDaysAfterDateFrom = moment(state.dateFrom).add(3, "days")
        const dateTo = moment(state.dateTo).isAfter(ThreeDaysAfterDateFrom)
          ? ThreeDaysAfterDateFrom.format("YYYY-MM-DD")
          : state.dateTo
        return { ...state, groupBy: action.payload, dateTo }
      }

      if (action.payload === "minute") {
        const OneDayAfterDateFrom = moment(state.dateFrom).add(1, "days")
        const dateTo = moment(state.dateTo).isAfter(OneDayAfterDateFrom)
          ? OneDayAfterDateFrom.format("YYYY-MM-DD")
          : state.dateTo
        return { ...state, groupBy: action.payload, dateTo }
      }
      return { ...state, groupBy: action.payload }

    case "SET_DATE_FROM":
      return { ...state, dateFrom: action.payload }
    case "SET_DATE_TO":
      return { ...state, dateTo: action.payload }
    default:
      return state
  }
}

const Main = () => {
  const [state, dispatch] = useReducer<Reducer<MainState, MainStateAction>>(mainStateReducer, initialState)
  const { dateFrom, dateTo, groupBy, primaryDimension, secondaryDimension } = state

  const payload = {
    dateFrom: dateFrom && moment(dateFrom).isAfter("1970-01-01") ? dateFrom : undefined,
    dateTo: dateTo && moment(dateFrom).isAfter("1970-01-01") ? dateTo : undefined,
    groupBy: groupBy,
  }

  const { data: metrics, error: metricsError } = useMetrics(payload)
  const { data: dimensions, error: dimensionsError } = useDimensions()

  if (metricsError) {
    throw metricsError
  }

  if (dimensionsError) {
    throw dimensionsError
  }

  useEffect(() => {
    if (dimensions && metrics && !primaryDimension) {
      dispatch({ type: "SET_PRIMARY_DIMENSION", payload: dimensions[0] })
    }
  }, [dimensions, metrics, primaryDimension])

  useEffect(() => {
    if (dimensions && dimensions.length > 1 && metrics && !secondaryDimension) {
      dispatch({ type: "SET_SECONDARY_DIMENSION", payload: dimensions[1] })
    }
  }, [dimensions, metrics, secondaryDimension])

  const primaryDimensionData =
    metrics && primaryDimension
      ? {
          name: primaryDimension,
          data: metrics[primaryDimension] || [],
        }
      : { name: "", data: [] }

  const secondaryDimensionData =
    metrics && secondaryDimension
      ? {
          name: secondaryDimension,
          data: metrics[secondaryDimension] || [],
        }
      : undefined

  return (
    <div className="space-y-4 max-w-6xl mx-auto mb-4">
      <div className="grid grid-cols-5 gap-x-6">
        <div>
          <Select
            name="dimension1"
            label="Dimension 1"
            options={dimensions || []}
            value={primaryDimension}
            onChange={(value) => dispatch({ type: "SET_PRIMARY_DIMENSION", payload: value })}
          />
        </div>
        <div>
          <Select
            name="dimension2"
            label="Dimension 2"
            options={dimensions || []}
            value={secondaryDimension}
            onChange={(value) => dispatch({ type: "SET_SECONDARY_DIMENSION", payload: value })}
          />
        </div>
        <div>
          <Select
            name="groupBy"
            label="Group by"
            options={["day", "hour", "minute"]}
            value={groupBy}
            onChange={(value: GroupBy) => dispatch({ type: "SET_GROUP_BY", payload: value })}
          />
        </div>
        <div>
          <DateInput
            label="Date from"
            value={dateFrom}
            onChange={(value) => {
              dispatch({ type: "SET_DATE_FROM", payload: value })
            }}
          />
        </div>
        <div>
          <DateInput
            label="Date to"
            value={dateTo}
            onChange={(value) => dispatch({ type: "SET_DATE_TO", payload: value })}
          />
        </div>
      </div>

      {primaryDimensionData && (
        <LineChart
          groupBy={groupBy}
          primaryDimension={primaryDimensionData}
          secondaryDimension={secondaryDimensionData}
        />
      )}
    </div>
  )
}

export default Main
