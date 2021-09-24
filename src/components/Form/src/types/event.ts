export interface Events {
  fieldChange: Map<string, EventCallBack[]>
}

export type EventCallBack = (
  {
    value,
    model
  }: {
    value: any
    model: any
  },
  ...args
) => void

export type EventTypes = keyof Events
