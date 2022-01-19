interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-full">
      <h2>Main layout</h2>
      <div className="py-10">{children}</div>
    </div>
  )
}

export default MainLayout
