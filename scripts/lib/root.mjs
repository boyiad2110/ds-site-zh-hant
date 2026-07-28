/**
 * 資料根目錄解析。
 * 預設為 repository 根；整合測試以 DS_DATA_ROOT 指向暫存 fixture，
 * 確保測試不碰正式資料。
 */
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
export const dataRoot = process.env.DS_DATA_ROOT
  ? resolve(process.env.DS_DATA_ROOT)
  : repoRoot

export const p = (...parts) => resolve(dataRoot, ...parts)

/** 生成檔的來源指紋。取代 generatedAt —— 相同輸入必產生相同輸出（見指南 §9.2） */
export function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 16)
}
