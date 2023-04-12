<template>
  <div class="app-container Email-container nohead">
    <el-tabs tab-position="left" style="height: 100%" v-model="activeTab">
      <el-tab-pane :name="item.toString()" v-for="(item, index) in AisleArr" :key="index">
        <span slot="label"><i class="icon-sz el-icon-box"></i>{{ item }}巷道</span>
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
  // name: 'extend-email',
  // components: { Config, Form, Detail },
  data() {
    return {
      activeTab: "B1", //菜单tab
      AisleArr: [], //巷道 AisleNo字段
      lacationList: [], //仓库所有数据
      graph: undefined, //G6图形编辑实例
      timer: undefined, //定时器
      timeNumber: 1000 * 5,//1000=1秒
      nodeListLayer: {}, //json数据，每一层的节点数据 调用 nodeListLayer["1"] 第一层
      // hwImg : [
      //   require()"/images/hwState0.png",
      //   "/images/hwState1.png",
      //   "/images/hwState2.png",
      //   "/images/hwState3.png",
      //   "/images/hwState4.png",
      //   "/images/hwState5.png",
      //   "/images/hwState6.png",
      //   "/images/hwState7.png",
      //   "/images/hwState8.png",
      //   ]
    };
  },
  watch: {
    activeTab(val) {
      this.reset();
    },
  },
  created() {
    this.initWebSocket();
  },
  mounted() {
    this.initG6();
    request({
      url: `/api/wms/ZjnWmsLocationAuto/GetList`,
      method: "GET",
      data: { id: 0 },
    }).then((res) => {
      this.lacationList = res;
      this.configData(res.data);
      this.getData();
      // this.timer = setInterval(this.getData, this.timeNumber); //一分钟
    });
  },
  methods: {
    //切换楼层
    reset() {
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
        offsetX: 20,
        offsetY: -50,
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
    //通过库位数据自动生成库位点位 通过数据库List生成json node节点数据
    configData(data) {
      // 创建 楼层数据 去重
      const AisleSet = new Set();
      const AisleData = {};
      for (let index = 0; index < data.length; index++) {
        AisleSet.add(data[index].AisleNo);
        if (!AisleData[data[index].AisleNo]) {
          AisleData[data[index].AisleNo] = [];
        }
        AisleData[data[index].AisleNo].push(data[index]);
      }
      this.AisleArr = Array.from(AisleSet);

      for (let index = 0; index < this.AisleArr.length; index++) {
        var nodeList = [];
        let AisleOneData = AisleData[this.AisleArr[index]];
        let AisleOneRowObj = {};
        for (let index = 0; index < AisleOneData.length; index++) {
          if (!AisleOneRowObj[AisleOneData[index].Row]) {
            AisleOneRowObj[AisleOneData[index].Row] = [];
          }
          AisleOneRowObj[AisleOneData[index].Row].push(
            AisleOneData[index]
          );
        }
        let x = 100;
        let y = 100;
        let maxLayer = 10;
        let stacker = false;
        let flag = false;
        let rows = Object.keys(AisleOneRowObj);
        rows.forEach((key, index) => {
          stacker = false;
          for (let i = 0; i < AisleOneRowObj[key].length; i++) {
            let model = AisleOneRowObj[key][i];
            if (!flag && model.Depth == 0) {
              stacker = true;
              flag = true;
            }

            //货位
            var hw = {
              station: model.LocationNo,
              class: "hw",
              data: null,
              x: model.Cell * 60 + x,
              y: (maxLayer - model.Layer) * 80 + y,
              id: "node" + "hw" + model.LocationNo,
              img: require("@/assets/images/G6/hj.png"),
              type: "image",
              size: [60, 80],
              label: "",
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
            nodeList.push(hw);
          }
          if (stacker) {
            //堆垛机duiduoji_bai
            var sc = {
              class: "sc",
              station: null,
              data: null,
              x: 100 + 60,
              y: y + maxLayer * 80 + 30,
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
            nodeList.push(sc);
          }
          y += (maxLayer + (stacker ? 1 : 0)) * 80 + 50;
        });

        if (!this.nodeListLayer[this.AisleArr[index]]) {
          this.nodeListLayer[this.AisleArr[index]] = [];
        }
        this.nodeListLayer[this.AisleArr[index]] = nodeList;
      }
      let graphData = {
        nodes: this.nodeListLayer[this.activeTab],
      };

      this.graph.data(graphData);
      this.graph.render();
    },
    //定时器事件
    getData() {
      request({
        url: `/api/wms/ZjnWmsLocationAuto/GetList`,
        method: "GET",
        data: { aisleNo: this.activeTab },
      }).then((res) => {
        //res.data
        if (res.data) {
          // console.log(res.data);
          for (let item of res.data) {
            var id = item.LocationNo;

            for (let it of this.graph.getNodes()) {
              //console.log(graph.getNodes()[1].getModel())

              if (it.getModel().station == id.trim()) {
                if (it.getModel().class == "hw") {

                  //0空 1满 2未满 3故障 4火警 5静置中 6静置完成 7预约 8禁用
                  this.updateImg(it, Number(item.LocationStatus));
                }
              }
            }
          }
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
            "method": "OnConnection", "token": this.$store.getters.token, "mobileDevice": false
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
            node.update({ img: imgurl });
            this.graph.refreshItem(node);
            this.graph.setAutoPaint(true);
          }
        }
      }
    },
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
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
