/**
 * 文件中为引入的所有vant组件
 *
 * 因为是按需引入的，所以并非vant的全部组件
 */
import Vue from 'vue'

import {
  AddressEdit,
  Toast,
  Popup,
  Pagination,
  Dialog, Calendar, Cell, Checkbox, List, Tab, Tabs
} from 'vant'

Vue.use(Toast)
  .use(AddressEdit)
  .use(Popup)
  .use(Dialog)
  .use(Calendar)
  .use(Cell)
  .use(Checkbox)
  .use(List)
  .use(Tab)
  .use(Tabs)
  .use(Pagination);
