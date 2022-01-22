interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen space-y-8 bg-purple-50 py-12">
      <div className="max-w-5xl mx-auto space-y-2">
        <div>{children}</div>
      </div>
    </div>
  )
}

export default MainLayout
