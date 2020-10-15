<template>
  <div class="app-container">
    <div>
      <el-form :inline="true">
        <el-form-item style="margin-bottom: 12px;">
          <el-date-picker
            v-model="listQuery.starttime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="开始日期"
          ></el-date-picker>
          <br />
          <span style="color:#909399">(备注:时间范围小于1天)</span>
        </el-form-item>
        <el-form-item>--</el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="listQuery.endtime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="listQuery.loginuser"
            placeholder="账号"
            style="width: 200px;"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.state" placeholder="状态" clearable>
            <el-option
              v-for="item  in stateOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"         
          >查找</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
      height="400"
    >
      <el-table-column width="50" label="#">
        <template slot-scope="scope">
          <span>{{scope.$index+(listQuery.page - 1) * listQuery.limit + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" label="请求时间" :formatter="formatDateTime" width="160"></el-table-column>
      <el-table-column prop="loginuser" label="账号"></el-table-column>
      <el-table-column prop="vsername" label="用户"></el-table-column>
      <el-table-column prop="ip" label="ip"></el-table-column>
      <el-table-column prop="title" label="模块"></el-table-column>
      <el-table-column prop="duration" label="耗时(ms)"></el-table-column>
      <el-table-column prop="state" label="状态" :formatter="formatState"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleInfo(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog :visible.sync="dialogVisible" :title="'日志信息'">
      <el-form label-position="left" style="padding:10px">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="模块：">
              <span>{{blog.title}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item label="请求地址：">
              <span>{{blog.url}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="用户信息：">
              <span>{{blog.loginuser}}/{{blog.ip}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="请求方式：">
              <span>{{blog.requestmethod}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="请求时间：">
              <span>{{blog.createtime}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="请求参数：">
              <span>{{blog.requestparams}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="响应结果：">
              <span>{{blog.result}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col>
            <el-form-item label="耗时(ms)：">
              <span>{{blog.duration}}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { blogList } from "@/api/logs/blog";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { getDateTime, formatDateTime, offsetMinute } from "@/utils";
export default {
  name: "Blog",
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        starttime: offsetMinute(getDateTime(), -160),
        endtime: getDateTime(),
        loginuser: "",
        state: undefined
      },
      dialogVisible: false,
      blog: {},
      stateOptions: [
        { label: "失败", key: 0 },
        { label: "成功", key: 1 }
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      //If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await blogList(this.listQuery);
        this.listLoading = false;
        this.list = res.result.rows;
        this.total = res.result.records;
      } catch (e) {
        this.listLoading = false;
      }
    },
    handleSearch() {
      this.getList();
    },
    formatDateTime(row, column) {
      return formatDateTime(row.createtime);
    },
    formatState(row, column) {
      var val = "";
      if (row.state == 1) {
        val = "成功";
      } else {
        val = "失败";
      }
      return val;
    },
    handleInfo(row) {
      this.dialogVisible = true;
      this.blog = row;
      this.blog.createtime = formatDateTime(row.createtime);
    }
  }
};
</script>
<style scoped>
.el-form .el-row .el-form-item {
  margin-bottom: 18px;
}
</style>