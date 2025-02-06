import type { RouteRecordRaw } from 'vue-router'
import type { ProcessedRoute } from './types'

/**
 * 檢查路由是否為冗餘結構
 * @param route 路由記錄
 * @param isRedundant 自定義冗餘檢查函式
 * @returns 是否為冗餘結構
 */
export function isRedundantRoute(
  route: RouteRecordRaw,
  isRedundant?: (route: RouteRecordRaw) => boolean
): boolean {
  if (isRedundant) {
    return isRedundant(route)
  }

  // 預設判斷邏輯: 檢查是否只有 children 且包含特定 meta 標記
  return !!(
    route.children?.length &&
    !route.component &&
    route.meta?.isLayout
  )
}

/**
 * 扁平化處理冗餘路由結構
 * @param routes 路由記錄陣列
 * @param isRedundant 自定義冗餘檢查函式
 * @returns 處理後的路由陣列
 */
export function flattenRedundantRoutes(
  routes: RouteRecordRaw[],
  isRedundant?: (route: RouteRecordRaw) => boolean
): RouteRecordRaw[] {
  return routes.reduce<RouteRecordRaw[]>((acc, route) => {
    if (isRedundantRoute(route, isRedundant)) {
      // 如果是冗餘結構,則將子路由上提
      return [
        ...acc,
        ...(route.children?.map(child => ({
          ...child,
          path: `${route.path}/${child.path}`.replace(/\/+/g, '/'),
          // 合併 meta 資料
          meta: { ...route.meta, ...child.meta }
        })) || [])
      ]
    }

    // 如果有子路由,遞迴處理
    if (route.children?.length) {
      return [
        ...acc,
        {
          ...route,
          children: flattenRedundantRoutes(route.children, isRedundant)
        }
      ]
    }

    return [...acc, route]
  }, [])
}

/**
 * 套用權限檢查
 * @param routes 路由記錄陣列
 * @param authCheck 權限檢查函式
 * @returns 過濾後的路由陣列
 */
export function applyAuthCheck(
  routes: RouteRecordRaw[],
  authCheck: (route: RouteRecordRaw) => boolean
): RouteRecordRaw[] {
  return routes.reduce<RouteRecordRaw[]>((acc, route) => {
    if (!authCheck(route)) {
      return acc
    }

    if (route.children?.length) {
      const filteredChildren = applyAuthCheck(route.children, authCheck)
      if (filteredChildren.length) {
        return [...acc, { ...route, children: filteredChildren }]
      }
      return acc
    }

    return [...acc, route]
  }, [])
}

/**
 * 基礎路由轉換函式
 * @param route 路由記錄
 * @returns 處理後的路由物件
 */
export function basicTransform(route: RouteRecordRaw): ProcessedRoute {
  const processed: ProcessedRoute = {
    path: route.path,
    name: route.name,
    label: (route.meta?.title as string) || route.name?.toString() || route.path,
    icon: route.meta?.icon as string | undefined,
    slot: route.meta?.slot as string | undefined,
    description: route.meta?.description as string | undefined
  }

  if (route.meta) {
    processed.meta = route.meta
  }

  if (route.children?.length) {
    processed.children = route.children.map(basicTransform)
  }

  return processed
}

/**
 * 套用排序策略
 * @param routes 路由記錄陣列
 * @param strategy 排序策略
 * @returns 排序後的路由陣列
 */
export function applySortStrategy<T>(
  routes: T[],
  strategy: string | ((a: T, b: T) => number)
): T[] {
  if (typeof strategy === 'function') {
    return [...routes].sort(strategy)
  }

  // 如果是預設排序策略,先轉換為 ProcessedRoute 再排序
  const sortFn = getSortFunction(strategy)
  return [...routes].sort((a, b) =>
    sortFn(a as unknown as ProcessedRoute, b as unknown as ProcessedRoute)
  )
}

/**
 * 取得預設排序函式
 * @param strategy 排序策略名稱
 * @returns 排序函式
 */
function getSortFunction(strategy: string): (a: ProcessedRoute, b: ProcessedRoute) => number {
  switch (strategy) {
    case 'pathLength':
      return (a, b) => a.path.length - b.path.length

    case 'metaOrder':
      return (a, b) => {
        // 嘗試從不同可能的位置獲取 order 值
        const getOrder = (item: ProcessedRoute) => {
          if (item.meta?.order !== undefined) return item.meta.order
          if ((item as any).order !== undefined) return (item as any).order
          return 0
        }
        return getOrder(a) - getOrder(b)
      }

    case 'default':
    default:
      return (a, b) => a.path.localeCompare(b.path)
  }
}
