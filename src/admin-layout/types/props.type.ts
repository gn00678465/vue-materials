/** Header config */
interface AdminLayoutHeaderConfig {
  /**
   * Whether header is visible
   *
   * @default true
   */
  headerVisible?: boolean
  /**
   * Header class
   *
   * @default ''
   */
  headerClass?: string
  /**
   * Header height
   *
   * @default 56px
   */
  headerHeight?: number
}

/** Tab config */
interface AdminLayoutTabConfig {
  /**
   * Whether tab is visible
   *
   * @default true
   */
  tabVisible?: boolean
  /**
   * Tab class
   *
   * @default ''
   */
  tabClass?: string
  /**
   * Tab height
   *
   * @default 48px
   */
  tabHeight?: number
}

/** Sidebar config */
interface AdminLayoutSidebarConfig {
  /**
   * Whether sidebar is visible
   *
   * @default true
   */
  sidebarVisible?: boolean
  /**
   * Sidebar class
   *
   * @default ''
   */
  sidebarClass?: string
  /**
   * Mobile sidebar class
   *
   * @default ''
   */
  mobileSidebarClass?: string
  /**
   * Sidebar collapse status
   *
   * @default false
   */
  sidebarCollapse?: boolean
  /**
   * Sidebar width when collapse is false
   *
   * @default '220px'
   */
  sidebarWidth?: number
  /**
   * Sidebar width when collapse is true
   *
   * @default '64px'
   */
  sidebarCollapsedWidth?: number
}

/** Content config */
export interface AdminLayoutContentConfig {
  /**
   * Content class
   *
   * @default ''
   */
  contentClass?: string
  /**
   * Whether content is full the page
   *
   * If true, other elements will be hidden by `display: none`
   */
  fullContent?: boolean
}

/** Footer config */
export interface AdminLayoutFooterConfig {
  /**
   * Whether footer is visible
   *
   * @default true
   */
  footerVisible?: boolean
  /**
   * Whether footer is fixed
   *
   * @default true
   */
  fixedFooter?: boolean
  /**
   * Footer class
   *
   * @default ''
   */
  footerClass?: string
  /**
   * Footer height
   *
   * @default 48px
   */
  footerHeight?: number
  /**
   * Whether footer is on the right side
   *
   * When the layout is vertical, the footer is on the right side
   */
  rightFooter?: boolean
}

/**
 * Layout mode
 *
 * - Horizontal
 * - Vertical
 */
export type LayoutMode = 'horizontal' | 'vertical'

/**
 * The scroll mode when content overflow
 *
 * - Wrapper: the layout component's wrapper element has a scrollbar
 * - Content: the layout component's content element has a scrollbar
 *
 * @default 'wrapper'
 */
export type LayoutScrollMode = 'wrapper' | 'content'

/** Admin layout props */
export interface AdminLayoutProps
  extends AdminLayoutHeaderConfig,
  AdminLayoutTabConfig,
  AdminLayoutSidebarConfig,
  AdminLayoutContentConfig,
  AdminLayoutFooterConfig {
  /**
   * Layout mode
   *
   * - {@link LayoutMode}
   */
  mode?: LayoutMode
  /** Is mobile layout */
  isMobile?: boolean
  /**
   * Scroll mode
   *
   * - {@link ScrollMode}
   */
  scrollMode?: LayoutScrollMode
  /**
   * The id of the scroll element of the layout
   *
   * It can be used to get the corresponding Dom and scroll it
   *
   * @example
   *   use the default id by import
   *   ```ts
   *   import { adminLayoutScrollElId } from '@sa/vue-materials';
   *   ```
   *
   * @default
   * ```ts
   * const adminLayoutScrollElId = '__ADMIN_LAYOUT_SCROLL_EL_ID__'
   * ```
   */
  scrollElId?: string
  /** The class of the scroll element */
  scrollElClass?: string
  /** The class of the scroll wrapper element */
  scrollWrapperClass?: string
  /**
   * The common class of the layout
   *
   * Is can be used to configure the transition animation
   *
   * @default 'transition-all-300'
   */
  commonClass?: string
  /**
   * Whether fix the header and tab
   *
   * @default true
   */
  fixedTop?: boolean
  /**
   * The max z-index of the layout
   *
   * The z-index of Header,Tab,Sider and Footer will not exceed this value
   */
  maxZIndex?: number
}
