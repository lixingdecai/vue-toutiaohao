<template>
  <div class="wrap">
    <div class="news-wrap">
        <div class="feeds-title">
          内容源管理
        </div>

        <div class="feeds-tips">
          目前支持头条号、百家号、微信公众号等平台，接入内容源后，美柚号会定期同步提供的内容源发表的内容，并自动发表在你的美柚号上。
        </div>

        <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="platform"
          label="平台"
          width="180">
        </el-table-column>
        <el-table-column
          prop="link"
          label="列表页链接">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template scope="scope">
            <el-button type="text" @click="dialogFormVisible = true"  size="small">修改{{scope.row.id}}</el-button>
            <el-button class="feeds-del-btn" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="feeds-add">
        <span @click="dialogFormVisible = true">
          <i class="el-icon-plus"></i>
          新增
        </span>
      </div>

      <div class="feeds-attention">
        <ul>
          <li>接入标准：</li>
          <li>1、内容源至少有10篇文章</li>
          <li>2、文章内容优质，垂直性较强，且定位与关联美柚号定位保持一致</li>
          <li>3、禁止含有时政社会、低俗色情类内容的账号接入</li>
          <li>4、禁止含有大量转载、广告营销类内容的账号接入</li>
          <li>提示：因内容源平台限制，同步可能存在一定程度延迟，时效性强的内容建议在美柚号手动发表，在美柚号手动发表的文章在推荐上也会获得更好的推荐效果。</li>
        </ul>
      </div>

      <el-dialog title="新增内容源" v-model="dialogFormVisible" size="tiny">
        <el-form>
          <el-form-item label="名称">
          <el-row>
            <el-col :span="10">
              <el-input  type="text" auto-complete="off"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
          <el-form-item label="平台">
            <el-row>
              <el-col :span="10">
              <el-select>
                <el-option label="头条号" value="shanghai"></el-option>
                <el-option label="百家号" value="beijing"></el-option>
                <el-option label="微信公众号" value="beijing"></el-option>
              </el-select>
            </el-col>
            </el-row>
          </el-form-item>

           <el-form-item label="链接">
          <el-row>
            <el-col :span="20">
              <el-input  type="text" auto-complete="off"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
export default {
  name: 'home-feeds',
  data() {
    return {
      dialogFormVisible: false,
      tableData: [{
        name: '王小虎',
        platform: '美柚',
        link: 'https://www.my.com',
        status: '待审核',
        id: 1,
      }, {
        name: '王小虎',
        platform: '美柚',
        link: 'https://www.my.com',
        status: '待审核',
        id: 2,
      }]
    };
  }
};
</script>

<style type="text/css">
.feeds-title {
  height: 60px;
  line-height: 60px;
  color: #FF74B9;
  font-size: 16px;
  border-bottom: 1px solid #E7E7E7;
  padding-left: 15px;
}

.feeds-tips {
  color: #999;
  font-size: 14px;
  margin-top: 25px;
  margin-bottom: 15px;
}

.feeds-del-btn {
  color: #FF4949;
}

.feeds-add {
  margin-top: 30px;
  margin-bottom: 60px;
  font-size: 16px;
  color: #65ABEC;
}

.feeds-add span {
  cursor: pointer;
}

.feeds-wrap .el-table th, .el-table td {
  text-align: center;
}

.feeds-attention {
  color: #999;
  font-size: 12px;
}

.feeds-attention li:first-child {
  line-height: 20px;
  height: 20px;
}

.feeds-attention li {
  line-height: 30px;
  height: 30px;
}

.feeds-attention li:last-child {
  line-height: 40px;
  height: 40px;
}
</style>
