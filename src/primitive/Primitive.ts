import { type Component, type PropType, defineComponent, h } from "vue";
import { Slot } from "./Slot";

export type AsTag =
  | 'a'
  | 'button'
  | 'div'
  | 'form'
  | 'h2'
  | 'h3'
  | 'img'
  | 'input'
  | 'label'
  | 'li'
  | 'nav'
  | 'ol'
  | 'p'
  | 'span'
  | 'svg'
  | 'ul'
  | 'template'
  | ({} & string)

export interface PrimitiveProps {
  /**
  * The element or component this component should render as.
  * @defaultValue "template"
  */
  as?: AsTag | Component
}

export const Primitive = defineComponent({
  name: 'Primitive',
  inheritAttrs: false,
  props: {
    as: {
      type: [String, Object] as PropType<AsTag | Component>,
      default: 'template'
    }
  },
  setup(props, { attrs, slots }) {
    const SELF_CLOSE_TAG = ['input', 'img', 'area']

    // For self closing tags, don't provide default slots because of hydration issue
    if (typeof props.as === 'string' && SELF_CLOSE_TAG.includes(props.as)) {
      return () => h(props.as, attrs)
    }

    if (props.as !== 'template') {
      return () => h(props.as, attrs, { default: slots.default })
    }

    return () => h(Slot, attrs, { default: slots.default })
  }
})
