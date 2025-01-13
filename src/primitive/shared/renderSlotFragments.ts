import { Fragment, type VNode } from 'vue'

export const renderSlotFragments = (children?: VNode[]): VNode[] => {
  if (!children) return []
  return children.flatMap((child) => {
    if (child.type === Fragment) return renderSlotFragments(child.children as VNode[])
    return [child]
  })
}
