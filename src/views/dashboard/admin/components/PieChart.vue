<template>
  <div class="chart-container app-container nohead">
    <highcharts :options="chartOptions"
                :callback="myCallback"
                style="width:100%;height:400px;margin-top:0px;"
                ref="highcharts"></highcharts>
  </div>
</template>

<script>

import { Chart } from "highcharts-vue";
import Highcharts from 'highcharts'
export default {
  name: 'extend-graphDemo-highchartsPie',
  components: {
    highcharts: Chart
  },
  data () {
    return {
      chartOptions: {}

    }
  },
  mounted () {
    this.init()
  },

  methods: {
    myCallback () {
      console.log("this is callback function");
    },
    init () {
      var colors = Highcharts.getOptions().colors,
        categories = [
          "锁定货位",
          "占用货位",
          "空闲货位"
        ],
        data = [
          {
            "y": 62.74,
            "color": colors[4],
            "drilldown": {
              "name": "lock",
              "categories": [
                "待入库",
                "待出库",
                "人工",
                "LES下发"
              ],
              "data": [
                3.02,
                5.3,
                53.02,
                1.4
              ]
            }
          },
          {
            "y": 20.57,
            "color": colors[5],
            "drilldown": {
              "name": "occupy",
              "categories": [
                "有货",
                "消防",
                "结构本身",
                "维护"
              ],
              "data": [
                10.02,
                7.36,
                3,
                0.19
              ]
            }
          },
          {
            "y": 16.69,
            "color": colors[2],
            "drilldown": {
              "name": "empty",
              "categories": [
                "可用"
              ],
              "data": [
                16.69
              ]
            }
          }
        ],
        browserData = [],
        versionsData = [],
        i,
        j,
        dataLen = data.length,
        drillDataLen,
        brightness;
      // Build the data arrays
      for (i = 0; i < dataLen; i += 1) {
        // add browser data
        browserData.push({
          name: categories[i],
          y: data[i].y,
          color: data[i].color
        });
        // add version data
        drillDataLen = data[i].drilldown.data.length;
        for (j = 0; j < drillDataLen; j += 1) {
          brightness = 0.2 - (j / drillDataLen) / 5;
          versionsData.push({
            name: data[i].drilldown.categories[j],
            y: data[i].drilldown.data[j],
            color: Highcharts.Color(data[i].color).brighten(brightness).get()
          });
        }
      }
      this.chartOptions = {
        chart: {
          type: 'pie'
        },
        title: {
          text: '货位使用详情',
          style: {
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#1890ff'
          }
        },
        // subtitle: {
        //   text: '数据来源：<a href="http://www.szzcanon.com/" target="_blank">www.szzcanon.com</a>'
        // },
        yAxis: {
          title: {
            text: 'Total percent market share'
          }
        },
        plotOptions: {
          pie: {
            shadow: false,
            center: ['50%', '50%']
          }
        },
        tooltip: {
          valueSuffix: '%'
        },
        credits: {
          enabled: false
        },
        series: [{
          name: 'Browsers',
          data: browserData,
          size: '60%',
          dataLabels: {
            formatter: function () {
              return this.y > 5 ? this.point.name : null;
            },
            color: '#ffffff',
            distance: -30
          }
        }, {
          name: 'Versions',
          data: versionsData,
          size: '80%',
          innerSize: '60%',
          dataLabels: {
            formatter: function () {
              // display only if larger than 1
              return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                this.y + '%' : null;
            }
          },
          id: 'versions'
        }],
        responsive: {
          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }
        }
      }
    }
  }
}
</script>
