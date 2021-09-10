import { ComputedRef, Ref } from "vue"

export declare type Recordable<T = any> = Record<string, T>
export declare type Nullable<T> = T | null
export type DynamicProps<T> = {
  [P in keyof T]: Ref<T[P]> | T[P] | ComputedRef<T[P]>
}
