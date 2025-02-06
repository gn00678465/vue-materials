import type { RouteRecordRaw } from 'vue-router'
import type { RouteProcessor, RouteProcessingOptions, ProcessedRoute } from './types'
import {
  flattenRedundantRoutes,
  applyAuthCheck,
  basicTransform,
  applySortStrategy
} from './utils'

/**
 * 路由處理器實作
 */
export class RouteProcessorImpl implements RouteProcessor {
  private plugins: ((processor: RouteProcessor) => void)[] = []

  /**
   * 處理路由配置
   * @param routes 原始路由配置
   * @param options 處理選項
   * @returns 處理後的結果
   */
  process<T = ProcessedRoute>(
    routes: RouteRecordRaw[],
    options: RouteProcessingOptions<T> = {}
  ): T[] {
    let processedRoutes = [...routes]

    // 1. 處理冗餘結構
    if (!options.skipRedundancyCheck) {
      processedRoutes = flattenRedundantRoutes(
        processedRoutes,
        options.isRedundant
      )
    }

    // 2. 套用權限檢查
    if (options.authCheck) {
      processedRoutes = applyAuthCheck(processedRoutes, options.authCheck)
    }

    // 3. 轉換格式
    const transformFn = options.transform || (basicTransform as unknown as (route: RouteRecordRaw) => T)
    const result = processedRoutes.map(transformFn)

    // 4. 套用排序策略
    if (options.sortStrategy) {
      return applySortStrategy(result, options.sortStrategy)
    }

    return result
  }

  /**
   * 擴展處理器功能
   * @param plugin 擴展插件
   */
  extend(plugin: (processor: RouteProcessor) => void): void {
    this.plugins.push(plugin)
    plugin(this)
  }
}

/**
 * 建立路由處理器實例
 * @returns 路由處理器實例
 */
export function createRouteProcessor(): RouteProcessor {
  return new RouteProcessorImpl()
}
