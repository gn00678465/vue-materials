import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由處理選項介面
 */
export interface RouteProcessingOptions<T = ProcessedRoute> {
  /**
   * 權限檢查函式
   * @param route 路由記錄
   * @returns 是否通過權限檢查
   */
  authCheck?: (route: RouteRecordRaw) => boolean

  /**
   * 自定義轉換函式
   * @param route 路由記錄
   * @returns 轉換後的結果
   */
  transform?: (route: RouteRecordRaw) => T

  /**
   * 排序策略
   */
  sortStrategy?: string | ((a: T, b: T) => number)

  /**
   * 是否跳過冗餘結構處理
   * @default false
   */
  skipRedundancyCheck?: boolean

  /**
   * 用於識別冗餘結構的條件
   * @param route 路由記錄
   * @returns 是否為冗餘結構
   */
  isRedundant?: (route: RouteRecordRaw) => boolean
}

/**
 * 排序策略類型
 */
export type SortStrategy = 'default' | 'pathLength' | 'metaOrder' | ((a: RouteRecordRaw, b: RouteRecordRaw) => number)

/**
 * 路由處理器介面
 */
export interface RouteProcessor {
  /**
   * 處理路由配置
   * @param routes 原始路由配置
   * @param options 處理選項
   * @returns 處理後的結果
   */
  process<T>(routes: RouteRecordRaw[], options?: RouteProcessingOptions<T>): T[]

  /**
   * 擴展處理器功能
   * @param plugin 擴展插件
   */
  extend(plugin: (processor: RouteProcessor) => void): void
}

/**
 * 路由處理結果介面
 */
export interface RouteMeta {
  isLayout?: boolean
  order?: number
  title?: string
  icon?: string
  slot?: string
  description?: string
  [key: string]: unknown
}

export interface ProcessedRoute {
  path: string
  name?: string | symbol
  meta?: RouteMeta
  children?: ProcessedRoute[]
  label?: string
  icon?: string
  slot?: string
  description?: string
  [key: string]: unknown
}
