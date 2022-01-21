import classNames from "utils/classnames"

interface TitleProps {
  children: React.ReactNode
  className?: string
  props?: React.HTMLAttributes<HTMLHeadingElement>
}

const Title = ({ children, className, ...props }: TitleProps) => {
  return (
    <h2 className={classNames("text-4xl font-bold", className)} {...props}>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-500 ">{children}</span>
    </h2>
  )
}

export default Title
