import { type MaybeRefOrGetter, computed } from 'vue'
import { useEmitAsProps } from '../useEmitAsProps'
import { useForwardProps } from '../useForwardProps'

/**
 * @see {@link https://github.com/unovue/radix-vue/blob/v2/packages/core/src/shared/useForwardPropsEmits.ts}
 * @param props
 * @param emit
 * @returns
 */
export function useForwardPropsEmits<T extends Record<string, any>, Name extends string>(props: MaybeRefOrGetter<T>, emit?: (name: Name, ...args: any[]) => void) {
  const parsedProps = useForwardProps(props)
  const emitsAsProps = emit ? useEmitAsProps(emit) : {}

  return computed(() => ({
    ...parsedProps.value,
    ...emitsAsProps,
  }))
}
