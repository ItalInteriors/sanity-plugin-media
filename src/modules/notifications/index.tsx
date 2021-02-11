import {ReactNode} from 'react'
import pluralize from 'pluralize'
import produce from 'immer'
import {Observable, of} from 'rxjs'
import {bufferTime, filter, mergeMap} from 'rxjs/operators'
import {AssetsActionTypes} from '../assets'
import {NotificationsReducerState, NotificationsActions, NotificationsAddAction} from './types'
import {isOfType} from 'typesafe-actions'
import {AssetsActions} from '../assets/types'
import {TagsActionTypes} from '../tags'
import {TagsActions} from '../tags/types'

/***********
 * ACTIONS *
 ***********/

export enum NotificationsActionTypes {
  ADD = 'NOTIFICATIONS_ADD'
}

/***********
 * REDUCER *
 ***********/

const INITIAL_STATE = {
  items: []
}

export default function notificationsReducer(
  state: NotificationsReducerState = INITIAL_STATE,
  action: NotificationsActions
): NotificationsReducerState {
  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (action.type) {
      case NotificationsActionTypes.ADD: {
        const asset = action.payload?.asset
        const status = action.payload?.status
        const subtitle = action.payload?.subtitle
        const timeout = action.payload?.timeout
        const title = action.payload?.title

        draft.items.push({
          asset,
          status,
          subtitle,
          timeout,
          title
        })
        break
      }
    }
  })
}

/*******************
 * ACTION CREATORS *
 *******************/

// Add error notification
export const notificationsAddError = ({
  subtitle,
  title
}: {
  subtitle?: string
  title: ReactNode
}): NotificationsAddAction => ({
  payload: {
    subtitle,
    status: 'error',
    timeout: 8000,
    title
  },
  type: NotificationsActionTypes.ADD
})

// Add success notification
export const notificationsAddSuccess = ({
  subtitle,
  title
}: {
  subtitle?: string
  title: ReactNode
}): NotificationsAddAction => ({
  payload: {
    subtitle,
    status: 'success',
    timeout: 4000,
    title
  },
  type: NotificationsActionTypes.ADD
})

/*********
 * EPICS *
 *********/

/**
 * Listen for asset delete completions:
 * - Display success notification
 * - Buffer responses over 1000ms
 */
export const notificationsAssetsDeleteCompleteEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.DELETE_COMPLETE)),
    bufferTime(1000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const deletedCount = actions.length
      return of(
        notificationsAddSuccess({
          title: `${deletedCount} ${pluralize('asset', deletedCount)} deleted`
        })
      )
    })
  )

/**
 * Listen for asset delete errors:
 * - Display error notification
 * - Buffer responses over 1000ms
 */
export const notificationsAssetsDeleteErrorEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.DELETE_ERROR)),
    bufferTime(1000),
    filter(actions => actions.length > 0),
    mergeMap(actions => {
      const count = actions.length
      return of(
        // TODO: add error message if count === 1
        notificationsAddError({
          title: `Unable to delete ${count} ${pluralize('asset', count)}`
        })
      )
    })
  )

// Tags added to assets
export const notificationsAssetsTagsAddCompleteEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.TAGS_ADD_COMPLETE)),
    mergeMap(action => {
      const count = action?.payload?.assets?.length
      return of(
        notificationsAddSuccess({
          title: `Tag added to ${count} ${pluralize('asset', count)}`
        })
      )
    })
  )

// Tags removed from assets
export const notificationsAssetsTagsRemoveCompleteEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.TAGS_REMOVE_COMPLETE)),
    mergeMap(action => {
      const count = action?.payload?.assets?.length
      return of(
        notificationsAddSuccess({
          title: `Tag removed from ${count} ${pluralize('asset', count)}`
        })
      )
    })
  )

/**
 * Listen for successful asset updates:
 * - Display success notification
 */
export const notificationsAssetsUpdateCompleteEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(AssetsActionTypes.UPDATE_COMPLETE)),
    mergeMap(() =>
      of(
        notificationsAddSuccess({
          title: `Asset updated`
        })
      )
    )
  )

/**
 * Listen for asset update errors:
 * - Display error notification
 */
export const notificationsGenericErrorEpic = (
  action$: Observable<AssetsActions | TagsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(
      isOfType([
        AssetsActionTypes.FETCH_ERROR, //
        AssetsActionTypes.UPDATE_ERROR,
        TagsActionTypes.CREATE_ERROR,
        TagsActionTypes.FETCH_ERROR,
        TagsActionTypes.UPDATE_ERROR
      ])
    ),
    mergeMap(action => {
      const error = action.payload?.error
      return of(notificationsAddError({title: `An error occured: ${error.message}`}))
    })
  )

/**
 * Listen for tag delete completions:
 * - Display success notification
 */
export const notificationsTagCreateCompleteEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.CREATE_COMPLETE)),
    mergeMap(() => of(notificationsAddSuccess({title: `Tag created`})))
  )

/**
 * Listen for tag delete completions:
 * - Display success notification
 */
export const notificationsTagDeleteCompleteEpic = (
  action$: Observable<AssetsActions>
): Observable<NotificationsActions> =>
  action$.pipe(
    filter(isOfType(TagsActionTypes.DELETE_COMPLETE)),
    mergeMap(() => of(notificationsAddSuccess({title: `Tag deleted`})))
  )
