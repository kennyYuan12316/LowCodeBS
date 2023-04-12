<template>
  <div class="dashboard-editor-container">
    <panel-group />

    <el-row :gutter="10" class="echart">
      <el-col :span="12">
        <div class="echart_left">
          <bar-chart />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="echart_right">
          <pie-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col :span="12" class="echart">
        <div class="echart_left">
          <tree-chart />
        </div>
      </el-col>
      <el-col :span="12" class="notice">
        <div class="notice_left">
          <div class="notice_title">
            <div class="title_left">
              <span>消息</span>
            </div>
            <div class="title_right">
              查看更多 >
            </div>
          </div>
          <div class="no_left_massage">
            <ul>
              <li v-for="(item,index) in massageList" :key="index">
                <p class="com-hover">{{item.title}}</p>
                <span class="time">{{item.listDate}}</span>
              </li>
            </ul>
          </div>
        </div>
      </el-col>
    </el-row>
    <p class="componey">{{sysConfig.copyright}}</p>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import PanelGroup from './components/PanelGroup'
  import BarChart from './components/BarChart'
  import PieChart from './components/PieChart'
  import TreeChart from './components/TreeChart'
  import CountTo from 'vue-count-to'
  export default {
    name: 'DashboardAdmin',
    components: {
      PanelGroup,
      BarChart,
      PieChart,
      TreeChart,
      CountTo
    },
    data() {
      return {
        value1: '',
        charts: '',
        opinionData: ["3", "2", "4", "4", "5"],
        massageList: [{
            title: '【错误】M0A设备故障',
            listDate: '2022-08-10'
          },
          {
            title: '【错误】LES系统连接异常',
            listDate: '2022-08-10'
          },
          {
            title: '【异常】监控功能启动失败',
            listDate: '2022-08-10'
          },
          {
            title: '【异常】MOA的WCS系统停止',
            listDate: '2022-08-10'
          },
        ]
      }
    },
    computed: {
      sysConfig() {
        return this.$store.state.settings.sysConfig
      }
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .sale {
    background: #fff;
    margin-bottom: 10px;
    border-radius: 4px;

    .sale_title {
      padding-top: 16px;
      padding-left: 22px;

      span {
        &:first-child {
          font-size: 16px;
          font-weight: bold;
          color: #333;
          margin-right: 10px;
        }

        &:nth-child(2) {
          color: #999;
          font-size: 12px;
        }
      }
    }

    .sale_items {
      display: flex;
      justify-content: space-around;
      padding: 34px 0;

      li {
        display: flex;
        flex-direction: column;
        text-align: center;

        .nums {
          font-size: 26px !important;
          padding-top: 13px;
          padding-bottom: 9px;
          color: #1890ff;
          font-weight: 600;

          span {
            font-size: 26px !important;
            padding-top: 13px;
            padding-bottom: 9px;
            color: #1890ff !important;
            font-weight: 600;
          }
        }

        .lastnums {
          font-size: 26px !important;
          padding-top: 13px;
          padding-bottom: 9px;
          font-weight: 600;
          color: #333;
        }

        &:first-child {
          span:last-child {
            color: #08b41f;
          }
        }

        &:nth-child(4) {
          span {
            &:last-child {
              color: #08b41f;
            }
          }
        }

        &:nth-child(2) {
          span {
            &:last-child {
              color: #b40808;
            }
          }
        }

        &:nth-child(3) {
          span {
            &:last-child {
              color: #999;
            }
          }
        }

        &:last-child {
          span {
            &:last-child {
              color: #000;
            }
          }
        }

        span {
          &:nth-child(2) {
            font-size: 26px !important;
            padding-top: 13px;
            padding-bottom: 9px;
            color: #1890ff;
            font-weight: 600;
          }

          &:nth-child(3) {
            font-size: 12px;
          }
        }
      }
    }
  }

  .notice {
    padding-bottom: 20px;

    .notice_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      padding: 0 25px;

      .title_left {
        display: flex;
        align-items: center;

        span {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
      }

      .title_right {
        font-size: 12px;
        color: #999;
        line-height: 30px;
      }
    }

    .notice_right {
      background: #fff;
      height: 400px;
      border-radius: 4px;
      overflow: hidden;

      .no_right_massage {
        li {
          display: flex;
          background: #fff;
          border: 1;
          height: 170px;
          border-top: 1px solid #f2f2f5;

          .right_item {
            width: 50%;
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .right-top {
              font-size: 14px;
              display: flex;
              align-items: center;

              img {
                margin-right: 10px;
              }
            }

            p {
              font-size: 14px;
              line-height: 22px;
              padding: 20px 0;
              color: #999;
              display: -webkit-box;
              line-clamp: 3;
              -webkit-line-clamp: 3;
              overflow: hidden;
              text-overflow: ellipsis;
              /*! autoprefixer: off */
              -webkit-box-orient: vertical;
              /* autoprefixer: on */
            }

            .bt {
              display: flex;
              justify-content: space-between;
              font-size: 12px;
              color: #999;
            }
          }

          .linet {
            border-left: 1px solid #f2f2f5;
          }
        }
      }
    }

    .notice_left {
      background: #fff;
      height: 400px;
      border-radius: 4px;
      overflow: hidden;

      .no_left_massage {
        height: 340px;
        padding: 10px 20px;
        border-top: 1px solid #f2f2f5;

        ul {
          li {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #303133;
            padding: 10px 0;
            cursor: pointer;

            p {
              width: calc(100% - 80px);
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .time {
              width: 80px;
              display: inline-block;
              text-align: right;
              color: #999999;
            }
          }
        }
      }
    }
  }

  .echart {
    padding-bottom: 10px;

    .echart_left {
      background: #fff;
      height: 400px;
      border-radius: 4px;
      overflow: hidden;
    }

    .echart_right {
      background: #fff;
      height: 400px;
      border-radius: 4px;
      overflow: hidden;
    }
  }

  .componey {
    font-size: 14px;
    text-align: center;
    color: #999;
    padding-bottom: 10px;
  }

  .dashboard-editor-container {
    background-color: #ebeef5;
    position: relative;
    width: 100%;
    overflow: hidden;

    .github-corner {
      position: absolute;
      top: 0px;
      border: 0;
      right: 0;
    }

    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 20px;
    }
  }

  .dateSelect {
    position: absolute;
    // right: 150px;
    left: 20%;
    top: 25px;
    z-index: 100;

    .el-date-editor {
      width: 160px;
    }
  }

  // @media (max-width: 1024px) {
  //   .chart-wrapper {
  //     padding: 8px;
  //   }
  // }
</style>
