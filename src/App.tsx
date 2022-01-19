import Home from "./components/pages/Main"
import MainLayout from "./components/layouts/MainLayout"
import { SWRConfig } from "swr"

const swrFetcher = (url: RequestInfo, init?: RequestInit) => fetch(url, init).then((res) => res.json())

function App() {
  return (
    <SWRConfig value={{ fetcher: swrFetcher }}>
      <MainLayout>
        <Home />
      </MainLayout>
    </SWRConfig>
  )
}

export default App
