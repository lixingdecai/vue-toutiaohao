<template>
  <div class="wrap">
    <div class="news-wrap comments-wrap" v-loading="loading" element-loading-text="拼命加载中">

      <div class="comments-title">
          评论管理
      </div>

      <div v-if="commentList && commentList.length" class="comments-list">

        <div class="comments-row" v-for="(item, index) in commentList">
          <div class="comments-content-wrap">
            <div class="comments-head">
              <img :src="item.avatar" @error="imageLoadOnError(index)"/>
            </div>
            <div class="comments-content-row">
              <div class="comments-auth">
                <span class="daren">{{item.user_screen_name}}</span>
                <span class="fans">{{item.is_fans == 1?'粉丝':''}}</span>
                <span class="comments-datetime">
                  {{item.created_at | getDateFromNow}}
                </span>
              </div>
              <div class="comments-content">
                {{item.crop ? item.cropContent : item.content}}
                <div v-show="item.towmore" class="comments-show-all" @click="showAllContent(index)">
                  <span class="comments-show-txt">{{item.crop ? '展开全部' : '收起'}}</span>
                  <div :class="[item.crop ? 'comments-show-icon' : 'comments-up-icon']"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="comments-article">
            <span>评论我的文章：</span>
            <a href="#">{{item.title}}</a>
          </div>

          <div class="comments-oper">
            <div :class="[item.is_praise ==1 ? 'is-zan' : '', 'comments-zan']" @click="setCommentUpAndCancel(index,item.id,item.is_praise)">
              {{item.praise_num}}
            </div>

            <div class="comments-reply">
              {{item.review_num}}
            </div>

            <div class="comments-oper-btns">
              <span @click="replyToggle(index)">{{item.replyLabel}}</span>
              <span @click="showReportDialog(item.id)">举报</span>
            </div>
          </div>

          <div :class="['comments-reply-form', { 'hidden': !item.isReply }]">
            <textarea :class="{'comments-reply-error': item.replyContent.length>1000}" v-model="item.replyContent" placeholder="回复该评论内容"></textarea>
            <div class="comments-reply-bottom">
              <div v-if="item.replyContent.length <=1000" class="comments-reply-tips">还可以输入{{1000 - item.replyContent.length}}字</div>
              <div v-if="item.replyContent.length > 1000" class="comments-reply-tips comments-error-tips">回复最多1000字哦</div>
              <div class="comments-btn">
                <button type="button" @click="replay(index)" class="el-button el-button--primary">
                  <span>提 交</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="comments-footer">
        没有更多数据
      </div>
      <div v-if="total != 0" class="comments-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="page_size"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="举报此评论" v-model="dialogFormVisible" size="tiny">
        <el-form>
          <div class="comments-report-radio">
            <el-radio size="large" class="radio" v-model="reasonId" label="1">广告</el-radio>
          </div>

          <div class="comments-report-radio">
            <el-radio size="large" class="radio" v-model="reasonId" label="2">色情</el-radio>
          </div>

          <div class="comments-report-radio">
            <el-radio size="large" class="radio" v-model="reasonId" label="3">人身攻击</el-radio>
          </div>

          <div class="comments-report-radio">
            <el-radio size="large" class="radio" v-model="reasonId" label="4">其他理由</el-radio>
          </div>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="report">确认</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>

import API from '../../service';
import _ from '../../util/tools';

export default {
  name: 'home-comments',
  data() {
    return {
      loading: false,
      currentPage: 1,
      commentList: [],
      total: 0,
      page_size: 20,
      dialogFormVisible: false,
      reasonId: '1',
      reportId: '',
      replyContent: ''
    };
  },
  created() {
    // 获取评论列表
    this.pageList(this.currentPage);
  },
  methods: {
    showAllContent(index) {
      this.commentList[index].crop = !this.commentList[index].crop;
    },
    imageLoadOnError(index) {
      this.commentList[index].avatar = _.getAvatar();
    },
    setCommentUpAndCancel(index, id, isPraise) {
      let action = 4;
      let message = '点赞成功！';
      if (isPraise === 1) {
        action = 5;
        message = '取消点赞成功！';
      }
      API.setCommentUpAndCancel(id, action).then(json => {
        if (json.code === 0) {
          this.$message({
            message: message,
            type: 'success'
          });
          if (isPraise === 1) {
            this.commentList[index].is_praise = 0;
            this.commentList[index].praise_num = window.parseInt(this.commentList[index].praise_num) - 1;
          } else {
            this.commentList[index].is_praise = 1;
            this.commentList[index].praise_num = window.parseInt(this.commentList[index].praise_num) + 1;
          }
        } else {
          this.$message.error(json.message);
        }
      }).catch(error => {
        this.$message.error('接口异常，' + error.status);
      });
    },
    report() {
      API.setCommentReport(this.reportId, this.reasonId).then(json => {
        if (json.code === 0) {
          this.$message({
            message: '举报成功！',
            type: 'success'
          });
          this.dialogFormVisible = false;
        } else {
          this.$message.error(json.message);
        }
      });
    },
    showReportDialog(id) {
      this.reasonId = '1';
      this.reportId = id;
      this.dialogFormVisible = true;
    },
    replyToggle(index) {
      this.commentList[index].isReply = !this.commentList[index].isReply;
      if (this.commentList[index].isReply) {
        this.commentList[index].replyLabel = '收起';
      } else {
        this.commentList[index].replyLabel = '回复';
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.pageList(this.currentPage);
    },
    replay(index) {
      const replyContent = this.commentList[index].replyContent;
      if (!replyContent) {
        this.$message.error('您的回复为空，多写一点吧！');
        return;
      }
      const id = this.commentList[index].id;
      API.setCommentReplay(id, replyContent).then(json => {
        if (json.code === 0) {
          this.$message({
            message: '回复成功！',
            type: 'success'
          });
          this.commentList[index].replyContent = '';
          this.replyToggle(index);
          this.commentList[index].review_num = window.parseInt(this.commentList[index].review_num) + 1;
        } else {
          this.$message.error(json.message);
        }
      }).catch(error => {
        this.$message.error('接口异常，' + error.status);
      });
    },
    setCommentContent() {
      if (this.commentList && this.commentList.length > 0) {
        for (let n = 0; n < this.commentList.length; n++) {
          const comment = this.commentList[n];
          if (comment.content && comment.content.length >= 114) {
            this.$set(this.commentList[n], 'towmore', true);
            this.$set(this.commentList[n], 'crop', true);
            this.$set(this.commentList[n], 'cropContent', comment.content.substring(0, 114) + '...');
          } else {
            this.$set(this.commentList[n], 'crop', false);
            this.$set(this.commentList[n], 'towmore', false);
          }
        }
      }
    },
    pageList(page) {
      this.loading = true;
      API.fetchCommentList(page).then(json => {
        if (json.code === 0) {
          const data = json.data;
          this.commentList = data.data;
          this.setCommentContent();
          if (this.commentList && this.commentList.length > 0) {
            for (let i = 0; i < this.commentList.length; i++) {
              this.$set(this.commentList[i], 'replyLabel', '回复');
              this.$set(this.commentList[i], 'isReply', false);
              this.$set(this.commentList[i], 'replyContent', '');
            }
          }
          this.total = data.page_info.total_number;
          this.page_size = data.page_info.page_size;
        } else {
          this.$message.error(json.message);
        }
        this.loading = false;
      }).catch(error => {
        this.$message.error('接口异常，' + error.status);
        this.loading = false;
      });
    }
  }
};
</script>

<style type="text/css">
.comments-title {
  height: 60px;
  line-height: 60px;
  color: #FF74B9;
  font-size: 16px;
  border-bottom: 1px solid #E7E7E7;
  padding-left: 15px;
}

.comments-row {
  min-height: 174px;
  border-bottom: 1px solid #e7e7e7;
}

.comments-content-wrap {
  overflow: hidden;
  padding-top: 20px;
}

.comments-content {
  position: relative;
}

.comments-show-all {
  cursor: pointer;
  color: #65ABEC;
  position: absolute;
  right: 0;
  bottom: 0;
}
.comments-show-all .comments-show-txt {
  float: left;
}

.comments-show-all .comments-show-icon {
  background: url('../../assets/images/commnet-show.png') no-repeat 0 0;
  float: left;
  width: 12px;
  height: 6px;
  margin-top: 8px;
  margin-left: 3px;
}

.comments-show-all .comments-up-icon {
  background: url('../../assets/images/comment-up.png') no-repeat 0 0;
  float: left;
  width: 12px;
  height: 6px;
  margin-top: 8px;
  margin-left: 3px;
}

.comments-head {
  float: left;
}

.comments-head img {
  width: 36px;
  height: 36px;
  border-radius: 100%;
}

.comments-content-row {
  float: left;
  margin-left: 15px;
  width: 850px;
}

.comments-auth .fans {
  font-size: 12px;
  color: #999;
  margin-left: 15px;
}

.comments-datetime {
  float: right;
  color: #999;
}

.comments-article {
  margin-left: 51px;
  margin-top: 15px;
  height: 40px;
  line-height: 40px;
  background: #F7F7F7;
  padding-left: 15px;
  padding-right: 15px;
}

.comments-article span {
  color: #999;
}

.comments-article a {
  color: #65ABEC;
}

.comments-oper {
  margin-left: 51px;
  margin-top: 15px;
  overflow: hidden;
}

.comments-zan {
  background: url('../../assets/images/article-zan.png') no-repeat 0 0;
  height: 20px;
  padding-left: 25px;
  cursor: pointer;
  float: left;
  color: #999;
}

.comments-zan.is-zan {
  background: url('../../assets/images/article-zan-hover.png') no-repeat 0 0;
}

.comments-zan:hover {
  background: url('../../assets/images/article-zan-hover.png') no-repeat 0 0;
}

.comments-reply {
  background: url('../../assets/images/article-comment.png') no-repeat 0 0;
  height: 20px;
  padding-left: 25px;
  color: #999;
  float: left;
  margin-left: 15px;
}

.comments-oper-btns {
  float: right;
}

.comments-oper-btns span {
  color: #65abec;
  margin-left: 15px;
  cursor: pointer;
}

.comments-reply-form {
  margin-left: 51px;
  margin-top: 15px;
  margin-bottom: 15px;
  height: 145px;
  background: #e7e7e7;
  padding: 15px 15px 0 15px;
}

.comments-reply-form textarea{
  height: 72px;
  width: 100%;
  border: 1px solid #ddd;
  padding: 5px;
  outline: none;
}

.comments-reply-bottom {
  overflow: hidden;
}

.comments-reply-form .comments-reply-tips {
  color: #999;
  font-size: 12px;
  margin-top: 20.5px;
  float: left;
}

.comments-btn {
  float: right;
  margin-top: 10px;
}

.comments-btn button {
  width: 88px;
  height: 36px;
}

.comments-report-radio {
  margin-top: 15px;
}

.comments-pagination {
  margin-top: 30px;
  text-align: right;
}

.comments-footer {
  margin-top: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  color: #b5b5b5;
  text-align: center;
}

.comments-reply-form textarea.comments-reply-error {
  border: 1px solid #ff4949;
}

.comments-reply-form .comments-reply-tips.comments-error-tips {
  color: #ff4949;
}
</style>
