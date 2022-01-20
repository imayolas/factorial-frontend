import classnames from "utils/classnames"

interface DateInputProps {
  name?: string
  label?: string
  className?: string
  options?: Array<string>
  value?: string | undefined | null
  onChange?: (value: Date) => void
}

const DateInput = ({ name, label, className, options, value = null, onChange, ...props }: DateInputProps) => {
  const _onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(new Date(event.target.value))
  }

  return (
    <div>
      {label && (
        <label htmlFor={name} className={`block font-semibold text-sm text-gray-700 mb-1`}>
          {label}
        </label>
      )}
      <input
        type="date"
        className={classnames(
          "mt-1 block w-full pl-4 pr-2 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md",
          className
        )}
        onChange={_onChange}
        value={value ? value : undefined}
        {...props}
      />
    </div>
  )
}

export default DateInput
