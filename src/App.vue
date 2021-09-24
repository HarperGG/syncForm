<template>
  <div>
    <!-- <BasicForm @register="registerForm" />
    <SyncForm @register="registerForm" />
    <n-form :rules="rules" :model="formValue" label-placement="left">
      <n-form-item path="user.name" :suffix="false" :offset="40" :span="50" label="姓名">
        <n-input />
      </n-form-item>
      <n-form-item label="年龄">
        <n-input />
      </n-form-item>
      <NFormItem label="年龄">
        <n-input />
      </NFormItem>
    </n-form> -->
    <Array></Array>
    <SlotTemp></SlotTemp>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, nextTick } from "vue"
import { BasicForm, FormSchema, useForm, SyncForm } from "@/components/Form/index"
import Array from "./syncComp/array.vue"
import SlotTemp from "./syncComp/slot.vue"

export default defineComponent({
  name: "App",
  components: { Array, SlotTemp },
  setup() {
    const schemas: FormSchema[] = reactive([
      {
        field: "field1",
        component: "n-select",
        label: "字段1",
        colProps: {
          span: 12
        },
        defaultValue: "111",
        componentProps: (data) => {
          return {
            onChange: async (e) => {
              console.log(data, e)
              removeSchemaByFiled("field3")
            },
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
        itemProps: {},
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
    const model = reactive({
      field2: "21",
      field1: "",
      field3: "12"
    })
    const [registerForm, { setFieldsValue, getFieldsValue, removeSchemaByFiled }] = useForm({
      labelWidth: 160,
      schemas,
      model,
      rules: {
        field1: {
          required: true,
          message: "请输入姓名",
          trigger: "blur"
        },
        field2: {
          required: true,
          message: "请输入姓名",
          trigger: "blur"
        },
        field3: {
          required: true,
          message: "请输入姓名",
          trigger: "blur"
        }
      },
      labelPlacement: "left",
      showActionButtonGroup: true,
      actionColOptions: {
        span: 24
      },
      rowProps: {
        cols: 1,
        xGap: 10,
        yGap: 40
      }
    })
    setTimeout(() => {
      console.log(getFieldsValue())
    }, 1)
    const formRef = ref(null)
    return {
      formRef,
      schemas,
      size: ref("medium"),
      registerForm,
      formValue: ref({
        user: {
          name: "",
          age: ""
        },
        phone: ""
      }),
      rules: {
        user: {
          name: {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          },
          age: {
            required: true,
            message: "请输入年龄",
            trigger: ["input", "blur"]
          }
        },
        phone: {
          required: true,
          message: "请输入电话号码",
          trigger: ["input"]
        }
      },
      handleValidateClick(e) {
        formRef.value.validate((errors) => {
          if (!errors) {
            console.log(1)
          } else {
            console.log(errors)
          }
        })
      }
    }
  }
})
</script>
