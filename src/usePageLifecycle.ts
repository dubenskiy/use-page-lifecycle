import { useCallback, useEffect, useRef, useState } from 'react'

import { LIFECYCLE_EVENTS } from './consts'
import { LifecycleState } from './enums'
import { getCurrentState, getLegalStateTransitionPath } from './utils'

interface DocumentWithWasDiscarded extends Document {
  wasDiscarded?: boolean
}

/** Тип функции проверки признака была ли страница удалена из скрытой вкладки **/
export type PageWasDiscarded = () => boolean

/**
 * Хук возвращает текущее состояние жизненного цикла страницы и признак была ли страница удалена из скрытой вкладки.
 */
export const usePageLifecycle = (): [LifecycleState, PageWasDiscarded] => {
  const [state, setState] = useState<LifecycleState>(getCurrentState())
  const stateRef = useRef<LifecycleState>(state)

  const changeState = useCallback((nextState: LifecycleState) => {
    const prevState = stateRef.current

    if (nextState !== prevState) {
      const path = getLegalStateTransitionPath(prevState, nextState)

      for (let i = 0; i < path.length - 1; i++) {
        // если нужно корректное предыдущее состояние, то:
        // const oldState = path[i] as LifecycleState
        const currentState = path[i + 1] as LifecycleState

        setState(currentState)
      }
    }
  }, [])

  const lifecycleEventHandler = useCallback(
    (event: Event) => {
      switch (event.type) {
        case 'pageshow':
        case 'resume': {
          changeState(getCurrentState())

          break
        }

        case 'focus': {
          changeState(LifecycleState.ACTIVE)

          break
        }

        case 'blur': {
          // Событие `blur` может срабатывать во время выгрузки страницы,
          // поэтому нам нужно обновить состояние только в том случае, если текущее состояние «активно».
          if (stateRef.current === LifecycleState.ACTIVE) {
            changeState(getCurrentState())
          }

          break
        }

        case 'pagehide':
        case 'unload': {
          if ((event as PageTransitionEvent).persisted) {
            changeState(LifecycleState.FROZEN)
          } else {
            changeState(LifecycleState.TERMINATED)
          }

          break
        }

        case 'visibilitychange': {
          // `visibilityState` у document изменится на "hidden" по мере выгрузки страницы,
          // но в случаях FROZEN и TERMINATED состояние жизненного цикла не должно меняться.
          if (stateRef.current !== LifecycleState.FROZEN && stateRef.current !== LifecycleState.TERMINATED) {
            changeState(getCurrentState())
          }

          break
        }

        case 'freeze': {
          changeState(LifecycleState.FROZEN)

          break
        }
      }
    },
    [changeState],
  )

  useEffect(() => {
    stateRef.current = state
  }, [state])

  useEffect(() => {
    LIFECYCLE_EVENTS.forEach((type) => {
      window.addEventListener(type, lifecycleEventHandler, { capture: true })
    })

    return () =>
      LIFECYCLE_EVENTS.forEach((type) => {
        window.removeEventListener(type, lifecycleEventHandler, { capture: true })
      })
  }, [lifecycleEventHandler])

  const pageWasDiscarded = useCallback<PageWasDiscarded>(
    () => (document as DocumentWithWasDiscarded).wasDiscarded || false,
    [],
  )

  return [state, pageWasDiscarded]
}
