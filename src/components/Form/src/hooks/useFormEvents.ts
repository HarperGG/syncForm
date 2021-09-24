import { ComputedRef, Ref } from "vue"
import { FormProps, FormSchema, FormActionType } from "../types/form"
import { NamePath } from "ant-design-vue/lib/form/interface"
import { unref, toRaw } from "vue"
import { isArray, isFunction, isObject, isString } from "../utils/is"
import { deepMerge } from "../utils"
import { dateItemType, handleInputNumberValue } from "../helper"
import moment from "moment"
import { cloneDeep, uniqBy } from "lodash-es"
import { Events, EventTypes, EventCallBack } from "../types/event"
interface UseFormActionContext {
  emit: EmitType
  getProps: ComputedRef<FormProps>
  getSchema: ComputedRef<FormSchema[]>
  formModel: Recordable
  defaultValueRef: Ref<Recordable>
  formElRef: Ref<FormActionType>
  schemaRef: Ref<FormSchema[]>
  handleFormValues: Fn
}
export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef,
  schemaRef,
  handleFormValues
}: UseFormActionContext) {
  const eventsCenter: Events = { fieldChange: new Map<string, []>() }

  async function resetFields(): Promise<void> {
    const { resetFunc, submitOnReset } = unref(getProps)
    resetFunc && isFunction(resetFunc) && (await resetFunc())

    const formEl = unref(formElRef)
    if (!formEl) return

    Object.keys(formModel).forEach((key) => {
      formModel[key] = defaultValueRef.value[key]
    })
    clearValidate()
    emit("reset", toRaw(formModel))
    submitOnReset && handleSubmit()
  }

  /**
   * @description: Set form value
   */
  async function setFieldsValue(values: Recordable): Promise<void> {
    const fields = unref(getSchema)
      .map((item) => item.field)
      .filter(Boolean)
    const validKeys: string[] = []
    Object.keys(values).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key)
      let value = values[key]

      const hasKey = Reflect.has(values, key)

      value = handleInputNumberValue(schema?.component, value)
      // 0| '' is allow
      if (hasKey && fields.includes(key)) {
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(value)) {
            const arr: any[] = []
            for (const ele of value) {
              arr.push(ele ? moment(ele) : null)
            }
            formModel[key] = arr
          } else {
            const { componentProps } = schema || {}
            let _props = componentProps as any
            if (typeof componentProps === "function") {
              _props = _props({ formModel })
            }
            formModel[key] = value ? (_props?.valueFormat ? value : moment(value)) : null
          }
        } else {
          formModel[key] = value
        }
        validKeys.push(key)
      }
    })
    validateFields(validKeys).catch((_) => {})
  }

  /**
   * @description: field change
   */
  async function onFieldChange(field: string, cb: EventCallBack) {
    const fields = unref(getSchema)
    console.log(fields)
    subscribeEvent(field, "fieldChange", cb)
  }

  function register(field: string, type: EventTypes) {
    const events = eventsCenter[type]
    if (!events.has(field)) {
      events.set(field, [])
    }
  }
  function emitEvent(field: string, type: EventTypes, oldValue, ...args) {
    const events = eventsCenter[type]
    const handlers = events.get(field)
    handlers &&
      handlers.forEach((cb) => {
        cb({ model: "", value: "" }, ...args)
      })
  }
  function subscribeEvent(field: string | string[], type: EventTypes, fn: EventCallBack) {
    const events = eventsCenter[type]
    let fields: string[] = []
    if (field instanceof Array) {
      fields = field
    } else {
      fields = [field]
    }
    fields.forEach((item) => {
      const handlers = events.get(item)
      if (handlers && !handlers.includes(fn)) {
        handlers.push(fn)
      } else if (handlers) {
        throw new Error("handler has exist")
      }
    })
  }
  async function removeSchemaByFiled(fields: string | string[]): Promise<void> {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema))
    if (!fields) {
      return
    }

    let fieldList: string[] = isString(fields) ? [fields] : fields
    if (isString(fields)) {
      fieldList = [fields]
    }
    for (const field of fieldList) {
      _removeSchemaByFiled(field, schemaList)
    }
    schemaRef.value = schemaList
  }

  /**
   * @description: Delete based on field name
   */
  function _removeSchemaByFiled(field: string, schemaList: FormSchema[]): void {
    if (isString(field)) {
      const index = schemaList.findIndex((schema) => schema.field === field)
      if (index !== -1) {
        delete formModel[field]
        schemaList.splice(index, 1)
      }
    }
  }

  /**
   * @description: Insert after a certain field, if not insert the last
   */
  async function appendSchemaByField(
    schema: FormSchema[] | FormSchema,
    prefixField?: string,
    first = false
  ) {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema))
    const index = schemaList.findIndex((schema) => schema.field === prefixField)
    if (!prefixField || index === -1 || first) {
      if (isArray(schema)) {
        first ? schemaList.unshift(...schema) : schemaList.push(...schema)
      } else {
        first ? schemaList.unshift(schema) : schemaList.push(schema)
      }
      schemaRef.value = schemaList
      return
    }
    if (isArray(schema)) {
      const schemaListField = schemaList.map((item) => item.field)
      schema = schema.filter((item) => schemaListField.includes(item.field))
    }

    if (index !== -1) {
      isArray(schema)
        ? schemaList.splice(index + 1, 0, ...schema)
        : schemaList.splice(index + 1, 0, schema)
    }
    schemaRef.value = schemaList
  }

  async function replaceSchemaByField(
    schema: FormSchema[] | FormSchema,
    predField: string,
    nextField: string
  ) {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema))
    const predIndex = schemaList.findIndex((schema) => schema.field === predField)
    const nextIndex = schemaList.findIndex((schema) => schema.field === nextField)
    schemaList.slice(predIndex, nextIndex).forEach((schema) => {
      removeSchemaByFiled(schema.field)
    })
    if (!predIndex) return
    if (predIndex && predIndex > 0) {
      appendSchemaByField(schema, schemaList[predIndex - 1].field)
    }
  }

  async function resetSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
    let updateData: Partial<FormSchema>[] = []
    if (isObject(data)) {
      updateData.push(data as FormSchema)
    }
    if (isArray(data)) {
      updateData = [...data]
    }

    const hasField = updateData.every((item) => Reflect.has(item, "field") && item.field)

    if (!hasField) {
      return
    }
    schemaRef.value = updateData as FormSchema[]
  }

  async function updateSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
    let updateData: Partial<FormSchema>[] = []
    if (isObject(data)) {
      updateData.push(data as FormSchema)
    }
    if (isArray(data)) {
      updateData = [...data]
    }

    const hasField = updateData.every((item) => Reflect.has(item, "field") && item.field)

    if (!hasField) {
      throw new Error(
        "All children of the form Schema array that need to be updated must contain the `field` field"
      )
    }
    const schema: FormSchema[] = []
    updateData.forEach((item) => {
      unref(getSchema).forEach((val) => {
        if (val.field === item.field) {
          const newSchema = deepMerge(val, item)
          schema.push(newSchema as FormSchema)
        } else {
          schema.push(val)
        }
      })
    })
    schemaRef.value = uniqBy(schema, "field")
  }

  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef)
    if (!formEl) return {}
    return handleFormValues(toRaw(unref(formModel)))
  }

  /**
   * @description: Is it time
   */
  function itemIsDateType(key: string) {
    return unref(getSchema).some((item) => {
      return item.field === key ? dateItemType.includes(item.component) : false
    })
  }

  async function validateFields(nameList?: NamePath[] | undefined) {
    return unref(formElRef)?.validateFields(nameList)
  }

  async function validate(nameList?: NamePath[] | undefined) {
    return await unref(formElRef)?.validate(nameList)
  }

  async function clearValidate(name?: string | string[]) {
    await unref(formElRef)?.clearValidate(name)
  }

  async function scrollToField(name: NamePath, options?: ScrollOptions | undefined) {
    await unref(formElRef)?.scrollToField(name, options)
  }

  /**
   * @description: Form submission
   */
  async function handleSubmit(e?: Event): Promise<void> {
    e && e.preventDefault()
    const { submitFunc } = unref(getProps)
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc()
      return
    }
    const formEl = unref(formElRef)
    if (!formEl) return
    try {
      const values = await validate()
      const res = handleFormValues(values)
      emit("submit", res)
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByFiled,
    replaceSchemaByField,
    resetFields,
    setFieldsValue,
    scrollToField,
    register,
    onFieldChange,
    emitEvent
  }
}
