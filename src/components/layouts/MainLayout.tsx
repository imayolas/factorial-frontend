import Title from "components/ui/Title"
interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-full space-y-8 bg-purple-50 py-12">
      <div className="max-w-6xl mx-auto space-y-2">
        <Title>Charting very interesting metrics</Title>
        <div className="text-gray-500 font-sm">A Factorial interview test by Isaac Mayolas</div>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default MainLayout
