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
   * Transform function to convert route to custom menu item type
   */
  transform?: (route: RouteRecordRaw) => T

  /**
   * Sort function for menu items
   */
  sort?: (a: T, b: T) => number
}

export type ConvertRoutesToMenu = <T = BaseMenuItem>(
  routes: RouteRecordRaw[],
  options?: MenuConversionOptions<T>
) => T[]
