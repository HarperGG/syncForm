type Recordable<T = any> = Record<string, T>
type Nullable<T> = T | null
interface Fn<T = any, R = T> {
  (...arg: T[]): R
}

declare global {
  namespace JSX {
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface IntrinsicAttributes {
      [elem: string]: any
    }
  }
}
