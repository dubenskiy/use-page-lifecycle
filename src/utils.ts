import { LEGAL_STATE_TRANSITIONS } from './consts'
import { LifecycleState } from './enums'

/**
 * Возвращает текущее состояние
 */
export const getCurrentState = () => {
  if (!isBrowser) {
    return LifecycleState.UNKNOWN
  }

  if (document.visibilityState === LifecycleState.HIDDEN) {
    return LifecycleState.HIDDEN
  }

  if (document.hasFocus()) {
    return LifecycleState.ACTIVE
  }

  return LifecycleState.PASSIVE
}

/**
 * Преобразует массив состояний в объект, где состояние является ключом, а значение является индексом.
 */
export const toIndexedObject = (arr: Array<LifecycleState>) =>
  arr.reduce<Record<string, number>>((acc, val, idx) => {
    acc[val] = idx

    return acc
  }, {})

/**
 * Принимает текущее состояние и будущее состояние и возвращает массив допустимых путей перехода состояния.
 * Это необходимо для нормализации поведения в разных браузерах,
 * поскольку некоторые браузеры в определенных случаях не запускают события и, таким образом, пропускают состояния.
 */
export const getLegalStateTransitionPath = (oldState: LifecycleState, newState: LifecycleState) => {
  const stateTransitions = LEGAL_STATE_TRANSITIONS.map(toIndexedObject)

  for (const order of stateTransitions) {
    const oldIndex = order[oldState]
    const newIndex = order[newState]

    if (oldIndex !== undefined && newIndex !== undefined && newIndex > oldIndex) {
      return Object.keys(order).slice(oldIndex, newIndex + 1)
    }
  }

  // в целом сюда попасть мы никогда не должны.
  return []
}

/**
 * Проверка среды.
 */
export const isBrowser = typeof window !== 'undefined'
