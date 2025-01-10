# AdminLayout

後台管理的布局 component

- 主要由 header, tab, sidebar, content, footer 等組成

### props

| Prop                  | Type                      | 預設值               | 說明                                       |
| :-------------------- | ------------------------- | -------------------- | ------------------------------------------ |
| mode                  | [LayoutMode](#LayoutMode) | "vertical"           | layout 模式                                |
| scrollMode            | [ScrollMode](#ScrollMode) | "content"            | 滾動模式                                   |
| fixedTop              | boolean                   | "vertical"           | 將 header & tab 固定於螢幕最上方           |
| isMobile              | boolean                   | false                | 是否為可攜式裝置                           |
| commonClass           | string                    | "transition-all-300" | 共用的 class, 作用於外層容器與所有組件     |
| scrollWrapperClass    | string                    | -                    | wrapper 的自定義 class                     |
| headerHeight          | number                    | 50                   | header 的高度                              |
| headerVisible         | number                    | 50                   | 是否顯示 header                            |
| headerClass           | string                    | -                    | header 的自定義 class                      |
| tabHeight             | number                    | 48                   | tab 的高度                                 |
| tabVisible            | number                    | 50                   | 是否顯示 tab                               |
| tabClass              | string                    | -                    | tab 的自定義 class                         |
| sidebarCollapse       | boolean                   | false                | 展開 / 縮小 sidebar 的狀態                 |
| sidebarWidth          | number                    | 240                  | sidebar 展開的寬度                         |
| sidebarCollapsedWidth | number                    | 64                   | sidebar 縮小的寬度                         |
| sidebarVisible        | number                    | 50                   | 是否顯示 sidebar 與 可攜式裝置 sidebar     |
| sidebarClass          | string                    | -                    | sidebar 的自定義 class                     |
| mobileSidebarCollapse | boolean                   | false                | 可攜式裝置 sidebar 顯示 / 隱藏的狀態       |
| mobileSidebarClass    | string                    | -                    | 可攜式裝置 sidebar 的自定義 class          |
| fullContent           | boolean                   | -                    | content 是否設定為全螢幕，且其他元素會隱藏 |
| contentClass          | string                    | -                    | content 的自定義 class                     |
| footerHeight          | number                    | 48                   | footer 的高度                              |
| footerVisible         | number                    | 50                   | 是否顯示 footer                            |
| fixedFooter           | boolean                   | -                    | 將 footer 固定於螢幕最下方                 |
| rightFooter           | boolean                   | false                |                                            |
| footerClass           | string                    | -                    | footer 的自定義 class                      |
| maxZIndex             | number                    | 100                  | Layout z-index 的最大值                    |


### Emits

| slot                      | vault | 說明                                   |
| :------------------------ | :---: | -------------------------------------- |
| click-mobile-sidebar-mask |   -   | 只能在可攜式裝置模式下點選 mask 時使用 |

### Slots

| slot   |                      props                      |
| :----- | :---------------------------------------------: |
| header |                        -                        |
| tab    |                        -                        |
| side   | [SidebarScopeSlotProps](#SidebarScopeSlotProps) |
| footer |                        -                        |

## Type Declarations

### LayoutMode

```ts
/**
 * layout 模式
 * - horizontal 水平
 * - vertical 垂直
 */
type LayoutMode = "horizontal" | "vertical";
```

### ScrollMode

```ts
/**
 * - wrapper 最外層組件出現滾動條
 * - content content 組件出現滾動條
 * @default 預設 content
 */
type ScrollMode = "wrapper" | "content";
```

### SidebarScopeSlotProps

```ts
/**
 * - sidebar 的 scope slot 的參數
 * - mobileSidebarCollapse 只會在可攜式裝置下傳出
 */
type SidebarScopeSlotProps = {
  sidebarCollapse: boolean;
  sidebarWidth: number;
  sidebarCollapsedWidth: number;
  mobileSidebarCollapse?: boolean;
};
```

