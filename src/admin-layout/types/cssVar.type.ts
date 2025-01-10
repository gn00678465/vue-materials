import type { AdminLayoutProps } from './props.type'

type Kebab<S extends string> = S extends Uncapitalize<S> ? S : `-${Uncapitalize<S>}`

type KebabCase<S extends string> = S extends `${infer Start}${infer End}`
  ? `${Uncapitalize<Start>}${KebabCase<Kebab<End>>}`
  : S

export type LayoutCssVarsProps = Pick<AdminLayoutProps, 'headerHeight' | 'tabHeight' | 'sidebarWidth' | 'sidebarCollapsedWidth' | 'footerHeight'> & {
  headerZIndex?: number
  tabZIndex?: number
  sidebarZIndex?: number
  mobileSidebarZIndex?: number
  footerZIndex?: number
}

export type LayoutCssVars = {
  [K in keyof LayoutCssVarsProps as `--${KebabCase<K>}`]: string | number;
}
