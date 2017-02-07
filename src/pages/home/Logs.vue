<template>
  <div class="wrap">
    <div class="news-wrap">
      <div class="news-title">
        <span class="news-title__tips">操作日志</span>
      </div>
      <div class="logs-content">
        <div v-if="userId" class="logs-account">
          账号ID: {{ userId }}
        </div>
        <div class="logs-date">
          <span class="logs-date__title">时间</span>
          <el-date-picker
            @change="handleChange"
            v-model="logsDate"
            type="daterange"
            placeholder="选择日期范围"
            :picker-options="forbiddenFuture"
            class="logs-date__range">
          </el-date-picker>
          <el-button type="default" icon="search" @click="fetchSearch" class="logs-date__btn"></el-button>
        </div>
        <div class="logs-table" v-loading="loading" element-loading-text="拼命加载中">
          <el-table
            :data="logsData"
            class="logs-eltable">
            <el-table-column
              prop="title"
              label="操作内容"
              align="left"
              header-align="left"
              width="500">
            </el-table-column>
            <el-table-column
              prop="operation_time"
              label="操作时间"
              align="left"
              header-align="left"
              width="250">
            </el-table-column>
            <el-table-column
              prop="ip"
              align="left"
              header-align="left"
              label="ip地址">
            </el-table-column>
          </el-table>
        </div>
        <div v-if="pageInfo && pageInfo.total_number && pageInfo.total_number > 0" class="index-pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="pageInfo.page"
            :page-size="pageInfo.page_size"
            layout="prev, pager, next, jumper"
            :total="pageInfo.total_number">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '../../service';
import Filter from '../../filters';

export default {
  name: 'home-logs',
  data() {
    return {
      loading: false,
      logsDate: [],
      forbiddenFuture: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      userId: '',
      logsData: [],
      pageInfo: {}
    };
  },
  mounted() {
    this.fetchLogs(1, '', '');
  },
  methods: {
    fetchLogs(page, start, end) {
      const self = this;
      self.loading = true;
      API.fetchOperationlogList(page, start, end).then(json => {
        console.log('logs json: ', JSON.stringify(json, null, 2));
        self.loading = false;
        if (json && json.code === 0) {
          const data = json.data;
          self.userId = data.data.user_id;
          self.logsData = data.data.list || [];
          self.pageInfo = data.page_info || {};
        } else {
          self.$message({
            showClose: true,
            message: json.message,
            type: 'error'
          });
        }
      });
    },
    handleChange(val) {
      if (!val) {
        this.logsDate = [];
        return;
      }
      this.logsDate = val.trim().split(' - ');
    },
    fetchSearch() {
      const self = this;
      const date = self.logsDate;
      console.log('date: ', date);
      if (!date.length || date.length < 2) {
        self.fetchLogs(1, '', '');
        return;
      }
      const start = Filter.formatDate(date[0], 'yyyy-MM-dd');
      const end = Filter.formatDate(date[1], 'yyyy-MM-dd');
      console.log('start: ', start, ' end: ', end);
      self.fetchLogs(1, start, end);
    },
    handleCurrentChange(val) {
      this.pageInfo.page = val;
      this.fetchLogs(val);
    }
  }
};
</script>

<style lang="scss">
.logs-content {
  padding-top: 40px;
}

.logs-date__range.el-input {
  width: 230px;
  margin: 0 10px;
}

.logs-date {
  margin-top: 30px;
}

.logs-date__time {
  margin-left: 12px;
  margin-right: 12px;
}

.logs-date__btn {
  padding: 10px;
}

.logs-table {
  margin-top: 30px;
}

.logs-eltable {
  width: 100%;
}

.logs-eltable th > .cell {
  text-align: left;
}
</style>
