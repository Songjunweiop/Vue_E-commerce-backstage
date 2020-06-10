import Vue from 'vue'
import { Button } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'


import { Message } from 'element-ui' //导入弹框提示组件
import { Notification } from 'element-ui'; //导入通知提示

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message //需要全区挂载
Vue.prototype.$notify = Notification