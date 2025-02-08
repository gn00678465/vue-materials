import { describe, it, expect } from 'vitest'
import type { RouteRecordRaw } from 'vue-router'
import { convertRoutesToMenu } from '.'
import type { BaseMenuItem } from './types'

const DummyComponent = { template: '<div>Dummy</div>' }

describe('convertRoutesToMenu', () => {
  it('should convert basic routes to menu items', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: DummyComponent,
        meta: { title: 'Dashboard' }
      },
      {
        path: '/users',
        name: 'Users',
        component: DummyComponent,
        meta: { title: 'Users' }
      }
    ]

    const result = convertRoutesToMenu(routes)
    expect(result).toEqual([
      {
        path: '/dashboard',
        name: 'Dashboard',
        title: 'Dashboard',
        meta: { title: 'Dashboard' }
      },
      {
        path: '/users',
        name: 'Users',
        title: 'Users',
        meta: { title: 'Users' }
      }
    ])
  })

  it('should handle nested routes', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/settings',
        name: 'Settings',
        component: DummyComponent,
        meta: { title: 'Settings' },
        children: [
          {
            path: 'profile',
            name: 'Profile',
            component: DummyComponent,
            meta: { title: 'Profile Settings' }
          },
          {
            path: 'security',
            name: 'Security',
            component: DummyComponent,
            meta: { title: 'Security Settings' }
          }
        ]
      }
    ]

    const result = convertRoutesToMenu(routes)
    expect(result).toEqual([
      {
        path: '/settings',
        name: 'Settings',
        title: 'Settings',
        meta: { title: 'Settings' },
        children: [
          {
            path: '/settings/profile',
            name: 'Profile',
            title: 'Profile Settings',
            meta: { title: 'Profile Settings' }
          },
          {
            path: '/settings/security',
            name: 'Security',
            title: 'Security Settings',
            meta: { title: 'Security Settings' }
          }
        ]
      }
    ])
  })

  it('should apply filter condition', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/public',
        name: 'Public',
        component: DummyComponent,
        meta: { title: 'Public', hidden: false }
      },
      {
        path: '/private',
        name: 'Private',
        component: DummyComponent,
        meta: { title: 'Private', hidden: true }
      }
    ]

    const result = convertRoutesToMenu(routes, {
      filter: (route: RouteRecordRaw) => !route.meta?.hidden
    })

    expect(result).toEqual([
      {
        path: '/public',
        name: 'Public',
        title: 'Public',
        meta: { title: 'Public', hidden: false }
      }
    ])
  })

  it('should flatten redundant structures', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/parent',
        name: 'Parent',
        component: DummyComponent,
        meta: { title: 'Parent', isWrapper: true },
        children: [
          {
            path: 'child',
            name: 'Child',
            component: DummyComponent,
            meta: { title: 'Child' }
          }
        ]
      }
    ]

    const result = convertRoutesToMenu(routes, {
      shouldFlatten: (route: RouteRecordRaw) => route.meta?.isWrapper === true
    })

    expect(result).toEqual([
      {
        path: '/parent/child',
        name: 'Child',
        title: 'Child',
        meta: { title: 'Child' }
      }
    ])
  })

  it('should apply custom transformation', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/custom',
        name: 'Custom',
        component: DummyComponent,
        meta: { title: 'Custom', icon: 'settings' }
      }
    ]

    interface CustomMenu {
      key: string
      label: string
      icon?: string
    }

    const result = convertRoutesToMenu<CustomMenu>(routes, {
      transform: (route: RouteRecordRaw): CustomMenu => ({
        key: route.path,
        label: route.meta?.title as string,
        icon: route.meta?.icon as string
      })
    })

    expect(result).toEqual([
      {
        key: '/custom',
        label: 'Custom',
        icon: 'settings'
      }
    ])
  })

  it('should sort menu items', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: '/b',
        name: 'B',
        component: DummyComponent,
        meta: { title: 'B', order: 2 }
      },
      {
        path: '/a',
        name: 'A',
        component: DummyComponent,
        meta: { title: 'A', order: 1 }
      }
    ]

    const result = convertRoutesToMenu(routes, {
      sort: (a: BaseMenuItem, b: BaseMenuItem) => {
        const orderA = (a.meta?.order as number) ?? 0
        const orderB = (b.meta?.order as number) ?? 0
        return orderA - orderB
      }
    })

    expect(result).toEqual([
      {
        path: '/a',
        name: 'A',
        title: 'A',
        meta: { title: 'A', order: 1 }
      },
      {
        path: '/b',
        name: 'B',
        title: 'B',
        meta: { title: 'B', order: 2 }
      }
    ])
  })
})
