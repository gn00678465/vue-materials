import { type MaybeRefOrGetter, camelize, computed, getCurrentInstance, toRef } from 'vue'

interface PropOptions {
  type?: any
  required?: boolean
  default?: any
}

/**
 * @see {@link https://github.com/unovue/radix-vue/blob/v2/packages/core/src/shared/useForwardProps.ts}
 * @param props
 */
export function useForwardProps<T extends Record<string, any>>(props: MaybeRefOrGetter<T>) {
  const vm = getCurrentInstance()
  // Default value for declared props
  const defaultProps = Object.keys(vm?.type.props ?? {}).reduce((prev, curr) => {
    const defaultValue = (vm?.type.props[curr] as PropOptions).default
    if (defaultValue !== undefined)
      prev[curr as keyof T] = defaultValue
    return prev
  }, {} as T)

  const refProps = toRef(props)
  return computed(() => {
    const preservedProps = {} as T
    const assignedProps = vm?.vnode.props ?? {}

    Object.keys(assignedProps).forEach((key) => {
      preservedProps[camelize(key) as keyof T] = assignedProps[key]
    })

    // Only return value from the props parameter
    return Object.keys({ ...defaultProps, ...preservedProps }).reduce((prev, curr) => {
      if (refProps.value[curr] !== undefined)
        prev[curr as keyof T] = refProps.value[curr]
      return prev
    }, {} as T)
  })
}
