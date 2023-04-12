<template>
  <div id="echartsTree"
       style="width:100%;height:400px;margin-top:10px;"></div>
</template>

<script>

import echarts from 'echarts'
import resize from './mixins/resize'
export default {
  name: 'echartsTree',
  mixins: [resize],
  data () {
    return {
      chart: null,

    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.echartsTree = echarts.init(document.getElementById('echartsTree'))
      var data1 = {
        "name": "WCS",
        label: {
          normal: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right'
          }
        },
        "children": [
          {
            "name": "M0B",
            "children": [
              {
                "name": "正常",
                itemStyle: {
                  borderColor: '#08b41f',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          },
          {
            "name": "M0A",
            "children": [
              {
                "name": "故障",
                itemStyle: {
                  borderColor: '#b40808',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          },
          {
            "name": "M1A",
            "children": [
              {
                "name": "暂停",
                itemStyle: {
                  borderColor: '#333',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          },
          {
            "name": "M1C",
            "children": [
              {
                "name": "正常",
                itemStyle: {
                  borderColor: '#08b41f',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          },
          {
            "name": "M2A",
            "children": [
              {
                "name": "正常",
                itemStyle: {
                  borderColor: '#08b41f',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          },
          {
            "name": "AGV",
            "children": [
              {
                "name": "正常",
                itemStyle: {
                  borderColor: '#08b41f',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          }
        ]
      };
      var data2 = {
        "name": "WMS",
        label: {
          normal: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right'
          }
        },
        "children": [
          {
            "name": "LES",
            "children": [
              {
                "name": "故障",
                itemStyle: {
                  borderColor: '#b40808',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          },
          {
            "name": "MES",
            "children": [
              {
                "name": "正常",
                itemStyle: {
                  borderColor: '#08b41f',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          },
          {
            "name": "斯坦德",
            "children": [
              {
                "name": "正常",
                itemStyle: {
                  borderColor: '#08b41f',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          },
          {
            "name": "新松",
            "children": [
              {
                "name": "正常",
                itemStyle: {
                  borderColor: '#08b41f',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          },
          {
            "name": "WCS",
            "children": [
              {
                "name": "正常",
                itemStyle: {
                  borderColor: '#08b41f',
                  borderWidth: 4
                },
                "value": 4516
              }
            ]
          }
        ]
      };
      var option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        legend: {
          top: '2%',
          left: '3%',
          orient: 'vertical',
          // data: [{
          //   name: '植物界',
          //   icon: 'rectangle'
          // },
          // {
          //   name: '管理系统',
          //   icon: 'rectangle'
          // }],
          borderColor: '#c23531'
        },
        series: [
          {
            type: 'tree',
            // name: '植物界',
            data: [data1],
            top: '5%',
            left: '7%',
            bottom: '2%',
            right: '60%',
            symbolSize: 7,
            label: {
              normal: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          },
          {
            type: 'tree',
            // name: '管理系统',
            data: [data2],
            top: '20%',
            left: '60%',
            bottom: '22%',
            right: '18%',
            symbolSize: 7,
            label: {
              normal: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      };
      this.echartsTree.setOption(option)
    }
  }
}
</script>
