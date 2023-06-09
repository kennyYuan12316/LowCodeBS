<template>
  <div class="flow-form" v-loading="loading">
    <div class="com-title">
      <h1>出差预支申请单</h1>
      <span class="number">流程编码：{{dataForm.billNo}}</span>
    </div>
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px"
      :disabled="setting.readonly">
      <el-row>
        <el-col :span="12" v-if="judgeShow('flowTitle')">
          <el-form-item label="流程标题" prop="flowTitle">
            <el-input v-model="dataForm.flowTitle" placeholder="流程标题"
              :disabled="judgeWrite('flowTitle')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('flowUrgent')">
          <el-form-item label="紧急程度" prop="flowUrgent">
            <el-select v-model="dataForm.flowUrgent" placeholder="选择紧急程度"
              :disabled="judgeWrite('flowUrgent')">
              <el-option :key="item.value" :label="item.label" :value="item.value"
                v-for="item in flowUrgentOptions" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('travelMan')">
          <el-form-item label="出差人员" prop="travelMan">
            <el-input v-model="dataForm.travelMan" placeholder="出差人员" readonly
              :disabled="judgeWrite('travelMan')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('applyDate')">
          <el-form-item label="申请日期" prop="applyDate">
            <el-date-picker v-model="dataForm.applyDate" type="date" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd" :editable="false" readonly
              :disabled="judgeWrite('applyDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('departmental')">
          <el-form-item label="所属部门" prop="departmental">
            <el-input v-model="dataForm.departmental" placeholder="所属部门" readonly
              :disabled="judgeWrite('departmental')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('position')">
          <el-form-item label="员工职务" prop="position">
            <el-input v-model="dataForm.position" placeholder="员工职务" readonly
              :disabled="judgeWrite('position')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('startDate')">
          <el-form-item label="开始时间" prop="startDate">
            <el-date-picker v-model="dataForm.startDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('startDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('endDate')">
          <el-form-item label="结束时间" prop="endDate">
            <el-date-picker v-model="dataForm.endDate" type="datetime" placeholder="选择日期"
              value-format="timestamp" format="yyyy-MM-dd HH:mm" :editable='false'
              :disabled="judgeWrite('endDate')">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('startPlace')">
          <el-form-item label="起始地点" prop="startPlace">
            <el-input v-model="dataForm.startPlace" placeholder="起始地点"
              :disabled="judgeWrite('startPlace')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('destination')">
          <el-form-item label="目的地" prop="destination">
            <el-input v-model="dataForm.destination" placeholder="目的地"
              :disabled="judgeWrite('destination')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="judgeShow('prepaidTravel')">
          <el-form-item label="预支旅费" prop="prepaidTravel">
            <el-input v-model="dataForm.prepaidTravel" placeholder="预支旅费" type="number"
              :disabled="judgeWrite('prepaidTravel')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="judgeShow('description')">
          <el-form-item label="备注" prop="description">
            <el-input v-model="dataForm.description" placeholder="备注" type="textarea" :rows="3"
              :disabled="judgeWrite('description')" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import comMixin from '../mixin';
export default {
  mixins: [comMixin],
  name: 'TravelApply',
  data() {
    var checkStartTime = (rule, value, callback) => {
      if (!this.dataForm.endDate) {
        callback()
      } else {
        if (this.dataForm.endDate < value) {
          callback(new Error('开始日期应该小于结束日期'));
        } else {
          this.$refs.dataForm.validateField('endTime');
          callback()
        }
      }
    }
    var checkEndTime = (rule, value, callback) => {
      if (!this.dataForm.startDate) {
        callback()
      } else {
        if (this.dataForm.startDate > value) {
          callback(new Error('结束日期应该大于开始日期'));
        } else {
          callback()
        }
      }
    }
    return {
      billEnCode: 'WF_TravelApplyNo',
      dataForm: {
        flowId: '',
        id: '',
        billNo: '',
        flowTitle: '',
        flowUrgent: 1,
        travelMan: '',
        applyDate: '',
        departmental: '',
        position: '',
        startDate: '',
        endDate: '',
        prepaidTravel: '',
        description: '',
        startPlace: '',
        destination: ''
      },
      dataRule: {
        flowTitle: [
          { required: true, message: '流程标题不能为空', trigger: 'blur' },
        ],
        flowUrgent: [
          { required: true, message: '紧急程度不能为空', trigger: 'change' },
        ],
        startDate: [
          { required: true, message: '开始时间不能为空', trigger: 'change' },
          { validator: checkStartTime, trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '结束时间不能为空', trigger: 'change' },
          { validator: checkEndTime, trigger: 'change' }
        ],
        startPlace: [
          { required: true, message: '起始地点不能为空', trigger: 'blur' },
        ],
        destination: [
          { required: true, message: '目的地不能为空', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    selfInit(data) {
      this.dataForm.applyDate = new Date().getTime()
      this.dataForm.flowTitle = this.userInfo.userName + "的出差预支申请单"
      this.dataForm.travelMan = this.userInfo.userName + '/' + this.userInfo.userAccount
      this.dataForm.departmental = this.userInfo.organizeName
      if (this.userInfo.positionIds && this.userInfo.positionIds.length) {
        let list = this.userInfo.positionIds.map(o => o.name)
        this.dataForm.position = list.join(',')
      }
    }
  }
}
</script>