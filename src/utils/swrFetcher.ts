import isAbsoluteUrl from "is-absolute-url"

const swrFetcher = (hostname?: string) => async (url: RequestInfo, init?: RequestInit) => {
  if (typeof url === "string" && hostname && !isAbsoluteUrl(url)) {
    url = new URL(url, hostname).toString()
  }
  return await fetch(url, init).then((res) => res.json())
}

export default swrFetcher
