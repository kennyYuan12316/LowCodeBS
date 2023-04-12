<template>
  <div class="app-container Email-container nohead">
    <el-tabs tab-position="left" style="height: 100%" v-model="activeTab">
      <el-tab-pane :name="item.toString()" v-for="(item, index) in LayerArr" :key="index">
        <span slot="label"><i class="icon-sz el-icon-box"></i>第{{ item }}层</span>
      </el-tab-pane>

      <div class="main HSZ-flex-main">
        <div id="mountNode" ref="mountNode"></div>
        <div class="tt" style="position: absolute; top: 0; right: 0">
          <img :src="require('@/assets/images/G6/tp2.png')" style="height: 80vh" />
        </div>
      </div>
    </el-tabs>
  </div>
</template>

<script>
import request from "@/utils/request";
import G6 from "@antv/g6";
import { mod } from "@antv/util";
export default {
  data() {
    return {
      activeTab: "1", //菜单tab
      LayerArr: ["3", "2", "1"], //楼层 Layer字段自动排序 [1,2,3...]
      plcList: [], //plc所有数据
      graph: undefined, //G6图形编辑实例
      timer: undefined, //定时器
      timeNumber: 1000 * 5,//1000=1秒
      nodeListLayer: {}, //json数据，每一层的节点数据 调用 nodeListLayer["1"] 第一层
    };
  },
  watch: {
    activeTab(val) {
      this.reset();
    },
  },
  created() { },
  mounted() {
    this.initG6();
    request({
      url: `/api/wms/zjnWmsDeviceMonitor/GetDeviceMonitorList`,
      method: "GET",
    }).then((res) => {
      console.log(res);
      this.plcList = res.data;
      this.getData();
      // this.timer = setInterval(this.getData, this.timeNumber); //一分钟
    });
  },
  methods: {
    //切换楼层
    reset() {
      console.log(this.nodeListLayer[this.activeTab]);
      this.graph.data({
        nodes: this.nodeListLayer[this.activeTab],
      });
      this.graph.render();
      this.getData();
    },
    //初始化G6
    initG6() {
      //提示框
      const tooltip = new G6.Tooltip({
        offsetX: 80,
        offsetY: -80,
        getContent(e) {
          const outDiv = document.createElement("div");

          outDiv.innerHTML = `<div class="plc">
                               <ul style="list-style-type:none;">
                                   <li>设备编号: ${e.item.getModel().station
            }</li>
                               </ul>
                              </div>`;

          return outDiv;
        },
        /* getContent(e) {
          const outDiv = document.createElement('div');

          if (e.item.getModel().class == 'line') {
            if (e.item.getModel().wcsdata == undefined) {
              outDiv.innerHTML = `<div class="plc info" style="float:left">
                <h4>plc</h4>
                <ul >
                <li>设备编号:<span class="show">${e.item.getModel().station ?? ''}</span></li>
                <li>任务号:  <span class="show">${e.item.getModel().data.TaskCode ?? ''}</span></li>
                <li>目标设备号:  <span class="show">${e.item.getModel().data.ToEquipmentCode ?? ''}</span></li>
                <li>托盘条码:<span class="show">${e.item.getModel().data.PalletBarcode ?? ''}</span></li>
                <li>握手类型:<span class="show">${e.item.getModel().data.ActionType ?? ''}</span></li>
                <li>托盘类型:<span class="show">${e.item.getModel().data.PalletType ?? ''}</span></li>
                <li>故障代码:<span class="show">${plcPlanerAlrmShow(e.item.getModel().data.AlrmCode) ?? ''}</span></li>
                <li>预留1:<span class="show">${e.item.getModel().data.Reserve ?? ''}</span></li>
                <li>预留2:<span class="show">${e.item.getModel().data.Reserve2 ?? ''}</span></li>
                <li>预留3:<span class="show">${e.item.getModel().data.Reserve3 ?? ''}</span></li>
                <li>预留4:<span class="show">${e.item.getModel().data.Reserve4 ?? ''}</span></li>
                </div>`;
            }
            else {
              outDiv.innerHTML = `<div class="plc info" style="float:left">
                <h4>plc</h4>
                <ul>
                <li>设备编号:<span class="show">${e.item.getModel().station ?? '0'}</span></li>
                <li>任务号:  <span class="show">${e.item.getModel().data.TaskCode ?? '0'}</span></li>
                <li>目标设备号:  <span class="show">${e.item.getModel().data.ToEquipmentCode ?? '0'}</span></li>
                <li>托盘条码:<span class="show">${e.item.getModel().data.PalletBarcode ?? '0'}</span></li>
                <li>握手类型:<span class="show">${e.item.getModel().data.ActionType ?? '0'}</span></li>
                <li>托盘类型:<span class="show">${e.item.getModel().data.PalletType ?? '0'}</span></li>
                <li>故障代码:<span class="show">${plcPlanerAlrmShow(e.item.getModel().data.AlrmCode) ?? 0}</span></li>
                <li>预留1:<span class="show">${e.item.getModel().data.Reserve ?? ''}</span></li>
                <li>预留2:<span class="show">${e.item.getModel().data.Reserve2 ?? ''}</span></li>
                <li>预留3:<span class="show">${e.item.getModel().data.Reserve3 ?? ''}</span></li>
                <li>预留4:<span class="show">${e.item.getModel().data.Reserve4 ?? ''}</span></li>
                </ul>
                </div>
                <div class="wcs info" style="float:right">
                <h4>wcs</h4>
                <ul>
                <li>设备编号:<span class="show">${e.item.getModel().station ?? '0'}</span></li>
                <li>任务号:  <span class="show">${e.item.getModel().wcsdata.TaskCode ?? '0'}</span></li>
                <li>目标设备号:  <span class="show">${e.item.getModel().wcsdata.ToEquipmentCode ?? '0'}</span></li>
                <li>托盘条码:<span class="show">${e.item.getModel().wcsdata.PalletBarcode ?? '0'}</span></li>
                <li>握手类型:<span class="show">${e.item.getModel().wcsdata.ActionType ?? '0'}</span></li>
                <li>托盘类型:<span class="show">${e.item.getModel().wcsdata.PalletType ?? '0'}</span></li>
                <li>故障代码:<span class="show">${wcsPlanerAlrmShow(e.item.getModel().wcsdata.AlrmCode) ?? 0}</span></li>
                <li>预留1:<span class="show">${e.item.getModel().wcsdata.Reserve ?? '0'}</span></li>
                <li>预留2:<span class="show">${e.item.getModel().wcsdata.Reserve2 ?? '0'}</span></li>
                <li>预留3:<span class="show">${e.item.getModel().wcsdata.Reserve3 ?? '0'}</span></li>
                <li>预留4:<span class="show">${e.item.getModel().wcsdata.Reserve4 ?? '0'}</span></li>
                </ul>
                </div>`;
            }
          }
          else if (e.item.getModel().class == 'sc') {
            outDiv.innerHTML = `<h4 style="text-align:center"> 堆垛机编号:${e.item.getModel().station}</h4>
                    <div class="ibox">
                    <div class=" info" >
                    <ul>
                    <li>堆垛机手自动:  <span class="show">${e.item.getModel().data.StackerHandAutomatic == 1 ? "自动" : "手动"}</span></li>
                    <li>堆垛机闲忙:    <span class="show">${e.item.getModel().data.StackerBusy == 1 ? "空闲" : "忙"}</span></li>
                    <li>货叉有盘:      <span class="show">${e.item.getModel().data.Forkhasaterial ? '有' : '无'}</span></li>
                    <li>堆垛机报警:    <span class="show">${e.item.getModel().data.StackerAlarm ? '是' : '否'}</span></li>
                    <li>堆垛机运行信号:<span class="show">${e.item.getModel().data.Stackerrunningsignal ? '是' : '否'}</span></li>
                    <li>堆垛机任务完成:<span class="show">${e.item.getModel().data.StackerTaskCompletion ? '是' : '否'}</span></li>
                    <li>安全门在线信号:<span class="show">${e.item.getModel().data.SecurityDooronLine ? '是' : '否'}</span></li>
                    <li>上位机更新状态:<span class="show">${e.item.getModel().data.yuliu1 ? '是' : '否'}</span></li>
                    <li>请求WSC红外拍照:<span class="show">${e.item.getModel().data.yuliu2 ? '是' : '否'}</span></li>
                    <li>取料完成:<span class="show">${e.item.getModel().data.yuliu4 ? '是' : '否'}</span></li>
                    <li>堆垛机报警代码:  <span class="show">${wcsPlanerAlrmShow(e.item.getModel().data.Stackeralarmcode) ?? e.item.getModel().data.Stackeralarmcode}</span></li>
                    <li>当前工作序号:  <span class="show">${e.item.getModel().data.Currentjobnumber}</span></li>
                    <li>当前工作命令代码: <span class="show">${e.item.getModel().data.Currentworkordercode || "当前无工作命令"}</span></li>
                    </ul>
                    </div>
                    <div class="info">
                    <ul>
                    <li>当前行:  <span class="show">${e.item.getModel().data.Currentline}</span></li>
                    <li>当前列:  <span class="show">${e.item.getModel().data.Currentcolumn}</span></li>
                    <li>当前层:  <span class="show">${e.item.getModel().data.Currentlayer}</span></li>
                    <li>启始行: <span class="show"> ${e.item.getModel().data.StartlinetoPC}</span></li>
                    <li>启始列: <span class="show"> ${e.item.getModel().data.StartcolumntoPC}</span></li>
                    <li>启始层: <span class="show"> ${e.item.getModel().data.StartlayertoPC}</span></li>
                    <li>目标行: <span class="show"> ${e.item.getModel().data.TargetlinetoPC}</span></li>
                    <li>目标列: <span class="show"> ${e.item.getModel().data.TargetcolumntoPC}</span></li>
                    <li>目标层: <span class="show"> ${e.item.getModel().data.TargetlayertoPC}</span></li>
                    </ul>
                    </div>
                    </div>`;
          }
          else if (e.item.getModel().class == 'eleLayer') {
            outDiv.innerHTML = `<div class="ibox">
                    <div class=" info">
                    <h4> PLC数据</h4>
                    <ul>
                    <li>提升机编号:  <span class="show">${e.item.getModel().station}</span></li>
                    <li>自动:  <span class="show">${e.item.getModel().data.Auto == 1 ? "自动" : "手动"}</span></li>
                    <li>繁忙:    <span class="show">${e.item.getModel().data.Busy == 1 ? "繁忙" : "空闲"}</span></li>
                    <li>上层有盘:      <span class="show">${e.item.getModel().data.UpMaterial == 1 ? "有盘" : "无盘"}</span></li>
                    <li>下层有盘:    <span class="show">${e.item.getModel().data.DownMaterial == 1 ? "有盘" : "无盘"}</span></li>
                    <li>任务完成:<span class="show">${e.item.getModel().data.TaskComplete == 1 ? "完成" : "无"}</span></li>
                    <li>报警:<span class="show">${e.item.getModel().data.LiftAlrm == 1 ? "报警" : "无"}</span></li>
                    <li>报警代码:<span class="show">${e.item.getModel().data.LiftAlrmCode}</span></li>
                    <li>模拟自动:<span class="show">${e.item.getModel().data.Analogautomatic == 1 ? "模拟中" : "无"}</span></li>
                    <li>当前楼:<span class="show">${e.item.getModel().data.CurrentFloor}</span></li>
                    <li>当前层:<span class="show">${e.item.getModel().data.CurrentLayer}</span></li>
                    <li>当前上层功能:<span class="show">${e.item.getModel().data.CurrentUpFunction}</span></li>
                    <li>当前下层功能:  <span class="show">${e.item.getModel().data.CurrentDownFunction}</span></li>
                    </ul>
                    </div>
                    <div class="info" >
                    <h4>上层仓位</h4>
                    <ul>
                    <li>上层设备编号:  <span class="show">${e.item.getModel().data.UpEquipmentCode}</span></li>
                    <li>上层目标设备号:  <span class="show">${e.item.getModel().data.UpTaskCode}</span></li>
                    <li>上层托盘条码: <span class="show"> ${e.item.getModel().data.UpPalletBarcode}</span></li>
                    <li>上层握手类型: <span class="show"> ${e.item.getModel().data.UpActionType}</span></li>
                    <li>上层托盘类型: <span class="show"> ${e.item.getModel().data.UpPalletType}</span></li>
                    <li>上层故障代码: <span class="show"> ${e.item.getModel().data.UpAlrmCode}</span></li>
                    <li>上层预留: <span class="show"> ${e.item.getModel().data.UpReserve}</span></li>
                    <li>上层预留: <span class="show"> ${e.item.getModel().data.UpReserve2}</span></li>
                    <li>上层预留: <span class="show"> ${e.item.getModel().data.UpReserve3}</span></li>
                    <li>上层预留: <span class="show"> ${e.item.getModel().data.UpReserve4}</span></li>
                    </ul>
                    </div>
                    <div class="info" >
                    <h4>下层仓位</h4>
                    <ul>
                    <li>下层设备编号:  <span class="show">${e.item.getModel().data.DownEquipmentCode}</span></li>
                    <li>上层目标设备号:  <span class="show">${e.item.getModel().data.DownTaskCode}</span></li>
                    <li>下层托盘条码: <span class="show"> ${e.item.getModel().data.DownPalletBarcode}</span></li>
                    <li>下层握手类型: <span class="show"> ${e.item.getModel().data.DownActionType}</span></li>
                    <li>下层托盘类型: <span class="show"> ${e.item.getModel().data.DownPalletType}</span></li>
                    <li>下层故障代码: <span class="show"> ${e.item.getModel().data.DownAlrmCode}</span></li>
                    <li>下层预留: <span class="show"> ${e.item.getModel().data.DownReserve}</span></li>
                    <li>下层预留: <span class="show"> ${e.item.getModel().data.DownReserve2}</span></li>
                    <li>下层预留: <span class="show"> ${e.item.getModel().data.DownReserve3}</span></li>
                    <li>下层预留: <span class="show"> ${e.item.getModel().data.DownReserve4}</span></li>
                    </ul>
                </div>
            </div>`;
          }
          else if (e.item.getModel().class == 'rb' || e.item.getModel().class == 'ocv') {
            let bd, tq, tc, at, pt, ac;
            if (e.item.getModel().data == undefined) {
              bd = 0;
              tq = 0;
              tc = 0;
              at = 0;
              pt = 0;
              ac = 0;
            } else {
              bd = e.item.getModel().data.PalletBarcode ?? '0';
              tq = e.item.getModel().data.ToEquipmentCode ?? '0';
              tc = e.item.getModel().data.TaskCode ?? '0';
              at = e.item.getModel().data.ActionType ?? '0';
              pt = e.item.getModel().data.PalletType ?? '0';
              ac = e.item.getModel().data.AlrmCode ?? '0';
            }
            outDiv.innerHTML = `<div class=" info" style="float:left">
            <h4>plc</h4>
            <ul >
            <li>设备编号:<span class="show">${e.item.getModel().station}</span></li>
            <li>托盘条码:<span class="show">${bd}</span></li>
            <li>任务号:  <span class="show">${tc}</span></li>
            <li>目标设备号:  <span class="show">${tq}</span></li>
            <li>握手类型:<span class="show">${at}</span></li>
            <li>托盘类型:<span class="show">${pt}</span></li>
            <li>故障代码:<span class="show">${plcPlanerAlrmShow(ac) ?? 0}</span></li>
            </ul>
            </div>`;
          }
          else if (e.item.getModel().class == 'eleLine') {
            let bd, tq, tc, at, pt, ac, l1, l2, l3, l4;
            if (e.item.getModel().data == undefined) {
              bd = 0;
              tq = 0;
              tc = 0;
              at = 0;
              pt = 0;
              ac = 0;
              l1 = 0;
              l2 = 0;
              l3 = 0;
              l4 = 0;
            } else {
              bd = e.item.getModel().data.PalletBarcode ?? '0';
              tq = e.item.getModel().data.ToEquipmentCode ?? '0';
              tc = e.item.getModel().data.TaskCode ?? '0';
              at = e.item.getModel().data.ActionType ?? '0';
              pt = e.item.getModel().data.PalletType ?? '0';
              ac = e.item.getModel().data.AlrmCode ?? '0';
              l1 = e.item.getModel().data.Reserve ?? '0'
              l2 = e.item.getModel().data.Reserve2 ?? '0'
              l3 = e.item.getModel().data.Reserve3 ?? '0'
              l4 = e.item.getModel().data.Reserve4 ?? '0'
            }
            outDiv.innerHTML = `<div class=" info" style="float:left">
            <h4>plc</h4>
            <ul >
            <li>设备编号:<span class="show">${e.item.getModel().station}</span></li>
            <li>托盘条码:<span class="show">${bd}</span></li>
            <li>任务号:  <span class="show">${tc}</span></li>
            <li>目标设备号:  <span class="show">${tq}</span></li>
            <li>握手类型:<span class="show">${at}</span></li>
            <li>托盘类型:<span class="show">${pt}</span></li>
            <li>故障代码:<span class="show">${plcPlanerAlrmShow(ac) ?? 0}</span></li>
            <li>预留1:<span class="show">${l1}</span></li>
            <li>预留2:<span class="show">${l2}</span></li>
            <li>预留3:<span class="show">${l3}</span></li>
            <li>预留4:<span class="show">${l4}</span></li>
            </ul>
            </div>`;
          }
          else {
            outDiv.innerHTML = `<div class="plc">
                <ul>
                    <li>设备编号: ${e.item.getModel().station}</li>
                </ul>
            </div>`;
          }
          return outDiv;
        }, */
        itemTypes: ['node']
      });
      const minimap = new G6.Minimap({
        size: [280, 200],
        className: 'minimap',

        type: 'delegate',

      });
      // 创建 G6 图实例
      console.log(this.$refs.mountNode);
      const mountNodeHeight = this.$refs.mountNode.clientHeight;
      const mountNodeWidth = this.$refs.mountNode.clientWidth;
      this.graph = new G6.Graph({
        container: 'mountNode', // 指定图画布的容器 id，与第 9 行的容器对应
        fitView: true,
        fitViewPadding: [50, 50, 100, 50],
        // enabledStack: true,
        // 画布宽高
        width: mountNodeWidth,
        height: mountNodeHeight,
        modes: {
          default: ['drag-canvas', 'zoom-canvas'],
        },
        plugins: [tooltip, minimap],
        animate: false,

      });
      this.graph.fitView(150);
    },
    //定时器事件
    getData() {
      request({
        url: `/api/wms/MonitorEditor/GetMonitorConfigInfoByFloor`,
        method: "GET",
        data: { floor: "a" + this.activeTab },
      }).then((res) => {
        //res.data
        if (res.data) {
          if (!this.nodeListLayer[this.activeTab]) {
            this.nodeListLayer[this.activeTab] = [];
          }
          console.log(require("@/assets/images/G6/hj.png"));
          var array = JSON.parse(res.data[0].Json).nodes;
          this.nodeListLayer[this.activeTab] = res.data[0].Json.replaceAll("/images/", "@/assets/images/G6/");
          array.forEach(element => {
            if (element.logoIcon) {
              if (element.logoIcon.img.indexOf("svg") == -1) {
                console.log(require(element.logoIcon.img.replaceAll("/images/", "@/assets/images/G6/")));
              }
              else{
                console.log(require(element.logoIcon.img.replaceAll("/images/", "/icons/")));
              }
            }
            if (element.stateIcon) {
              if (element.stateIcon.img.indexOf("svg") == -1) {
                console.log(require(element.stateIcon.img.replaceAll("/images/", "@/assets/images/G6/")));
              }
              else{
                // console.log(require(element.stateIcon.img.replaceAll("/images/", "@/assets/images/G6/"),false,/\.svg$/));
              }
            }
          });
          this.graph.data(this.nodeListLayer[this.activeTab]);
          this.graph.render();
        }
      });
    },
    updateImg(it, index) {
      let imgurl = require("@/assets/images/G6/hwState" + index + ".png");
      if (it.getModel().img.trim() != imgurl) {
        this.graph.setAutoPaint(false);
        it.update({ img: imgurl });
        //  graph.paint();
        this.graph.refreshItem(it);
        this.graph.setAutoPaint(true);
      }
    },
    plcPlanerAlrmShow(id) {
      var alrmCode = id;
      if (parseInt(alrmCode) > 0) {
        if (alrmCode == 1) {
          return "入料超时报警";
        }
        if (alrmCode == 2) {
          return "到位感应断开异常";
        }
        if (alrmCode == 3) {
          return "到位感应接通异常";
        }
        if (alrmCode == 4) {
          return "托盘信息丢失报警(请检查目标编号和条码)";
        }
        if (alrmCode == 5) {
          return "托盘信息未清除报警(请检查目标编号和条码)";
        }
        if (alrmCode == 6) {
          return "托盘信息错误报警(检查目标编号是否错误)";
        }
        if (alrmCode == 7) {
          return "任务申请时托盘条码异常";
        }
        if (alrmCode == 8) {
          return "WCS响应超时报警";
        }
        if (alrmCode == 9) {
          return "WCS反馈托盘目的地址错误";
        }
        if (alrmCode == 10) {
          return "扫码超时报警";
        }
        if (alrmCode == 11) {
          return "扫码NG报警";
        }
        if (alrmCode == 12) {
          return "托盘信息错误报警(检查目标编号是否错误)";
        }
        if (alrmCode == 13) {
          return "入料后无条码报警";
        }
        if (alrmCode == 14) {
          return "顶升行程开关感应1异常报警";
        }
        if (alrmCode == 15) {
          return "顶升行程开关感应2异常报警";
        }
        if (alrmCode == 16) {
          return "托盘条码校验失败报警";
        }
        if (alrmCode == 17) {
          return "滚筒无料有条码报警";
        }
        if (alrmCode == 18) {
          return "滚筒有料无条码报警";
        }
        if (alrmCode == 19) {
          return "货叉感应器断开异常";
        }
        if (alrmCode == 20) {
          return "急停报警";
        }
        if (alrmCode == 21) {
          return "顶升气缸伸出卡阻报警";
        }
        if (alrmCode == 22) {
          return "顶升气缸缩回卡阻报警";
        }
        if (alrmCode == 23) {
          return "顶升气缸检测异常报警";
        }
        if (alrmCode == 24) {
          return "直行大阻挡气缸伸出卡阻报警";
        }
        if (alrmCode == 25) {
          return "直行大阻挡气缸缩回卡阻报警";
        }
        if (alrmCode == 26) {
          return "直行大阻挡气缸检测异常报警";
        }
        if (alrmCode == 27) {
          return "直行小阻挡气缸伸出卡阻报警";
        }
        if (alrmCode == 28) {
          return "直行小阻挡气缸缩回卡阻报警";
        }
        if (alrmCode == 29) {
          return "直行小阻挡气缸检测异常报警";
        }
        if (alrmCode == 30) {
          return "左侧大阻挡气缸伸出卡阻报警";
        }
        if (alrmCode == 31) {
          return "左侧大阻挡气缸缩回卡阻报警";
        }
        if (alrmCode == 32) {
          return "左侧大阻挡气缸检测异常报警";
        }
        if (alrmCode == 33) {
          return "左侧小阻挡气缸伸出卡阻报警";
        }
        if (alrmCode == 34) {
          return "左侧小阻挡气缸缩回卡阻报警";
        }
        if (alrmCode == 35) {
          return "左侧小阻挡气缸检测异常报警";
        }
        if (alrmCode == 36) {
          return "右侧大阻挡气缸伸出卡阻报警";
        }
        if (alrmCode == 37) {
          return "右侧大阻挡气缸缩回卡阻报警";
        }
        if (alrmCode == 38) {
          return "右侧大阻挡气缸检测异常报警";
        }
        if (alrmCode == 39) {
          return "右侧小阻挡气缸伸出卡阻报警";
        }
        if (alrmCode == 40) {
          return "右侧小阻挡气缸缩回卡阻报警";
        }
        if (alrmCode == 41) {
          return "右侧小阻挡气缸检测异常报警";
        }
        if (alrmCode == 42) {
          return "线体电动滚筒报警";
        }
        if (alrmCode == 43) {
          return "移栽电动滚筒报警";
        }
        if (alrmCode == 44) {
          return "前段入料超时报警";
        }
        if (alrmCode == 45) {
          return "左段入料超时报警";
        }
        if (alrmCode == 46) {
          return "右段入料超时报警";
        }
        if (alrmCode == 47) {
          return "托盘类型异常报警";
        }
        if (alrmCode == 48) {
          return "托盘放反";
        }
        return alrmCode;
      }
    },
    wcsPlanerAlrmShow(id) {
      var alrmCode = id;
      if (parseInt(alrmCode) > 0) {
        if (alrmCode == 1) {
          return "PLC托盘码不存在";
        }
        if (alrmCode == 2) {
          return "投料检验失败";
        }
        if (alrmCode == 3) {
          return "向Wms请求任务失败";
        }
        if (alrmCode == 5) {
          return "请查看堆垛机是否报完成，如若未报完成，请将此托盘放回原来库位，重置任务等待堆垛机再次取料";
        }
        if (alrmCode == 6) {
          return "此路径没配置";
        }
        if (alrmCode == 7) {
          return "查看此托盘的任务信息是否正确，PLC是否重复申请";
        }
        if (alrmCode == 8) {
          return "向WMS申请货位异常";
        }
        if (alrmCode == 9) {
          return "当前路径不是结束点";
        }
        if (alrmCode == 10) {
          return "CCD数量校验失败";
        }
        if (alrmCode == 11) {
          return "托盘校验失败";
        }
        if (alrmCode == 12) {
          return "空盘校验异常";
        }
        if (alrmCode == 13) {
          return "解绑失败";
        }
        if (alrmCode == 14) {
          return "查找不到信息";
        }
        if (alrmCode == 15) {
          return "此提升机已禁用,此托盘的最后路径是这个提升机。";
        }
        if (alrmCode == 16) {
          return "等待目标出口无托盘";
        }
        if (alrmCode == 17) {
          return "此托盘须往前面提升机走才能到达目的地";
        }
        if (alrmCode == 18) {
          return "此托盘无路可走，请解除不必要的禁用和终结点";
        }
        if (alrmCode == 19) {
          return "等待入机台无托盘";
        }
        if (alrmCode == 20) {
          return "WMS没有配置工位信息";
        }
        if (alrmCode == 21) {
          return "WMS检测NG分选机出口扫码位置流程报错";
        }
        if (alrmCode == 22) {
          return "WMS检测不存在业务类型数据";
        }
        if (alrmCode == 23) {
          return "WMS检测扫码位置流程报错";
        }
        if (alrmCode == 24) {
          return "WMS检测投入口无法查询对应的流程";
        }
        if (alrmCode == 25) {
          return "WMS检测没有绑定流程参数";
        }
        if (alrmCode == 26) {
          return "WMS节点数据配置异常";
        }
        if (alrmCode == 27) {
          return "WMS未配置巷道分配关联数据";
        }
        if (alrmCode == 28) {
          return "WMS未配置巷道分配关联明细数据";
        }
        if (alrmCode == 29) {
          return "WMS未配置巷道分组指针";
        }
        if (alrmCode == 30) {
          return "没有可用巷道";
        }
        if (alrmCode == 31) {
          return "WMS检测此任务状态不是执行中";
        }
        if (alrmCode == 32) {
          return "WMS绑定托盘条码与WCS传入托盘条码不符";
        }
        if (alrmCode == 33) {
          return "WMS没有配置路径数据";
        }
        if (alrmCode == 34) {
          return "WMS没有配置巷道路径数据";
        }
        if (alrmCode == 35) {
          return "WMS没有配置托盘数据";
        }
        if (alrmCode == 36) {
          return "作业托盘号与参数托盘号不一致";
        }
        if (alrmCode == 37) {
          return "WMS检测作业托盘号不符合条码规则";
        }
        if (alrmCode == 38) {
          return "WMS作业托盘号绑定的订单不存在";
        }
        if (alrmCode == 39) {
          return "WMS法找到订单绑定的电池型号";
        }
        if (alrmCode == 40) {
          return "货位已满";
        }
        if (alrmCode == 41) {
          return "此托盘未解绑";
        }
        if (alrmCode == 42) {
          return "等待提升机空闲";
        }
        if (alrmCode == 43) {
          return "不存在流程配置参数数据";
        }
        if (alrmCode == 44) {
          return "无托盘数据";
        }
        if (alrmCode == 45) {
          return " 爆仓流程没有配置货位分组关联数据";
        }

        return alrmCode;
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
}
</script>
<style lang="scss" scoped>
.Email-container {
  position: relative;

  .HSZ-common-search-box {
    margin-bottom: 0;
  }

  >>>.el-tabs__item {
    text-align: left !important;
    width: 160px !important;

    .icon-sz {
      font-size: 14px;
      margin-right: 8px;
    }

    .sz-custom {
      font-size: 12px;
      margin-right: 10px;
    }
  }

  >>>.el-tabs__content {
    height: 100%;
    // .el-tab-pane {
    //   height: 100%;
    //   overflow: hidden;
    // }
  }

  >>>#tab-line {
    height: 20px;
    width: 160px;

    &::after {
      position: absolute;
      width: 100%;
      height: 1px;
      background: #ddd;
      content: "";
      display: block;
      overflow: hidden;
      top: 10px;
      left: 0;
    }
  }

  .main {
    height: 100%;
    overflow: hidden;

    .icon-sz {
      cursor: pointer;
      font-size: 14px;

      &.img-star {
        font-size: 16px;
      }
    }

    #mountNode {
      width: 100%;
      height: 100%;
      //         position: absolute;
      // left: 0;
      // top: 0;
      // right: 0;
      // bottom: 0;
    }
  }

  #mountNode>>>.minimap {
    position: absolute;
    bottom: 5px;
    left: 5px;
    z-index: 10000;
    box-shadow: 2px -2px 5px #000;
  }
}
</style>
