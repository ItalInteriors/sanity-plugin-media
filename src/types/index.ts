import {
  AlignItemsProps,
  AlignSelfProps,
  BorderProps,
  ColorProps,
  FlexDirectionProps,
  FlexProps,
  FlexGrowProps,
  FlexShrinkProps,
  FlexWrapProps,
  GridProps,
  JustifyContentProps,
  LayoutProps,
  OverflowProps,
  PositionProps,
  SpaceProps,
  TypographyProps
} from 'styled-system'

export type Asset = {
  _id: string
  _updatedAt: string
  extension: string
  metadata: {
    isOpaque: boolean
    dimensions: {
      aspectRatio: number
      height: number
      width: number
    }
  }
  originalFilename: string
  size: number
  url: string
}

export type BoxProps = AlignItemsProps &
  AlignSelfProps &
  BorderProps &
  ColorProps &
  FlexDirectionProps &
  FlexGrowProps &
  FlexProps &
  FlexShrinkProps &
  FlexWrapProps &
  GridProps &
  JustifyContentProps &
  LayoutProps &
  OverflowProps &
  PositionProps &
  SpaceProps &
  TypographyProps & {
    boxSizing?: string
    cursor?: string
    onClick?: Function
    order?: any
    pointerEvents?: string
    textOverflow?: string
    transform?: string
    userSelect?: string
    whiteSpace?: string
    // TODO: document
    zIndex?: any
  }

export type BrowserOptions = {
  filter: Filter
  order: {
    title: string
    value: string
  }
  pageIndex: number
  replaceOnFetch: boolean
  view: {
    icon: Function
    title: string
    value: string
  }
}

export type DeleteHandleTarget = 'dialog' | 'snackbar'

export type FetchOptions = {
  filter?: string
  params?: Record<string, string>
  projections?: string
  replace?: boolean
  selector?: string
  sort?: string
}

export type Filter = {
  title: string
  value: string
}

export type Item = {
  asset: Asset
  errorCode?: number
  picked: boolean
  updating: boolean
}

export type SelectedAsset = {
  assetDocumentProps?: {originalFilename?: string; source?: string; sourceId?: string}
  kind: 'assetDocumentId' | 'base64' | 'file' | 'url'
  value: string | File
}
