// 基础路由
const baseRouter = [{
  path: '/home',
  component: (resolve) => require(['@/views/dashboard'], resolve),
  name: 'home',
  meta: {
    title: 'home',
    icon: 'icon-sz icon-sz-nav-home',
    affix: true,
    zhTitle: '首页'
  }
},
{
  path: '/dashboard',
  component: (resolve) => require(['@/views/basic/dashboard'], resolve),
  name: 'dashboard',
  meta: {
    title: 'dashboard',
    icon: 'icon-sz icon-sz-generator-kanban',
    affix: false,
    zhTitle: '门户展示'
  }
},
{
  path: '/messageRecord',
  component: (resolve) => require(['@/views/basic/messageRecord'], resolve),
  name: 'messageRecord',
  meta: {
    title: 'messageRecord',
    affix: false,
    zhTitle: '消息中心',
    icon: 'icon-sz icon-sz-sysNotice',
  }
},
{
  path: '/previewModel',
  component: (resolve) => require(['@/views/basic/dynamicModel'], resolve),
  name: 'previewModel',
  meta: {
    title: 'previewModel',
    affix: false,
    zhTitle: '功能预览',
    icon: 'icon-sz icon-sz-btn-preview',
  }
},
{
  path: '/profile',
  component: (resolve) => require(['@/views/basic/profile'], resolve),
  name: 'profile',
  meta: {
    title: 'profile',
    affix: false,
    zhTitle: '个人信息',
    icon: 'icon-sz icon-sz-user',
  }
},
{
  path: '/emailDetail',
  component: (resolve) => require(['@/views/extend/email/DetailPage'], resolve),
  name: 'emailDetail',
  meta: {
    title: 'emailDetail',
    affix: false,
    zhTitle: '查看邮件',
    icon: 'icon-sz icon-sz-emailExample',
  }
},
{
  path: '/workFlowDetail',
  component: (resolve) => require(['@/views/workFlow/workFlowDetail'], resolve),
  name: 'workFlowDetail',
  meta: {
    title: 'workFlowDetail',
    affix: false,
    zhTitle: '流程详情',
    icon: 'icon-sz icon-sz-workFlow',
  }
}
]
export default baseRouter