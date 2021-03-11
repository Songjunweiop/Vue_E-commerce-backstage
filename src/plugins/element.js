import Vue from 'vue'
// import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import { Button, Row, Col, } from 'element-ui'
import { Form, FormItem, Breadcrumb, BreadcrumbItem, Card } from 'element-ui'
import { Input, Container, Header, Aside, Main, Menu, Submenu, MenuItemGroup, MenuItem } from 'element-ui'
import {
  Table,
  TableColumn,
  Switch,
  Tooltip,
  PageHeader,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Step,
  Steps,
  Checkbox,
  CheckboxGroup,
  Upload,
  Dropdown,
  DropdownMenu,
  DropdownItem,



}
from 'element-ui'
import { Message } from 'element-ui' //导入弹框提示组件
import { Notification } from 'element-ui'; //导入通知提示
// Vue.use(ElementUI)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message //需要全区挂载
Vue.prototype.$notify = Notification
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Col)
Vue.use(Row)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(PageHeader)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$confirm = MessageBox.confirm
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)