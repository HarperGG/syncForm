<template>
  <div>
    <SyncForm @register="registerForm" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, nextTick, onMounted } from "vue"
import { FormSchema, useForm, SyncForm } from "@/components/Form/index"

export default defineComponent({
  components: { SyncForm },
  setup() {
    const schema1 = [
      {
        field: "field11",
        component: "n-input",
        label: "字段11"
        // colProps: {
        //   span: 24
        // }
        // defaultValue: "111"
      },
      {
        field: "field12",
        component: "n-select",
        label: "字段12"
        // colProps: {
        //   span: 24
        // }
        // defaultValue: "111"
      }
    ]
    const schema2 = [
      {
        field: "field21",
        component: "n-input",
        label: "字段21"
        // colProps: {
        //   span: 24
        // }
        // defaultValue: "111"
      },
      {
        field: "field22",
        component: "n-select",
        label: "字段22"
        // colProps: {
        //   span: 24
        // }
        // defaultValue: "111"
      }
    ]
    const model = reactive({
      field2: "21",
      field1: "",
      field3: "12"
    })
    const schemas: FormSchema[] = reactive([
      {
        field: "field1",
        component: "n-select",
        label: "字段1",
        effect: (value, val) => {
          console.log(value, val)
        },
        // colProps: {
        //   span: 1
        // },
        // defaultValue: "111",
        componentProps: (data) => {
          return {
            // onUpdateValue: (e) => {
            //   console.log(e)
            //   model.field1 = e:
            //   console.log(model)
            //   // removeSchemaByFiled("field3")
            //   // schemas.splice(1, 1)
            //   // schemas.push(...schema1)
            //   // console.log(schemas)
            //   // schema1.forEach((item) => {
            //   //   appendSchemaByField(item, "field2")
            //   // })
            // },
            options: [
              {
                label: "选项1",
                value: "1",
                key: "1"
              },
              {
                label: "选项2",
                value: "2",
                key: "2"
              }
            ]
          }
        }
      },
      {
        field: "field2",
        component: "n-select",
        label: "字段2",
        colProps: {
          span: 24
        }
        // defaultValue: "111"
      },
      {
        field: "field3",
        component: "n-input",
        label: "字段3",
        itemProps: {
          // labelWidth: 40,
          span: 2
        },
        colProps: {
          span: 24
        },
        children: [
          {
            field: "field2",
            component: "n-select",
            label: "字段2",
            colProps: {
              span: 24
            }
            // defaultValue: "111"
          }
        ]
        // defaultValue: "111"
      }
    ])

    const [
      registerForm,
      { setFieldsValue, getFieldsValue, removeSchemaByFiled, appendSchemaByField, onFieldChange }
    ] = useForm({
      labelWidth: 160,
      schemas,
      model,
      labelPlacement: "left",
      // showActionButtonGroup: true
      // actionColOptions: {
      //   span: 24
      // }
      rowProps: {
        cols: 6,
        xGap: 10,
        yGap: 0
      }
    })
    onMounted(() => {
      onFieldChange("field3", (data) => {
        console.log(data)
      })
    })
    return { registerForm }
  }
})
</script>
