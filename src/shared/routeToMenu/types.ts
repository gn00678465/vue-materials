import type { RouteRecordRaw } from 'vue-router'

export interface BaseMenuItem {
  path: string
  name: string
  title: string
  children?: BaseMenuItem[]
  meta?: {
    [key: string]: unknown
  }
  [key: string]: unknown
}

export interface MenuConversionOptions<T = BaseMenuItem> {
  /**
   * Filter function to exclude routes from menu
   */
  filter?: (route: RouteRecordRaw) => boolean

  /**
   * Function to determine if a route should be flattened
   */
  shouldFlatten?: (route: RouteRecordRaw) => boolean

  /**
   * Sort function for routes before transformation
   * This runs before transform to ensure sorting is based on original route data
   */
  sort?: (a: RouteRecordRaw, b: RouteRecordRaw) => number

  /**
   * Transform function to convert route to custom menu item type
   * This runs after sorting to ensure proper order is maintained
   */
  transform?: (route: RouteRecordRaw) => T
}

export type ConvertRoutesToMenu = <T = BaseMenuItem>(
  routes: RouteRecordRaw[],
  options?: MenuConversionOptions<T>
) => T[]
