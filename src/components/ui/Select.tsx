import classnames from "utils/classnames"

interface SelectProps {
  name: string
  label?: string
  className?: string
  options: Array<string>
  value?: string | undefined | null
  onChange?: (value: any) => void
}

const Select = ({ name, label, className, options, value = null, onChange, ...props }: SelectProps) => {
  const _onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange && onChange(event.target.value)
  }
  return (
    <div>
      {label && (
        <label htmlFor={name} className={`block font-semibold text-sm text-gray-700 mb-1`}>
          {label}
        </label>
      )}
      <select
        className={classnames(
          "mt-1 block w-full pl-4 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
          className
        )}
        onChange={_onChange}
        value={value ? value : undefined}
        {...props}
      >
        {options &&
          options.map((innerValue) => {
            return (
              <option key={innerValue} value={innerValue}>
                {innerValue}
              </option>
            )
          })}
      </select>
    </div>
  )
}

export default Select
