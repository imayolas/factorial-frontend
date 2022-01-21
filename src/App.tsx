import Main from "./components/pages/Main"
import MainLayout from "./components/layouts/MainLayout"
import { SWRConfig } from "swr"
import swrFetcher from "utils/swrFetcher"

const fetcher = swrFetcher(process.env.REACT_APP_NOT_SECRET_CODE)

function App() {
  return (
    <SWRConfig value={{ fetcher }}>
      <MainLayout>
        <Main />
      </MainLayout>
    </SWRConfig>
  )
}

export default App
