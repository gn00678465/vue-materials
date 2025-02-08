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
  const result: T[] = []

  for (const route of routes) {
    // Apply filter if provided
    if (options.filter && !options.filter(route)) {
      continue
    }

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

    // Create menu item
    const menuItem = options.transform
      ? options.transform(route)
      : createDefaultMenuItem(route, parentPath) as unknown as T

    // Process children if they exist
    if (route.children?.length) {
      const children = processRoutes(
        route.children,
        options,
        route.path
      )
      if (children.length) {
        ;(menuItem as unknown as BaseMenuItem).children = children as unknown as BaseMenuItem[]
      }
    }

    result.push(menuItem)
  }

  // Apply sorting if provided
  if (options.sort) {
    result.sort(options.sort)
  }

  return result
}

export const convertRoutesToMenu: ConvertRoutesToMenu = (routes, options = {}) => {
  return processRoutes(routes, options)
}
