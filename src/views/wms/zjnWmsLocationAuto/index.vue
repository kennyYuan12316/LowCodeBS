<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-left">
      <div class="HSZ-common-title">
        <h2>监控分类</h2>
      </div>
      <el-scrollbar class="HSZ-common-el-tree-scrollbar" v-loading="treeLoading"
        :element-loading-text="$t('common.loadingText')">
        <el-tree ref="treeBox" :data="treeData" :props="defaultProps" default-expand-all highlight-current
          :expand-on-click-node="false" node-key="id" @node-click="handleNodeClick" class="HSZ-common-el-tree"
          :current-node-key="typeId">
          <span class="custom-tree-node" slot-scope="{ node }">
            <i class="el-icon-notebook-2" />
            <span class="text">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-scrollbar>
    </div>
    <div class="HSZ-common-layout-center">
      <div class="main HSZ-common-layout-main HSZ-flex-main" style="overflow:auto">
        <div id="mountNode" ref="mountNode"></div>
        <div class="tt" style="position: absolute; top: 0; right: 0">
          <img :src="require('@/assets/images/G6/tp2.png')" style="height: 80vh" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
import G6 from "@antv/g6";
import ReconnectingWebSocket from 'reconnecting-websocket'

export default {
  // name: 'extend-email',
  // components: { Config, Form, Detail },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      activeTab: '', //菜单tab
      LayerArr: [], //楼层 Layer字段自动排序 [1,2,3...]
      AisleArr: [], //巷道 AisleNo字段
      AisleNoObj: {}, //巷道 AisleNo字段{"A1":"正极","B1":"负极"}
      graph: undefined, //G6图形编辑实例
      nodeList: [],
      nodeListLayer: {},
      typeId: 'A1',
      warehouseNo: '',
      row: 0,
      cell: 0,
      layer: 0,
      isStatic: true,
      side: {},
      sides: [],
      treeLoading: false,
      treeData: [{
        fullName: "按巷道监控",
        children: [],
        id: "1",
        isTree: 1,
        data: ''
      }
        // {
        //   fullName: "按层监控",
        //   children: [],
        //   id: "2",
        //   isTree: 1,
        //   data: ''
        // }
      ]
    };
  },
  created() {
    this.initWebSocket();
    this.getRefer();
  },
  mounted() {
    this.initG6();
  },
  methods: {
    handleNodeClick(data) {
      if (data.isTree == 1) return;
      if (this.typeId === data.id) return;
      this.typeId = data.id;
      this.activeTab = data.data;
      this.getData(data.data);
      // this.graph.data({
      //   nodes: this.nodeListLayer[this.activeTab],
      // });
      // this.graph.render();

    },
    //初始化G6
    initG6() {
      //提示框
      const tooltip = new G6.Tooltip({
        offsetX: -300,
        offsetY: 30,
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
        itemTypes: ["node"],
      });
      //缩略图
      const minimap = new G6.Minimap({
        size: [180, 100],
        className: "minimap",

        type: "delegate",
      });

      const mountNodeHeight = this.$refs.mountNode.clientHeight;
      const mountNodeWidth = this.$refs.mountNode.clientWidth;
      // console.log(mountNodeHeight, mountNodeWidth);
      this.graph = new G6.Graph({
        container: "mountNode", // 指定图画布的容器 id，与第 9 行的容器对应
        fitView: true,
        fitViewPadding: [50, 150, 100, -100], //上，右，下，左
        // enabledStack: true,
        // 画布宽高
        width: mountNodeWidth,
        height: mountNodeHeight,
        modes: {
          default: ["drag-canvas", "zoom-canvas"],
        },
        plugins: [tooltip, minimap],
        animate: false,
      });
    },
    configData(data) {
      for (let i = 0; i < this.treeData.length; i++) {
        let x = 100;
        let y = 100;
        var left = 0; var right = 0;
        let startRow = 1;
        if (this.isStatic) {
          left = this.side.LeftSide;
          right = this.side.RightSide;
        }
        else {
          left = this.sides[this.activeTab].LeftSide;
          right = this.sides[this.activeTab].RightSide;
        }
        if (left == 1) {
          startRow = 2;
        }
        console.log(data);
        if (this.treeData[i].id == "1") {
          this.nodeList = [];
          // console.log(this.treeData);
          for (let k = 0; k < left; k++) {
            for (let i = this.layer; i > 0; i--) {
              for (let j = 1; j <= this.cell; j++) {
                var locationNo = this.warehouseNo + '-' + this.activeTab + '-' + this.padding(startRow, 3) + '-' + this.padding(j, 3) + '-' + this.padding(i, 3);
                if (this.warehouseNo == "ZHWH-W1" && i <= 3) {
                  var hw = {
                    station: locationNo,
                    class: "hw",
                    data: null,
                    x: j * 120 + x - 30,
                    y: y,
                    id: "node" + "hw" + locationNo,
                    img: require("@/assets/images/G6/hwState" + data[locationNo] + ".png"),
                    type: "image",
                    size: [120, 80],
                    label: "",
                    labelCfg: {
                      position: "bottom",
                    },
                    // 裁剪图片配置
                    // clipCfg: {
                    //   show: false,
                    //   type: "circle",
                    //   r: 15,
                    // },
                  };
                  this.nodeList.push(hw);
                  if (j == this.cell / 2) {
                    j = this.cell + 1
                  }
                }
                else {
                  var hw = {
                    station: locationNo,
                    class: "hw",
                    data: null,
                    x: j * 60 + x,
                    y: y,
                    id: "node" + "hw" + locationNo,
                    img: require("@/assets/images/G6/hwState" + data[locationNo] + ".png"),
                    type: "image",
                    size: [60, 80],
                    label: "",
                    labelCfg: {
                      position: "bottom",
                    },
                    // 裁剪图片配置
                    // clipCfg: {
                    //   show: false,
                    //   type: "circle",
                    //   r: 15,
                    // },
                  };
                  this.nodeList.push(hw);
                }
              }

              y += 80;
            }
            startRow++;
            y += 40;
          }
          var sc = {
            class: "sc",
            station: null,
            data: null,
            x: 100 + 60,
            y: y,
            id: "node" + "sc",
            img: require("@/assets/images/G6/duiduoji_bai.png"),
            type: "image",
            size: 110,
            label: "堆垛机",
            labelCfg: {
              position: "bottom",
            },
            // 裁剪图片配置
            clipCfg: {
              show: false,
              type: "circle",
              r: 15,
            },
          };
          this.nodeList.push(sc);
          y += 160;
          for (let k = 0; k < right; k++) {
            for (let i = this.layer; i > 0; i--) {
              for (let j = 1; j <= this.cell; j++) {
                var locationNo = this.warehouseNo + '-' + this.activeTab + '-' + this.padding(startRow, 3) + '-' + this.padding(j, 3) + '-' + this.padding(i, 3);
                if (this.warehouseNo == "ZHWH-W1" && i <= 3) {
                  var hw = {
                    station: locationNo,
                    class: "hw",
                    data: null,
                    x: j * 120 + x - 30,
                    y: y,
                    id: "node" + "hw" + locationNo,
                    img: require("@/assets/images/G6/hwState" + data[locationNo] + ".png"),
                    type: "image",
                    size: [120, 80],
                    label: "",
                    labelCfg: {
                      position: "bottom",
                    },
                    // 裁剪图片配置
                    // clipCfg: {
                    //   show: false,
                    //   type: "circle",
                    //   r: 15,
                    // },
                  };
                  this.nodeList.push(hw);
                  if (j == this.cell / 2) {
                    j = this.cell + 1
                  }
                }
                else {
                  var hw = {
                    station: locationNo,
                    class: "hw",
                    data: null,
                    x: j * 60 + x,
                    y: y,
                    id: "node" + "hw" + locationNo,
                    img: require("@/assets/images/G6/hwState" + data[locationNo] + ".png"),
                    type: "image",
                    size: [60, 80],
                    label: "",
                    labelCfg: {
                      position: "bottom",
                    },
                    // 裁剪图片配置
                    // clipCfg: {
                    //   show: false,
                    //   type: "circle",
                    //   r: 15,
                    // },
                  };
                  this.nodeList.push(hw);
                }
              }
              y += 80;
            }
            startRow++;
            y += 40;
          }
          this.graph.data({ nodes: this.nodeList });
          this.graph.render();
          this.graph.setAutoPaint(true);
        }
        else if (this.treeData[i].id == "2") {
          // if (this.isStatic) {
          //   for (let i = 0; i < this.AisleArr.length; i++) {
          //     for (let j = 0; j < left; j++) {
          //       for (let k = 0; k < this.cell; i++) {

          //       }
          //     }
          //     y+=80;
          //   }
          // }
        }
      }
    },
    //通过库位数据自动生成库位点位 通过数据库List生成json node节点数据
    // configData(data) {
    //   for (let i = 0; i < this.treeData.length; i++) {
    //     if (this.treeData[i].id == "1") {
    //       // 创建 楼层数据 去重
    //       const AisleSet = new Set();
    //       const AisleData = {};
    //       for (let index = 0; index < data.length; index++) {
    //         AisleSet.add(data[index].AisleNo);
    //         if (!AisleData[data[index].AisleNo]) {
    //           AisleData[data[index].AisleNo] = [];
    //         }
    //         AisleData[data[index].AisleNo].push(data[index]);
    //       }
    //       this.AisleArr = Array.from(AisleSet);
    //       for (let index = 0; index < this.AisleArr.length; index++) {
    //         this.treeData[0].children.push({
    //           fullName: this.AisleArr[index] + "巷道",
    //           children: null,
    //           id: "A" + index,
    //           isTree: 0,
    //           data: this.AisleArr[index]
    //         });
    //       }

    //       for (let index = 0; index < this.AisleArr.length; index++) {
    //         var nodeList = [];
    //         let AisleOneData = AisleData[this.AisleArr[index]];
    //         let AisleOneRowObj = {};
    //         for (let index = 0; index < AisleOneData.length; index++) {
    //           if (!AisleOneRowObj[AisleOneData[index].Row]) {
    //             AisleOneRowObj[AisleOneData[index].Row] = [];
    //           }
    //           AisleOneRowObj[AisleOneData[index].Row].push(
    //             AisleOneData[index]
    //           );
    //         }
    //         let x = 100;
    //         let y = 100;
    //         let maxLayer = 10;
    //         let stacker = false;
    //         let flag = false;
    //         let rows = Object.keys(AisleOneRowObj);
    //         rows.forEach((key, index) => {
    //           stacker = false;
    //           for (let i = 0; i < AisleOneRowObj[key].length; i++) {
    //             let model = AisleOneRowObj[key][i];
    //             if (!flag && model.Depth == 0) {
    //               stacker = true;
    //               flag = true;
    //             }

    //             //货位
    //             var hw = {
    //               station: model.LocationNo,
    //               class: "hw",
    //               data: null,
    //               x: model.Cell * 60 + x,
    //               y: (maxLayer - model.Layer) * 80 + y,
    //               id: "node" + "hw" + model.LocationNo,
    //               img: require("@/assets/images/G6/hj.png"),
    //               type: "image",
    //               size: [60, 80],
    //               label: "",
    //               labelCfg: {
    //                 position: "bottom",
    //               },
    //               // 裁剪图片配置
    //               clipCfg: {
    //                 show: false,
    //                 type: "circle",
    //                 r: 15,
    //               },
    //             };
    //             nodeList.push(hw);
    //           }
    //           if (stacker) {
    //             //堆垛机duiduoji_bai
    //             var sc = {
    //               class: "sc",
    //               station: null,
    //               data: null,
    //               x: 100 + 60,
    //               y: y + maxLayer * 80 + 30,
    //               id: "node" + "sc",
    //               img: require("@/assets/images/G6/duiduoji_bai.png"),
    //               type: "image",
    //               size: 110,
    //               label: "堆垛机",
    //               labelCfg: {
    //                 position: "bottom",
    //               },
    //               // 裁剪图片配置
    //               clipCfg: {
    //                 show: false,
    //                 type: "circle",
    //                 r: 15,
    //               },
    //             };
    //             nodeList.push(sc);
    //           }
    //           y += (maxLayer + (stacker ? 1 : 0)) * 80 + 50;
    //         });

    //         if (!this.nodeListLayer[this.AisleArr[index]]) {
    //           this.nodeListLayer[this.AisleArr[index]] = [];
    //         }
    //         this.nodeListLayer[this.AisleArr[index]] = nodeList;
    //       }
    //       let graphData = {
    //         nodes: this.nodeListLayer[this.activeTab],
    //       };

    //       this.graph.data(graphData);
    //       this.graph.render();
    //     } else if (this.treeData[i].id == "2") {
    //       // 创建 楼层数据 去重
    //       const LayerSet = new Set();
    //       const LayerData = {};
    //       for (let index = 0; index < data.length; index++) {
    //         LayerSet.add(data[index].Layer);
    //         if (!LayerData[data[index].Layer]) {
    //           LayerData[data[index].Layer] = [];
    //         }
    //         LayerData[data[index].Layer].push(data[index]);
    //         this.AisleNoObj[data[index].AisleNo] = data[index].Description;
    //       }
    //       this.LayerArr = Array.from(LayerSet).sort((a, b) => b - a);
    //       for (let index = 0; index < this.LayerArr.length; index++) {
    //         this.treeData[1].children.push({
    //           fullName: "第" + this.LayerArr[index] + "层",
    //           children: null,
    //           id: "L" + index,
    //           isTree: 0,
    //           data: this.LayerArr[index]
    //         });
    //       }

    //       for (let index = 0; index < this.LayerArr.length; index++) {
    //         var nodeList = [];
    //         let LayerOneData = LayerData[this.LayerArr[index]];
    //         let LayerOneAisleObj = {};
    //         for (let index = 0; index < LayerOneData.length; index++) {
    //           if (!LayerOneAisleObj[LayerOneData[index].AisleNo]) {
    //             LayerOneAisleObj[LayerOneData[index].AisleNo] = [];
    //           }
    //           LayerOneAisleObj[LayerOneData[index].AisleNo].push(
    //             LayerOneData[index]
    //           );
    //         }
    //         let x = 100;
    //         let y = 100;
    //         let maxRow = 0;
    //         let rowCon = 0;
    //         let upCon = 0;

    //         Object.keys(LayerOneAisleObj).forEach((key, index) => {
    //           if (maxRow != 0) {
    //             y += (rowCon + 2) * 80 + 50;
    //           }
    //           maxRow = key[0] == 'B' ? 0 : 9;
    //           rowCon = 0;
    //           upCon = 0;
    //           let calyArr = {};
    //           let isDown = false;
    //           for (let i = 0; i < LayerOneAisleObj[key].length; i++) {
    //             let model = LayerOneAisleObj[key][i];
    //             if (key[0] == 'B') {
    //               if (model.Row > maxRow) {
    //                 calyArr[model.Row] = isDown ? rowCon + 2 : rowCon;
    //                 if (model.Depth == 0) {
    //                   isDown = true;
    //                 }
    //                 maxRow = model.Row;
    //                 rowCon++;
    //                 if (!isDown) {
    //                   upCon++
    //                 }
    //               }
    //             } else {
    //               if (model.Row < maxRow) {
    //                 calyArr[model.Row] = isDown ? rowCon + 2 : rowCon;
    //                 if (model.Depth == 0) {
    //                   isDown = true;
    //                 }
    //                 maxRow = model.Row;
    //                 rowCon++;
    //                 if (!isDown) {
    //                   upCon++
    //                 }
    //               }
    //             }

    //             //货位
    //             var hw = {
    //               station: model.LocationNo,
    //               class: "hw",
    //               data: null,
    //               x: key[0] == 'B' ? model.Cell * 60 + x : (67 - model.Cell) * 60 + x,
    //               y: calyArr[model.Row] * 80 + y,
    //               id: "node" + "hw" + model.LocationNo,
    //               img: require("@/assets/images/G6/hj.png"),
    //               type: "image",
    //               size: [60, 80],
    //               label: "",
    //               labelCfg: {
    //                 position: "bottom",
    //               },
    //               // 裁剪图片配置
    //               clipCfg: {
    //                 show: false,
    //                 type: "circle",
    //                 r: 15,
    //               },
    //             };
    //             nodeList.push(hw);
    //           }
    //           //标签
    //           var lb = {
    //             class: "lb",
    //             data: null,
    //             x: -100,
    //             y: y + (upCon + 1) * 80 + 30,
    //             id: "node" + "lb" + Math.ceil(Math.random() * 100000),

    //             type: "rect",
    //             label: this.AisleNoObj[key],
    //             style: {
    //               fill: "#bae63700",
    //               //stroke: '#eaff8f',
    //               lineWidth: 0,
    //               // radius: 10,
    //             },
    //             labelCfg: {
    //               style: {
    //                 fill: "#3c3c3c",
    //                 fontSize: 30,
    //               },
    //               position: "center",
    //             },
    //           };
    //           //堆垛机duiduoji_bai
    //           var sc = {
    //             class: "sc",
    //             station: null,
    //             data: null,
    //             x: key[0] == 'B' ? 100 + 60 : 100 + 66 * 60,
    //             y: y + (upCon + 1) * 80 + 30,
    //             id: "node" + "sc" + Math.ceil(Math.random() * 100000),
    //             img: require("@/assets/images/G6/duiduoji_bai.png"),
    //             type: "image",
    //             size: 110,
    //             label: "堆垛机",
    //             labelCfg: {
    //               position: "bottom",
    //             },
    //             // 裁剪图片配置
    //             clipCfg: {
    //               show: false,
    //               type: "circle",
    //               r: 15,
    //             },
    //           };
    //           nodeList.push(sc);
    //           nodeList.push(lb);
    //         });

    //         if (!this.nodeListLayer[this.LayerArr[index]]) {
    //           this.nodeListLayer[this.LayerArr[index]] = [];
    //         }
    //         this.nodeListLayer[this.LayerArr[index]] = nodeList;
    //       }
    //       let graphData = {
    //         nodes: this.nodeListLayer[this.activeTab],
    //       };
    //       // console.log(this.graph);

    //       this.graph.data(graphData);
    //       this.graph.render();
    //       // for (let it of this.graph.getNodes()) {
    //       //   console.log(it.getModel());
    //       // }
    //     }
    //   }
    // },
    getRefer() {
      request({
        url: `/api/wms/ZjnWmsLocationAuto/refer`,
        method: "GET",
        data: {}
      }).then((res) => {
        if (res.data) {
          var data = res.data;
          this.warehouseNo = data.WarehouseNo;
          this.activeTab = data.AisleNo;
          this.AisleArr = data.AisleNos;
          this.row = data.Row;
          this.cell = data.Cell;
          this.layer = data.Layer;
          this.isStatic = data.IsStatic;
          this.side = data.Side;
          this.sides = data.Sides;
          for (let i = 0; i < this.treeData.length; i++) {
            if (this.treeData[i].id == "1") {
              for (let a = 0; a < this.AisleArr.length; a++) {
                this.treeData[i].children.push({
                  fullName: this.AisleArr[a] + "巷道",
                  children: null,
                  id: "A" + (this.AisleArr.length - a),
                  isTree: 0,
                  data: this.AisleArr[a]
                });
              }
            }
            else if (this.treeData[i].id == "2") {
              for (let a = this.layer; a > 0; a--) {
                this.treeData[i].children.push({
                  fullName: "第" + a + "层",
                  children: null,
                  id: "L" + a,
                  isTree: 0,
                  data: a
                });
              }
            }
          }
          this.configData(data.StatusList);
        }
      });
    },
    //定时器事件
    getData() {
      request({
        url: `/api/wms/ZjnWmsLocationAuto/GetList`,
        method: "GET",
        data: this.typeId[0] == 'A' ? {
          aisleNo: this.activeTab
        } : {
          id: Number(this.activeTab)
        }
      }).then((res) => {
        //res.data
        if (res.data) {
          if (this.isStatic) {
            for (let i = 0; i < this.nodeList.length; i++) {
              var station = this.nodeList[i]["station"];
              if (station != null) {
                this.nodeList[i]["station"] = this.warehouseNo + '-' + this.activeTab + station.substr(station.length - 12);
                var status = res.data[this.nodeList[i]["station"]];
                if (status) {
                  this.nodeList[i]["img"] = require("@/assets/images/G6/hwState" + status + ".png")
                }
              }
            }
            this.graph.render();
          }
          else {
            this.configData(res.data);
          }

          // for (let item of res.data) {
          //   var id = item.LocationNo;
          //   for (let it of this.graph.getNodes()) {
          //     //console.log(graph.getNodes()[1].getModel())
          //     if (it.getModel().station == id.trim()) {
          //       if (it.getModel().class == "hw") {
          //         // console.log(it.getModel());
          //         //0空 1满 2未满 3故障 4火警 5静置中 6静置完成 7预约 8禁用
          //         this.updateImg(it, Number(item.LocationStatus));
          //       }
          //     }
          //   }
          // }
        }
      });
    },
    padding(num, length) {
      for (var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;
      }
      return num;
    },
    updateImg(it, index) {
      let imgurl = require("@/assets/images/G6/hwState" + index + ".png");
      if (it.getModel().img.trim() != imgurl) {
        this.graph.setAutoPaint(false);
        it.update({
          img: imgurl
        });
        //  graph.paint();
        this.graph.refreshItem(it);
        this.graph.setAutoPaint(true);
      }
    },
    initWebSocket() {
      this.socket = this.$store.getters.socket || null
      if ('WebSocket' in window) {
        console.log("socket init");
        if (!this.socket) {
          this.socket = new ReconnectingWebSocket(this.define.WebSocketUrl)
          this.$store.commit('user/SET_SOCKET', this.socket)
        }
        //添加事件监听
        let socket = this.socket
        socket.onopen = () => {
          console.log("socket connected");
          var onConnection = {
            "method": "OnConnection",
            "token": this.$store.getters.token,
            "mobileDevice": false
          }
          socket.send(JSON.stringify(onConnection))
        }
        socket.onmessage = (event) => {
          console.log("socket received");
          let data = JSON.parse(event.data)
          console.log(data);
          if (data.method == 'locationStatusChanged') {
            let imgurl = require("@/assets/images/G6/hwState" + data.status + ".png");
            let node = this.graph.find('node', (node) => {
              return node.getModel().station == data.locationNo
            })
            node.update({
              img: imgurl
            });
            this.graph.refreshItem(node);
            this.graph.setAutoPaint(true);
          }
        }
      }
    },
  }
  // beforeDestroy() {
  //   clearInterval(this.timer);
  // },
};
</script>
<style lang="scss" scoped>
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
    position: relative;
  }
}

#mountNode>>>.minimap {
  position: absolute;
  bottom: 5px;
  left: 5px;
  z-index: 10000;
  box-shadow: 2px -2px 5px #000;
}


ul {
  height: 40px;
}

ul li {
  width: 30px;
  height: 30px;
  padding: 10px;
  display: inline;
  border: 1px #ccc solid;
}
</style>
