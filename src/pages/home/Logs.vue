<template>
  <div class="wrap">
    <div class="news-wrap">
      <div class="news-title">
        <span class="news-title__tips">操作日志</span>
      </div>
      <div class="logs-content">
        <div class="logs-account">
          账号ID: 1234567
        </div>
        <div class="logs-date">
          <span class="logs-date__title">时间</span>
          <el-date-picker
            v-model="logsDate"
            type="daterange"
            placeholder="选择日期范围">
          </el-date-picker>
          <el-button type="default" icon="search" class="logs-date__btn"></el-button>
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
              width="200">
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

export default {
  name: 'home-logs',
  data() {
    return {
      loading: false,
      logsDate: '',
      logsData: [],
      pageInfo: {
        page: 1,
        page_size: 20,
        total_number: 0
      }
    };
  },
  mounted() {
    this.fetchLogs(1);
  },
  methods: {
    fetchLogs(page) {
      const self = this;
      self.loading = true;
      API.fetchOperationlogList(page).then(json => {
        console.log('logs json: ', JSON.stringify(json, null, 2));
        if (json && json.code === 0) {
          const data = json.data;
          self.logsData = data.data;
          self.pageInfo = data.page_info;
          self.loading = false;
        } else {
          self.pageInfo = {};
          self.logsData = [];
          self.loading = false;
        }
      });
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
