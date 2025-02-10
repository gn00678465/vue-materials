<script setup lang="ts">
import type { AdminLayoutProps } from './types'
import { computed, Fragment, h, toRefs, useAttrs } from 'vue'
import { createLayoutCssVars, LAYOUT_MAX_Z_INDEX, LAYOUT_SCROLL_EL_ID } from './helpers'
import { cn } from '../shared/cn'
import css from './styles/index.module.css'

defineOptions({
  name: 'AdminLayout',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AdminLayoutProps>(), {
  mode: 'vertical',
  scrollMode: 'content',
  scrollElId: LAYOUT_SCROLL_EL_ID,
  commonClass: 'transition-all-300',
  fixedTop: true,
  maxZIndex: LAYOUT_MAX_Z_INDEX,
  headerVisible: true,
  headerHeight: 56,
  tabVisible: true,
  tabHeight: 48,
  sidebarVisible: true,
  sidebarWidth: 220,
  sidebarCollapsedWidth: 64,
  footerVisible: true,
  footerHeight: 48,
  rightFooter: false,
})

const slots = defineSlots<Slots>()
const attrs = useAttrs()

const {
  commonClass,
  scrollWrapperClass,
  headerClass,
  tabClass,
  sidebarClass,
  contentClass,
  footerClass,
  fullContent,
  scrollElId,
  fixedFooter,
  mobileSidebarClass,
} = toRefs(props)

const [sidebarCollapse] = defineModel<boolean>('sidebarCollapse', { default: false })

const cssVars = computed(() => createLayoutCssVars(props))

type SlotFn = (props?: Record<string, unknown>) => any

interface Slots {
  /** Main */
  default?: SlotFn
  /** Header */
  header?: SlotFn
  /** Tab */
  tab?: SlotFn
  /** Sidebar */
  sidebar?: SlotFn
  /** Footer */
  footer?: SlotFn
}

// config visible
const showHeader = computed(() => Boolean(slots.header) && props.headerVisible)
const showTab = computed(() => Boolean(slots.tab) && props.tabVisible)
const showSidebar = computed(() => !props.isMobile && Boolean(slots.sidebar) && props.sidebarVisible)
const showMobileSidebar = computed(() => props.isMobile && Boolean(slots.sidebar) && props.sidebarVisible)
const showFooter = computed(() => Boolean(slots.footer) && props.footerVisible)

// scroll mode
const isWrapperScroll = computed(() => props.scrollMode === 'wrapper')
const isContentScroll = computed(() => props.scrollMode === 'content')

// layout direction
const isVertical = computed(() => props.mode === 'vertical')
const isHorizontal = computed(() => props.mode === 'horizontal')

const fixedHeaderAndTab = computed(() => props.fixedTop || (isHorizontal.value && isWrapperScroll.value))

// css
const leftGapClass = computed(() => {
  if (!props.fullContent && showSidebar.value) {
    return sidebarCollapse.value ? css['admin-left-gap_collapsed'] : css['admin-left-gap']
  }

  return ''
})

const headerLeftGapClass = computed(() => (isVertical.value ? leftGapClass.value : ''))

const footerLeftGapClass = computed(() => {
  const condition1 = isVertical.value
  const condition2 = isHorizontal.value && isWrapperScroll.value && !props.fixedFooter
  const condition3 = Boolean(isHorizontal.value && props.rightFooter)

  if (condition1 || condition2 || condition3) {
    return leftGapClass.value
  }

  return ''
})

const sidebarPaddingClass = computed(() => {
  let cls = ''

  if (showHeader.value && !headerLeftGapClass.value) {
    cls += css['admin-sidebar-padding-top']
  }
  if (showFooter.value && !footerLeftGapClass.value) {
    cls += ` ${css['admin-sidebar-padding-bottom']}`
  }

  return cls
})

// layout header
function layoutHeader() {
  return h(Fragment, [
    h('header', {
      class: cn(
        'flex-shrink-0',
        css['admin-layout-header'],
        commonClass.value,
        headerClass.value,
        headerLeftGapClass.value,
        fixedHeaderAndTab.value && 'absolute top-0 left-0 w-full'
      ),
      Style: {
        display: !fullContent.value ? 'initial' : 'none',
      },
    }, slots.header?.()),
    h('div', {
      class: cn('flex-shrink-0 overflow-hidden', css['admin-layout-header-placement']),
      style: { display: !fullContent.value && fixedHeaderAndTab.value ? 'initial' : 'none' },
    }),
  ])
}

// layout tab
function layoutTab() {
  return h(Fragment, [
    h('div', {
      class: cn(
        'flex-shrink-0',
        css['admin-layout-tab'],
        commonClass.value,
        tabClass.value,
        (fullContent.value || !showHeader.value) && 'top-0!',
        leftGapClass.value,
        fixedHeaderAndTab.value && 'absolute left-0 w-full'
      ),
    }, slots.tab?.()),
    h('div', {
      class: cn('flex-shrink-0', 'overflow-hidden', css['admin-layout-tab-placement']),
      style: { display: (fullContent.value || fixedHeaderAndTab.value) ? 'initial' : 'none' },
    }),
  ])
}

// layout sidebar
function layoutSidebar() {
  return h('aside', {
    style: !fullContent.value ? 'initial' : 'none',
    class: cn(
      'absolute left-0 top-0 h-full',
      commonClass.value,
      sidebarClass.value,
      sidebarPaddingClass.value,
      sidebarCollapse.value ? css['admin-layout-sidebar_collapsed'] : css['admin-layout-sidebar']
    ),
  }, slots.sidebar?.())
}

function layoutMobileSidebar() {
  return h(Fragment, [
    h('aside', {
      class: cn(
        'absolute left-0 top-0 h-full w-0 bg-white',
        commonClass.value,
        mobileSidebarClass.value,
        css['admin-layout-mobile-sidebar'],
        sidebarCollapse.value ? 'overflow-hidden' : css['admin-layout-sidebar']
      ),
    }, slots.sidebar?.()),
    h('div', {
      style: { display: !sidebarCollapse.value ? 'initial' : 'none' },
      class: cn('absolute left-0 top-0 h-full w-full bg-[rgba(0,0,0,0.2)]', css['admin-layout-mobile-sidebar-mask']),
    }),
  ])
}

// layout content
function layoutContent() {
  return h('main', {
    class: cn(
      'flex flex-col flex-grow',
      commonClass.value,
      contentClass.value,
      leftGapClass.value,
      isContentScroll.value && 'overflow-y-auto'
    ),
    id: isContentScroll.value ? scrollElId.value : undefined,
  }, slots.default?.())
}

// layout footer
function layoutFooter() {
  return h(Fragment, [
    h('footer', {
      class: cn(
        'flex-shrink-0',
        css['admin-layout-footer'],
        commonClass.value,
        footerClass.value,
        footerLeftGapClass.value,
        fixedFooter.value && 'absolute left-0 bottom-0 w-full'
      ),
      style: {
        display: !fullContent.value ? 'initial' : 'none',
      },
    }, slots.footer?.()),
    h('div', {
      class: cn('flex-shrink-0 overflow-hidden', css['admin-layout-footer-placement']),
      style: { display: !fullContent.value && fixedFooter.value ? 'initial' : 'none' },
      onClick: handleClickMask,
    }),
  ])
}

function handleClickMask() {
  sidebarCollapse.value = true
}
</script>

<template>
  <div class="relative h-full" :class="[commonClass]" :style="cssVars" v-bind="attrs">
    <div :id="isWrapperScroll ? scrollElId : undefined" class="h-full flex flex-col" :class="[commonClass, scrollWrapperClass, { 'overflow-y-auto': isWrapperScroll }]">
      <!-- header -->
      <template v-if="showHeader">
        <component :is="layoutHeader" />
      </template>
      <!-- tab -->
      <template v-if="showTab">
        <component :is="layoutTab" />
      </template>

      <!-- sidebar -->
      <template v-if="showSidebar">
        <component :is="layoutSidebar" />
      </template>

      <!-- mobile sidebar -->
      <template v-if="showMobileSidebar">
        <component :is="layoutMobileSidebar" />
      </template>

      <!-- Main Content -->
      <component :is="layoutContent" />

      <!-- footer -->
      <template v-if="showFooter">
        <component :is="layoutFooter" />
      </template>
    </div>
  </div>
</template>

<style src="./styles/utility.css"></style>
