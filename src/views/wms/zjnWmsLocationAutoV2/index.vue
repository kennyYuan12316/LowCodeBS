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
        <!-- <div id="mountNode" ref="mountNode"></div> -->
        <!-- <div class="tt" style="position: absolute; top: 0; right: 0">
          <img :src="require('@/assets/images/G6/tp2.png')" style="height: 80vh" />
        </div> -->
        <div class="HSZ-common-head">
          <div>
          </div>
          <div class="HSZ-common-head-right" style="">
            <el-checkbox-group v-model="test">
              <el-checkbox-button text-color="#ff0000" fill="#ff0000" :label="item" v-for="item in checkboxOptions"
                :key="item"></el-checkbox-button>
            </el-checkbox-group>
          </div>
        </div>
        <div style="padding:10px">
          <ul style="list-style:none" v-for="(layerItem, index) in layer" :index="index" :key="index">
            <el-tooltip v-for="(cellItem, index) in cell" :index="index" :key="index" effect="dark" open-delay="200"
              placement="top-start">
              <div slot="content">
                货位：{{ warehouseNo + '-' + activeTab + '-001-' + padding(cellItem, 3) + '-' + padding(layer - layerItem +
                    1, 3)
                }}
              </div>
              <li :style="{ 'background-color': color }"></li>
            </el-tooltip>
          </ul>

          <img src="@/assets/images/G6/duiduoji_green.png" alt="" style="width:50px;height:50px;margin:20px">

          <ul style="list-style:none" v-for="(layerItem, index) in layer" :index="index" :key="index">
            <el-tooltip v-for="(cellItem, index) in cell" :index="index" :key="index" effect="dark" open-delay="200"
              placement="top-start">
              <div slot="content">
                货位：{{ warehouseNo + '-' + activeTab + '-002-' + padding(cellItem, 3) + '-' + padding(layer - layerItem +
                    1, 3)
                }}
              </div>
              <li :style="{ 'background-color': color }"></li>
            </el-tooltip>
          </ul>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import request from "@/utils/request";
import ReconnectingWebSocket from 'reconnecting-websocket'

export default {
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'fullName'
      },
      test: [],
      color: '#FFF',
      colors: ['#FFF', '#F00', '#0F0', '#00F', '#000', '#FF0', '#F0F', '#0FF', '#888'],
      checkboxOptions: ['预约', '空闲', '空托', '实盘', '消防', '报警', '不可用', '锁定'],
      activeTab: '', //菜单tab
      LayerArr: [], //楼层 Layer字段自动排序 [1,2,3...]
      AisleArr: [], //巷道 AisleNo字段
      AisleNoObj: {}, //巷道 AisleNo字段{"A1":"正极","B1":"负极"}
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
      }]
    };
  },
  created() {
    this.initWebSocket();
    this.getRefer();
  },
  methods: {
    handleNodeClick(data) {
      if (data.isTree == 1) return;
      if (this.typeId === data.id) return;
      this.typeId = data.id;
      this.activeTab = data.data;
      this.graph.data({
        nodes: this.nodeListLayer[this.activeTab],
      });
      this.graph.render();
      this.getData();
    },
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
          this.configData(data.StatusList);
        }
      });
    },
    //通过库位数据自动生成库位点位 通过数据库List生成json node节点数据
    configData(data) {
      for (let i = 0; i < this.treeData.length; i++) {
        if (this.treeData[i].id == "1") {
          var left = 0; var right = 0;
          let startRow = 1;
          if (this.isStatic) {
            left = this.side.LeftSide;
            right = this.side.RightSide;
          }
          else {
            left = this.sides[0].LeftSide;
            right = this.sides[0].RightSide;
          }
          if (left == 1 && right == 2) {
            startRow = 2;
          }
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
          } else if (this.treeData[i].id == "2") {

          }
        }
      }
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

          }
        }
      })
    },
    padding(num, length) {
      for (var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;
      }
      return num;
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
