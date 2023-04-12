import HSZTreeSelect from '@/components/HSZ-treeSelect'
import topOperation from '@/components/HSZ-topOperation/index'
import tableOperation from '@/components/HSZ-tableOperation'
import Pagination from '@/components/Pagination'
import HSZTable from '@/components/HSZ-table'
import UserBox from '@/components/HSZ-userBox'
import Screenfull from '@/components/Screenfull'
import ColumnSettings from '@/components/ColumnSettings'
import HSZQuill from '@/components/HSZEditor/quill'
import UserSelect from '@/components/HSZ-userSelect'
import uploadBtn from '@/components/HSZ-uploadBtn'
// 代码生成器专供
import HSZText from '@/components/Generator/components/HSZText'
import HszBarcode from '@/components/Generator/components/HszBarcode'
import HszQrcode from '@/components/Generator/components/HszQrcode'
import HszButton from '@/components/Generator/components/HszButton'
import HSZUploadFz from '@/components/Generator/components/Upload/UploadFz'
import HSZUploadImg from '@/components/Generator/components/Upload/UploadImg'
import PopupSelect from '@/components/Generator/components/PopupSelect'
import PopupAttr from '@/components/Generator/components/PopupAttr'
import NumRange from '@/components/Generator/components/NumRange'
import ComSelect from '@/components/Generator/components/ComSelect'
import DepSelect from '@/components/Generator/components/DepSelect'
import PosSelect from '@/components/Generator/components/PosSelect'
import DicSelect from '@/components/Generator/components/DicSelect'
import BillRule from '@/components/Generator/components/BillRule'
import HSZInputTable from '@/components/Generator/components/InputTable'
import HSZAddress from '@/components/Generator/components/Address'
import GroupTitle from '@/components/Generator/components/GroupTitle'
import RelationForm from '@/components/Generator/components/RelationForm'
import RelationFormAttr from '@/components/Generator/components/RelationFormAttr'
import Calculate from '@/components/Generator/components/Calculate'

export default {
  install (Vue, options) {
    Vue.component('HSZTreeSelect', HSZTreeSelect)
    Vue.component('topOpts', topOperation)
    Vue.component('tableOpts', tableOperation)
    Vue.component('Pagination', Pagination)
    Vue.component('HSZTable', HSZTable)
    Vue.component('uploadBtn', uploadBtn)
    Vue.component('UserBox', UserBox)
    Vue.component('HSZText', HSZText)
    Vue.component('HszBarcode', HszBarcode)
    Vue.component('HszQrcode', HszQrcode)
    Vue.component('HszButton', HszButton)
    Vue.component('HSZUploadFz', HSZUploadFz)
    Vue.component('HSZUploadImg', HSZUploadImg)
    Vue.component('PopupSelect', PopupSelect)
    Vue.component('PopupAttr', PopupAttr)
    Vue.component('NumRange', NumRange)
    Vue.component('ComSelect', ComSelect)
    Vue.component('DepSelect', DepSelect)
    Vue.component('PosSelect', PosSelect)
    Vue.component('UserSelect', UserSelect)
    Vue.component('DicSelect', DicSelect)
    Vue.component('BillRule', BillRule)
    Vue.component('HSZInputTable', HSZInputTable)
    Vue.component('HSZAddress', HSZAddress)
    Vue.component('GroupTitle', GroupTitle)
    Vue.component('RelationForm', RelationForm)
    Vue.component('RelationFormAttr', RelationFormAttr)
    Vue.component('Calculate', Calculate)
    Vue.component('HSZQuill', HSZQuill)
    Vue.component('Screenfull', Screenfull)
    Vue.component('ColumnSettings', ColumnSettings)
  }
}