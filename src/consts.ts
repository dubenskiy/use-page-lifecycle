import { LifecycleState } from './enums'

/** Список событий **/
export const LIFECYCLE_EVENTS = ['focus', 'blur', 'visibilitychange', 'freeze', 'resume', 'pageshow', 'pagehide']

/**
 * Человекочитаемый переход состояний. Каждый элемент массива это один из возможных кейсов жизненного цикла страницы.
 * Преобразуется в массив объектов, гед состояние является ключом,
 * а значение является индексом вложенного массива для использования в {@link getLegalStateTransitionPath}
 * см. https://developers.google.com/web/updates/2018/07/page-lifecycle-api
 */
export const LEGAL_STATE_TRANSITIONS = [
  // Обычный процесс выгрузки
  [LifecycleState.ACTIVE, LifecycleState.PASSIVE, LifecycleState.HIDDEN, LifecycleState.TERMINATED],

  // Активная страница переходит в замороженную или выгружающаяся страница попадает в bfcache.
  [LifecycleState.ACTIVE, LifecycleState.PASSIVE, LifecycleState.HIDDEN, LifecycleState.FROZEN],

  // Скрытая страница снова становится активной.
  [LifecycleState.HIDDEN, LifecycleState.PASSIVE, LifecycleState.ACTIVE],

  // Замороженная страница возобновляется
  [LifecycleState.FROZEN, LifecycleState.HIDDEN],

  // Замороженная (bfcached) страница, на которую был выполнен возврат.
  [LifecycleState.FROZEN, LifecycleState.ACTIVE],
  [LifecycleState.FROZEN, LifecycleState.PASSIVE],
]
