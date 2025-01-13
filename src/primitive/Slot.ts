import { Comment, cloneVNode, defineComponent, mergeProps } from "vue";
import { renderSlotFragments } from "./shared";

export const Slot = defineComponent({
  name: 'PrimitiveSlot',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => {
      if (!slots.default) return null

      const children = renderSlotFragments(slots.default())

      const firstNonCommentChildrenIdx = children.findIndex((child) => child.type !== Comment)
      if (firstNonCommentChildrenIdx === -1) return children
      const firstNonCommentChild = children[firstNonCommentChildrenIdx]

      // Remove pros ref from being inferred
      delete firstNonCommentChild.props?.ref

      const mergedProps = firstNonCommentChild.props
        ? mergeProps(attrs, firstNonCommentChild.props)
        : attrs

      // Remove class to prevent duplicated
      if (attrs.class && firstNonCommentChild.props?.class) {
        delete firstNonCommentChild.props?.class
      }
      const cloned = cloneVNode(firstNonCommentChild, mergedProps)

      /**
       * Explicitly override props starting with `on`.
       * It seems cloneVNode from Vue doesn't like overriding `onXXX` props.
       * So we have to do it manually.
       */
      for (const prop in mergedProps) {
        if (prop.startsWith('on')) {
          cloned.props ||= {}
          cloned.props[prop] = mergedProps[prop]
        }
      }

      if (children.length === 1) return cloned

      children[firstNonCommentChildrenIdx] = cloned
      return children
    }
  }
})
