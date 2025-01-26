import { camelize, getCurrentInstance, toHandlerKey } from 'vue'

/**
 * @see {@link https://github.com/unovue/radix-vue/blob/v2/packages/core/src/shared/useEmitAsProps.ts}
 * @param emit
 * @returns
 */
export function useEmitAsProps<Name extends string>(
  emit: (name: Name, ...args: any[]) => void,
) {
  const vm = getCurrentInstance()

  const events = vm?.type.emits as Name[]
  const result: Record<string, any> = {}

  if (!events?.length) {
    console.warn(
      `No emitted event found. Please check component: ${vm?.type.__name}`,
    )
  }

  events?.forEach((ev) => {
    result[toHandlerKey(camelize(ev))] = (...arg: any) => emit(ev, ...arg)
  })
  return result
}
