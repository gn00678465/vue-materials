import type { RouteRecordRaw } from 'vue-router'
import type { BaseMenuItem, MenuConversionOptions, ConvertRoutesToMenu } from './types'

function joinPaths(parentPath: string, childPath: string): string {
  const normalizedParent = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath
  const normalizedChild = childPath.startsWith('/') ? childPath.slice(1) : childPath
  return `${normalizedParent}/${normalizedChild}`
}

function createDefaultMenuItem(route: RouteRecordRaw, parentPath = ''): BaseMenuItem {
  const path = parentPath ? joinPaths(parentPath, route.path) : route.path
  return {
    path,
    name: route.name as string,
    title: route.meta?.title as string,
    meta: route.meta
  }
}

function processRoutes<T = BaseMenuItem>(
  routes: RouteRecordRaw[],
  options: MenuConversionOptions<T> = {},
  parentPath = ''
): T[] {
  // First, filter routes if needed
  let processedRoutes = routes.filter(route => !options.filter || options.filter(route))

  // Apply sorting before any transformation
  if (options.sort) {
    processedRoutes.sort(options.sort)
  }

  const result: T[] = []

  for (const route of processedRoutes) {
    // Handle flattening
    if (options.shouldFlatten?.(route) && route.children?.length) {
      const flattenedChildren = processRoutes(
        route.children,
        options,
        joinPaths(parentPath, route.path)
      )
      result.push(...flattenedChildren)
      continue
    }

    // Create menu item (transform after sorting)
    const menuItem = options.transform
      ? options.transform(route)
      : createDefaultMenuItem(route, parentPath) as unknown as T

    // Process children if they exist
    if (route.children?.length) {
      // Sort children before transformation
      const sortedChildren = [...route.children]
      if (options.sort) {
        sortedChildren.sort(options.sort)
      }

      const children = processRoutes(
        sortedChildren,
        options,
        route.path
      )
      if (children.length) {
        ;(menuItem as unknown as BaseMenuItem).children = children as unknown as BaseMenuItem[]
      }
    }

    result.push(menuItem)
  }

  return result
}

export const convertRoutesToMenu: ConvertRoutesToMenu = (routes, options = {}) => {
  return processRoutes(routes, options)
}
