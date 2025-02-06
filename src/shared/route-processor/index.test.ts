import { describe, it, expect } from 'vitest'
import { createRouteProcessor } from './core'
import type { RouteRecordRaw } from 'vue-router'
import type { ProcessedRoute } from './types'

describe('RouteProcessor', () => {
  const mockRoutes: RouteRecordRaw[] = [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: {},
      meta: { requiresAuth: true, order: 1 }
    },
    {
      path: '/layout',
      meta: { isLayout: true },
      children: [
        {
          path: 'profile',
          name: 'profile',
          component: {},
          meta: { requiresAuth: true, order: 2 }
        },
        {
          path: 'settings',
          name: 'settings',
          component: {},
          meta: { requiresAuth: false, order: 3 }
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      component: {},
      meta: { requiresAuth: false, order: 4 }
    }
  ]

  it('應該正確處理冗餘結構', () => {
    const processor = createRouteProcessor()
    const result = processor.process(mockRoutes)
    const processedRoutes = result as ProcessedRoute[]

    expect(processedRoutes).toHaveLength(4)
    expect(processedRoutes.some(r => r.path === '/layout')).toBe(false)
    expect(processedRoutes.some(r => r.path === '/layout/profile')).toBe(true)
    expect(processedRoutes.some(r => r.path === '/layout/settings')).toBe(true)
  })

  it('應該正確套用權限檢查', () => {
    const processor = createRouteProcessor()
    const result = processor.process(mockRoutes, {
      authCheck: route => route.meta?.requiresAuth === true
    })
    const processedRoutes = result as ProcessedRoute[]

    expect(processedRoutes).toHaveLength(2)
    expect(processedRoutes.some(r => r.name === 'dashboard')).toBe(true)
    expect(processedRoutes.some(r => r.path === '/layout/profile')).toBe(true)
    expect(processedRoutes.some(r => r.name === 'settings')).toBe(false)
    expect(processedRoutes.some(r => r.name === 'about')).toBe(false)
  })

  it('應該正確套用排序策略', () => {
    const processor = createRouteProcessor()
    const result = processor.process(mockRoutes, {
      sortStrategy: 'metaOrder'
    })
    const processedRoutes = result as ProcessedRoute[]

    // 驗證排序結果
    const orders = processedRoutes.map(r => r.meta?.order)
    expect(orders).toEqual([1, 2, 3, 4])

    // 驗證路徑順序
    const paths = processedRoutes.map(r => r.path)
    expect(paths).toEqual([
      '/dashboard',
      '/layout/profile',
      '/layout/settings',
      '/about'
    ])
  })

  it('應該支援 Nuxt UI NavigationMenu 格式', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/docs',
        name: 'docs',
        component: {},
        meta: {
          title: 'Documentation',
          icon: 'i-heroicons-book-open',
          description: 'Learn how to use our UI library',
          slot: 'docs'
        },
        children: [
          {
            path: 'getting-started',
            name: 'docs-getting-started',
            component: {},
            meta: {
              title: 'Getting Started',
              description: 'Quick start guide'
            }
          }
        ]
      }
    ]

    const processor = createRouteProcessor()
    const result = processor.process(routes)

    expect(result[0]).toMatchObject({
      path: '/docs',
      name: 'docs',
      label: 'Documentation',
      icon: 'i-heroicons-book-open',
      description: 'Learn how to use our UI library',
      slot: 'docs',
      children: [
        {
          path: 'getting-started',
          name: 'docs-getting-started',
          label: 'Getting Started',
          description: 'Quick start guide'
        }
      ]
    })
  })

  it('應該支援自定義轉換', () => {
    interface CustomMenu {
      key: string
      label: string
      children?: CustomMenu[]
    }

    const processor = createRouteProcessor()
    const result = processor.process<CustomMenu>(mockRoutes, {
      transform: route => ({
        key: route.name as string,
        label: route.path,
        ...(route.children && {
          children: route.children.map(child => ({
            key: child.name as string,
            label: child.path
          }))
        })
      })
    })

    expect(result[0]).toMatchObject({
      key: 'dashboard',
      label: '/dashboard'
    })
  })

  it('應該支援跳過冗餘結構處理', () => {
    const processor = createRouteProcessor()
    const result = processor.process(mockRoutes, {
      skipRedundancyCheck: true
    })
    const processedRoutes = result as ProcessedRoute[]

    const layoutRoute = processedRoutes.find(r => r.path === '/layout')
    expect(layoutRoute).toBeDefined()
    expect(layoutRoute?.children).toHaveLength(2)
  })

  it('應該支援自定義冗餘結構判斷', () => {
    const processor = createRouteProcessor()
    const result = processor.process(mockRoutes, {
      isRedundant: route => route.meta?.isLayout === true
    })
    const processedRoutes = result as ProcessedRoute[]

    expect(processedRoutes.some(r => r.path === '/layout')).toBe(false)
    expect(processedRoutes.some(r => r.path === '/layout/profile')).toBe(true)
  })
})
