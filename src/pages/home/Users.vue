<template>
<div class="wrap">
  <div class="news-wrap">
    <div class="news-title">
      <span class="news-title__tips">用户分析</span>
    </div>
    <div class="users-content">
      <div class="users-title">
        昨日关键数字
      </div>
      <ul class="users-board clearfix">
        <li class="users-item users-item__line">
          <div class="users-item__top">{{artclesData.yesterday_visitor_count}}</div>
          <div class="users-item__bottom">新增用户</div>
        </li>
        <li class="users-item users-item__line">
          <div class="users-item__top">{{artclesData.total_visitor_count}}</div>
          <div class="users-item__bottom">累计用户</div>
        </li>
        <li class="users-item users-item__line">
          <div class="users-item__top">{{artclesData.yesterday_fans_count}}</div>
          <div class="users-item__bottom">新增粉丝</div>
        </li>
        <li class="users-item">
          <div class="users-item__top">{{artclesData.total_fans_count}}</div>
          <div class="users-item__bottom">累计粉丝</div>
        </li>
      </ul>
      <div class="users-title">
        数据详情
      </div>
      <div class="users-date">
        <span class="users-day " v-bind:class="[queryParam.days=='7' ? 'is-active' : '']" @click="chooseDay(7)">7天</span>
        <span class="users-day" @click="chooseDay(14)" v-bind:class="[queryParam.days=='14' ? 'is-active' : '']">14天</span>
        <span class="users-day" @click="chooseDay(30)" v-bind:class="[queryParam.days=='30' ? 'is-active' : '']">30天</span>
        <span class="users-day users-line">/</span>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          placeholder="选择日期范围"
          :picker-options="forbiddenFuture"
          class="users-picker">
        </el-date-picker>
        <el-button type="default" icon="search" class="logs-date__btn" @click="chooseRange()"></el-button>
      </div>
      <div class="users-echat" v-loading="loading" element-loading-text="拼命加载中">
        <chart :options="echartConfig"></chart>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import API from '../../service';
import Tools from '../../util/tools';

export default {
  name: 'home-users',
  data() {
    return {
      loading: false,
      queryParam: {
        action: 'user',
        days: '',
        end_date: '',
        start_date: ''
      },
      echartConfig: {
        title: {
          text: '数据详情'
        },
        legend: {
          data: ['新增用户', '新增粉丝']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '新增用户',
          type: 'line',
          k: 'visitor_count',
          smooth: true,
          barWidth: '10%',
          data: []
        }, {
          name: '新增粉丝',
          type: 'line',
          barWidth: '10%',
          k: 'fans_count',
          smooth: true,
          data: []
        }],
        color: ['#FF74B9', '#13CE66'],
        animationDuration: 2000
      },
      dateRange: [new Date(Date.now() - 3600 * 1000 * 24 * 1), new Date(Date.now() - 3600 * 1000 * 24 * 1)],
      forbiddenFuture: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 3600 * 1000 * 24 * 1;
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      artclesData: {
        total_view_count: 0, // 总阅读数
        total_share_count: 0, //  总分享数
        total_collect_count: 0, // 总收藏数
        total_comment_count: 0, // 总评论数
        total_visitor_count: 0, // 总访客数
        total_fans_count: 0, // 总粉丝数
        total_show_count: 0, // 总曝光量
        total_news_count: 0, // 总文章数
        yesterday_visitor_count: 0,
        yesterday_fans_count: 0,
        list: []
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log('users page init');
      this.getRemoteAnalysisData();
    },
    chooseRange() {
      this.queryParam.days = '';
      if (this.dateRange && this.dateRange.length > 0) {
        this.queryParam.start_date = Tools.msToDate(this.dateRange[0], 'yyyy-MM-dd');
        this.queryParam.end_date = Tools.msToDate(this.dateRange[1], 'yyyy-MM-dd');
        if (this.dateRange[1] - this.dateRange[0] > 360 * 24 * 60 * 60 * 1000) {
          this.$message.error('所选范围不能超过360天, 请重新选择！');
          return;
        }
        this.getRemoteAnalysisData();
      }
    },
    chooseDay(days) {
      this.queryParam.days = days;
      this.getRemoteAnalysisData();
    },
    getRemoteAnalysisData() {
      this.loading = true;
      API.fetchAnalysisByAction(this.queryParam).then(result => {
        // fetchAnalysisByAction
        console.log('Users json: ', JSON.stringify(result, null, 2));
        this.loading = false;
        if (!result.list || result.list.length < 1) {
          this.$message.error('数据统计：分析数据出错');
          console.error('数据统计：分析数据出错');
          return;
        }
        this.artclesData = result;
        const es = this.echartConfig.series;
        let echartType = 'line';
        if (this.artclesData.list.stats_date && this.artclesData.list.stats_date.length === 1) {
          echartType = 'bar';
        }
        for (const key in es) {
          es[key].data = this.artclesData.list[es[key].k];
          es[key].type = echartType;
        }
        this.echartConfig.xAxis.data = this.artclesData.list.stats_date;
      }, err => {
        this.loading = false;
        console.log(err);
        this.$message.error(err);
      });
    }
  }
};
</script>
<style>
.users-title {
    margin-top: 40px;
    font-size: 16px;
    color: #999;
}

.users-board {
    margin-top: 20px;
    width: 624px;
    height: 130px;
    border: 1px solid #ddd;
}

.users-item {
    width: 25%;
    height: 80px;
    margin-top: 25px;
    float: left;
    text-align: center;
}

.users-item__line {
    border-right: 1px solid #e7e7e7;
}

.users-item__top {
    height: 50px;
    line-height: 50px;
    margin-bottom: 5px;
    font-size: 36px;
}

.users-item__bottom {
    height: 25px;
    line-height: 25px;
    font-size: 18px;
}

.users-date {
    margin-top: 30px;
}

.users-day {
    display: inline-block;
    font-size: 14px;
    color: #323232;
    margin-right: 24px;
    cursor: pointer;
}

.users-day.users-line {
    color: #e7e7e7;
}

.users-day.is-active {
    color: #ff74b9;
}

.users-picker {
    margin-right: 18px;
}

.color-pink {
    color: #ff74b9;
}

.color-green {
    color: #13ce66;
}

.color-yellow {
    color: #ff9200;
}

.color-blue {
    color: #65abec;
}

.color-navy {
    color: #00d5af;
}

.color-purple {
    color: #ae63ff;
}

.users-echat {
    margin-top: 30px;
}

.users-echat__head {
    text-align: center;
}

.users-head__item {
    display: inline-block;
    margin-right: 20px;
    line-height: 22px;
}

.users-head__left {
    display: inline-block;
    vertical-align: -1px;
    height: 12px;
    width: 32px;
    margin-right: 8px;
}

.users-head__right {
    font-size: 13px;
}

.users-table {
    height: 360px;
    width: 720px;
    margin: 35px auto;
    background-color: #e5e5e5;
}
</style>
