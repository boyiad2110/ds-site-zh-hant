import { Link } from 'react-router-dom'
import { buildSearchRoute } from './routes'

export function NotFound() {
  return <main className="state-page">
    <h1>找不到這個頁面</h1>
    <p>內容可能不在目前收錄範圍內，或網址已經變更。</p>
    <Link className="link-button" to={buildSearchRoute()}>回到規則庫</Link>
  </main>
}
