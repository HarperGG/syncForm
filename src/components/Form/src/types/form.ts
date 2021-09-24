import { NamePath, RuleObject } from "ant-design-vue/lib/form/interface"
import { VNode } from "vue"
import { FormRules } from "naive-ui"
import { FormItem } from "./formItem"
import { ColEx, ComponentType } from "./index"
import { CSSProperties } from "vue"
import {
  FormItemProps,
  FormItemColProps,
  FormItemGiProps,
  FormItemRowProps,
  FormItemGridItemProps,
  GridProps
} from "naive-ui"
import { EventCallBack } from "./event"

export type FieldMapToTime = [string, [string, string], string?][]

export type Rule = RuleObject & {
  trigger?: "blur" | "change" | ["change", "blur"]
}

export interface RenderCallbackParams {
  schema: FormSchema
  values: Recordable
  model: Recordable
  field: string
}

export interface ButtonProps {
  color?: string | undefined
  loading?: boolean | undefined
  disabled?: boolean | undefined
  preIcon?: string | undefined
  postIcon?: string | undefined
  iconSize?: number | undefined
  onClick?: ((...args: any[]) => any) | undefined
  text?: string
}

export interface FormActionType {
  onFieldChange: (field: string, cb: EventCallBack) => void
  submit: () => Promise<void>
  setFieldsValue: <T>(values: T) => Promise<void>
  resetFields: () => Promise<void>
  getFieldsValue: () => Recordable
  clearValidate: (name?: string | string[]) => Promise<void>
  updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>
  resetSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => Promise<void>
  setProps: (formProps: Partial<FormProps>) => Promise<void>
  removeSchemaByFiled: (field: string | string[]) => Promise<void>
  replaceSchemaByField: (
    schema: FormSchema | FormSchema[],
    predField?: string,
    nextField?: string
  ) => Promise<void>
  appendSchemaByField: (
    schema: FormSchema | FormSchema[],
    prefixField: string | undefined,
    first?: boolean | undefined
  ) => Promise<void>
  validateFields: (nameList?: NamePath[]) => Promise<any>
  validate: (nameList?: NamePath[]) => Promise<any>
  scrollToField: (name: NamePath, options?: ScrollOptions) => Promise<void>
}

export type RegisterFn = (formInstance: FormActionType) => void

export type UseFormReturnType = [RegisterFn, FormActionType]

export interface FormProps {
  // Whether to disable
  disabled?: boolean
  inline: boolean
  // The width of all items in the entire form
  labelWidth?: number | string
  //alignment
  labelAlign?: "left" | "right"
  labelPlacement?: "left" | "top"
  // Form value
  model?: Recordable
  rules?: FormRules
  showFeedback?: boolean
  showLabel?: boolean
  showRequireMark?: boolean
  requireMarkPlacement?: "left" | "right"
  // Internal component size of the form
  size?: "default" | "small" | "large"
  onSubmit?: () => (e: Event) => void

  //Row configuration for the entire form
  rowProps?: GridProps

  // General row style
  baseRowStyle?: CSSProperties

  // Form configuration rules
  schemas?: FormSchema[]

  // // Submit form on reset
  // submitOnReset?: boolean
  // // Col configuration for the entire form
  // labelCol?: Partial<ColEx>
  // // Col configuration for the entire form
  // wrapperCol?: Partial<ColEx>

  // // General col configuration
  // baseColProps?: Partial<ColEx>

  // // Function values used to merge into dynamic control form items
  // mergeDynamicData?: Recordable
  // // Compact mode for search forms
  // compact?: boolean
  // // Blank line span
  // emptySpan?: number | Partial<ColEx>

  // // Time interval fields are mapped into multiple
  // fieldMapToTime?: FieldMapToTime
  // // Placeholder is set automatically
  // autoSetPlaceHolder?: boolean
  // // Auto submit on press enter on input
  // autoSubmitOnEnter?: boolean
  // // Check whether the information is added to the label
  // rulesMessageJoinLabel?: boolean
  // // whether to use default rule
  // useDefaultRules
  // // Whether to show collapse and expand buttons
  showAdvancedButton?: boolean
  // // Whether to focus on the first input box, only works when the first form item is input
  // autoFocusFirstItem?: boolean
  // // Automatically collapse over the specified number of rows
  // autoAdvancedLine?: number
  // // Always show lines
  // alwaysShowLines?: number
  // // Whether to show the operation button
  // showActionButtonGroup?: boolean

  // // Reset button configuration
  // resetButtonOptions?: Partial<ButtonProps>

  // // Confirm button configuration
  // submitButtonOptions?: Partial<ButtonProps>

  // // Operation column configuration
  // actionColOptions?: Partial<ColEx>

  // // Show reset button
  // showResetButton?: boolean
  // // Show confirmation button
  // showSubmitButton?: boolean

  // resetFunc?: () => Promise<void>
  // submitFunc?: () => Promise<void>
  // transformDateFunc?: (date: any) => string
}
export interface FormSchema {
  effect: ({ schema: FormSchema, formModel: any }, ...args: Nullable<Recordable>[]) => void
  // value name
  valuePropsName: string
  // Field name
  field: string
  // Event name triggered by internal value change, default change
  changeEvent?: string
  // Variable name bound to v-model Default value
  valueField?: string
  // Label name
  label: string
  // Label width, if it is passed, the labelCol and WrapperCol configured by itemProps will be invalid
  labelWidth?: string | number
  // render component
  component: ComponentType
  // Component parameters
  componentProps?:
    | ((opt: {
        schema: FormSchema
        tableAction: any
        formActionType: FormActionType
        formModel: Recordable
      }) => Recordable)
    | object
  // Required
  required?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)

  suffix?: string | number | ((values: RenderCallbackParams) => string | number)

  // Validation rules
  rules?: Rule[]
  // Check whether the information is added to the label
  rulesMessageJoinLabel?: boolean

  //
  useDefaultRules?: boolean

  // Reference formModelItem
  itemProps?: Partial<FormItemGiProps>

  // col configuration outside formModelItem
  colProps?: Partial<ColEx>

  // 默认值
  defaultValue?: any
  isAdvanced?: boolean

  // Matching details components
  span?: number

  ifShow?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)

  show?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)

  // Render the content in the form-item tag
  render?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string

  // Rendering col content requires outer wrapper form-item
  renderColContent?: (renderCallbackParams: RenderCallbackParams) => VNode | VNode[] | string

  renderComponentContent?:
    | ((renderCallbackParams: RenderCallbackParams) => any)
    | VNode
    | VNode[]
    | string

  // Custom slot, in from-item
  slot?: string

  // Custom slot, similar to renderColContent
  colSlot?: string

  dynamicDisabled?: boolean | ((renderCallbackParams: RenderCallbackParams) => boolean)

  dynamicRules?: (renderCallbackParams: RenderCallbackParams) => Rule[]
}
export interface HelpComponentProps {
  maxWidth: string
  // Whether to display the serial number
  showIndex: boolean
  // Text list
  text: any
  // colour
  color: string
  // font size
  fontSize: string
  icon: string
  absolute: boolean
  // Positioning
  position: any
}
