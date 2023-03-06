import PageTool from './page-tool.vue'
import InfoBox from '@/components/info-box.vue'
import TabsGroup from '@/components/tabs-group.vue'
import TableItem from '@/components/table-item.vue'

export default {
  install (Vue) {
    Vue.component(PageTool.name, PageTool)
    Vue.component(InfoBox.name, InfoBox)
    Vue.component(TabsGroup.name, TabsGroup)
    Vue.component(TableItem.name, TableItem)
  }
}
