<template>
<div class="wrap">
  <div class="news-wrap">
    <div class="news-title">
      <span class="news-title__tips">文章分析</span>
    </div>
    <div class="users-content">
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
      <ul class="articles-board clearfix">
        <li class="articles-item users-item__line">
          <div class="users-item__top">{{artclesData.total_news_count}}</div>
          <div class="users-item__bottom">文章量</div>
        </li>
        <li class="articles-item users-item__line">
          <div class="users-item__top">{{artclesData.total_show_count}}</div>
          <div class="users-item__bottom">推荐量</div>
        </li>
        <li class="articles-item users-item__line">
          <div class="users-item__top">{{artclesData.total_view_count}}</div>
          <div class="users-item__bottom">阅读量</div>
        </li>
        <li class="articles-item users-item__line">
          <div class="users-item__top">{{artclesData.total_comment_count}}</div>
          <div class="users-item__bottom">评论量</div>
        </li>
        <li class="articles-item users-item__line">
          <div class="users-item__top">{{artclesData.total_share_count}}</div>
          <div class="users-item__bottom">转发量</div>
        </li>
        <li class="articles-item">
          <div class="users-item__top">{{artclesData.total_collect_count}}</div>
          <div class="users-item__bottom">收藏量</div>
        </li>
      </ul>
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
  name: 'home-articles',
  data() {
    return {
      loading: false,
      queryParam: {
        action: 'article',
        days: '',
        end_date: '',
        start_date: ''
      },
      echartConfig: {
        title: {
          text: '数据详情'
        },
        legend: {
          data: ['文章量', '推荐量', '阅读量', '评论量', '转发量', '收藏量']
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
          data: ['文章量', '推荐量', '阅读量', '评论量', '转发量', '收藏量']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '文章量',
          k: 'news_count',
          type: 'line',
          smooth: true,
          barWidth: '10%',
          data: []
        }, {
          name: '推荐量',
          k: 'show_count',
          type: 'line',
          smooth: true,
          barWidth: '10%',
          data: []
        }, {
          name: '阅读量',
          k: 'view_count',
          type: 'line',
          smooth: true,
          barWidth: '10%',
          data: []
        }, {
          name: '评论量',
          k: 'comment_count',
          type: 'line',
          smooth: true,
          barWidth: '10%',
          data: []
        }, {
          name: '转发量',
          k: 'share_count',
          type: 'line',
          smooth: true,
          barWidth: '10%',
          data: []
        }, {
          name: '收藏量',
          type: 'line',
          k: 'collect_count',
          smooth: true,
          barWidth: '10%',
          data: []
        }],
        color: ['#FF74B9', '#13CE66', '#FF9200', '#65ABEC', '#00D5AF', '#AE63FF'],
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
      console.log('articels page init');
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
        console.log(this.dateRange);
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
        console.log('Articles json: ', JSON.stringify(result, null, 2));
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
.news-wrap .echarts {
  height: 500px;
  width: 900px;
}

.news-wrap .el-input__inner {
  display: inline-block;
}

.articles-board {
  margin-top: 20px;
  height: 130px;
  border: 1px solid #ddd;
}

.articles-item {
  width: 16.6%;
  height: 80px;
  margin-top: 25px;
  float: left;
  text-align: center;
}
</style>
