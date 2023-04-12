<template>
  <div id="echartsBar"
       style="width:100%;height:370px;margin-top:10px;"></div>
</template>

<script>

import echarts from 'echarts'
import resize from './mixins/resize'
export default {
  name: 'echartsBar',
  mixins: [resize],
  data () {
    return {
      chart: null,
      option: {
        title: {
          text: '近12天出入库数量统计',
          textStyle: {
            //文字颜色
            color: '#1890ff',
            //字体风格,'normal','italic','oblique'
            // fontStyle: 'normal',
            //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
            // fontWeight: 'bold',
            //字体系列
            // fontFamily: 'sans-serif',
            //字体大小
            fontSize: 13
          }
        },
        tooltip: {
          // show: true, // 是否显示
          trigger: 'axis',
          // confine: true, // 是否将 tooltip 框限制在图表的区域内。
          // axis: 'auto', // 指示器的坐标轴。 
          // snap: true, // 坐标轴指示器是否自动吸附到点上
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'line'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['入库量', '出库量']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: get_date(11),
            name: '日期',//坐标轴名称
            splitLine: {
              show: true//是否显示分隔线。默认数值轴显示，类目轴不显示。
            },
            nameGap: 1//坐标轴名称与轴线之间的距离。
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数量',
            splitLine: {
              show: true//是否显示分隔线。默认数值轴显示，类目轴不显示。
            },
            nameGap: 15,
            axisTick: {
              inside: true
            }
          }
        ],
        series: [
          {
            type: 'line',//线条
            name: '入库量',//系列名称，用于tooltip的显示
            data: [200, 578, 123, 500, 455, 787, 333, 900, 2000, 145, 321, 600],
            symbol: 'circle',//标记的类型：圆圈
            itemStyle: {
              normal: {
                shadowBlur: 50,//文字块的背景阴影长度。
                shadowColor: 'green',//文字块的背景阴影颜色。
                color: 'green',//图形的颜色
                lineStyle: {
                  color: '#1890ff',//线的颜色
                  width: 2//线的宽度
                }
              }
            }
          },
          {
            type: 'line',//线条
            name: '出库量',//系列名称，用于tooltip的显示
            data: [120, 132, 101, 134, 400, 378, 890, 500, 400, 1590, 888, 900, 222, 666],
            symbol: 'circle',//标记的类型：圆圈
            itemStyle: {
              normal: {
                shadowBlur: 50,//文字块的背景阴影长度。
                shadowColor: 'red',//文字块的背景阴影颜色。
                color: 'red',//图形的颜色
                lineStyle: {
                  color: '#b14ceb',//线的颜色
                  width: 2//线的宽度
                }
              }
            }
          }
        ]
      }
    }
  },
  mounted () {
    this.initBarChart()
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initBarChart () {
      this.echartsBar = echarts.init(document.getElementById('echartsBar'))
      this.echartsBar.setOption(this.option)
    }
  }
}

function get_date (num) {
  let dt = [];
  var date = new Date();
  var new_date = new Date(date);
  for (let i = num; i >= 0; i--) {
    new_date.setDate(date.getDate() - i);
    var new_day = (new_date.getMonth() + 1) + '.' + new_date.getDate();
    dt.push(new_day);
  }
  return dt;
}
</script>
