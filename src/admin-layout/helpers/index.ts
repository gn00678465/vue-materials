import type { AdminLayoutProps, LayoutCssVars, LayoutCssVarsProps } from '../types'

/** The id of the scroll element of the layout */
export const LAYOUT_SCROLL_EL_ID = '__SCROLL_EL_ID__'

/** The max z-index of the layout */
export const LAYOUT_MAX_Z_INDEX = 100

/**
 * Create layout css vars by css vars props
 *
 * @param props Css vars props
 */
function createLayoutCssVarsByCssVarsProps(props: LayoutCssVarsProps) {
  const cssVars: LayoutCssVars = {
    '--header-height': `${props.headerHeight}px`,
    '--header-z-index': props.headerZIndex,
    '--tab-height': `${props.tabHeight}px`,
    '--tab-z-index': props.tabZIndex,
    '--sidebar-width': `${props.sidebarWidth}px`,
    '--sidebar-collapsed-width': `${props.sidebarCollapsedWidth}px`,
    '--sidebar-z-index': props.sidebarZIndex,
    '--mobile-sidebar-z-index': props.mobileSidebarZIndex,
    '--footer-height': `${props.footerHeight}px`,
    '--footer-z-index': props.footerZIndex,
  }

  return cssVars
}

/**
 * Create layout css vars
 *
 * @param props
 */
export function createLayoutCssVars(props: AdminLayoutProps) {
  const {
    mode,
    isMobile,
    maxZIndex = LAYOUT_MAX_Z_INDEX,
    headerHeight,
    tabHeight,
    sidebarWidth,
    sidebarCollapsedWidth,
    footerHeight,
  } = props

  const headerZIndex = maxZIndex - 3
  const tabZIndex = maxZIndex - 5
  const sidebarZIndex = mode === 'vertical' || isMobile ? maxZIndex - 1 : maxZIndex - 4
  const mobileSidebarZIndex = isMobile ? maxZIndex - 2 : 0
  const footerZIndex = maxZIndex - 5

  const cssProps: LayoutCssVarsProps = {
    headerHeight,
    headerZIndex,
    tabHeight,
    tabZIndex,
    sidebarWidth,
    sidebarZIndex,
    mobileSidebarZIndex,
    sidebarCollapsedWidth,
    footerHeight,
    footerZIndex,
  }

  return createLayoutCssVarsByCssVarsProps(cssProps)
}

export function bindClass(arr: (string | boolean | undefined)[]): string {
  return arr.filter(Boolean).join(' ')
}