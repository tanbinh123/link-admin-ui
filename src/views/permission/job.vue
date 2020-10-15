<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="岗位名"
        style="width: 200px;"
        class="filter-item"
      />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">查找</el-button>
    </div>
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <el-button
          v-action="permission.add"
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >新增</el-button>
        <el-button
          ref="editButton"
          v-action="permission.edit"
          class="filter-item"
          type="success"
          icon="el-icon-edit"
          @click="handleSelectionEdit"
        >编辑</el-button>
        <el-button
          ref="delButton"
          v-action="permission.del"
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          @click="handleSelectionDel"
        >删除</el-button>
        <!--   <el-button
                v-action="permission.download"
                class="filter-item"
                type="warning"
                icon="el-icon-download"
        >导出</el-button>-->
      </div>
      <div class="table-toolbar-right">
        <el-button-group>
          <el-button icon="el-icon-refresh" @click="handleSearch" />
          <el-popover placement="bottom-end" width="150" trigger="click">
            <el-button slot="reference" icon="el-icon-s-grid">
              <i class="fa fa-caret-down" aria-hidden="true" />
            </el-button>
            <el-checkbox v-model="allColumnsSelected">全选</el-checkbox>
            <el-checkbox
              v-for="item in tableColumns"
              :key="item.property"
              v-model="item.visible"
            >{{ item.label }}</el-checkbox>
          </el-popover>
        </el-button-group>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
      height="400"
      highlight-current-row
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="岗位名" />
      <el-table-column label="禁用/启用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value="1"
            :inactive-value="0"
            @change="handleStateChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="sorts" label="排序" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            v-action="permission.edit"
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            v-action="permission.del"
            type="text"
            size="small"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form ref="form" :model="job" :rules="rules" label-position="right" label-width="80px">
        <el-form-item label="岗位名" prop="name">
          <el-input v-model="job.name" placeholder="岗位名" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="job.state">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model.number="job.sorts"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 178px;"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import {
  jobList,
  addJob,
  updateJob,
  updateState,
  deleteJob
} from "@/api/permission/job";

import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { deepClone } from "@/utils";
const defaultJob = {
  id: undefined,
  name: "",
  state: 1,
  sorts: undefined
};
export default {
  name: "Job",
  components: { Pagination },

  data() {
    return {
      permission: {
        list: "job:list",
        add: "job:add",
        edit: "job:edit",
        del: "job:del"
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        name: ""
      },
      allColumnsSelected: [],
      tableColumns: [],
      multipleSelection: [],
      job: Object.assign({}, defaultJob),
      dialogVisible: false,
      dialogType: "new",
      rules: {
        name: [
          { required: true, message: "请输入岗位名", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ],
        state: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await jobList(this.listQuery);
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
    // 状态修改
    handleStateChange(row) {
      const text = row.state === 1 ? "启用" : "停用";
      this.$confirm(
        "确认要 [" + text + "] [" + row.name + "] 岗位吗?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          await updateState({ id: row.id, state: row.state });
          this.$message({
            message: text + "成功",
            type: "success"
          });
        })
        .catch(err => {
          console.error(err);
          row.state = row.state === 0 ? 1 : 0;
        });
    },
    handleCreate() {
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    handleEdit(row) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.job = deepClone(row);
    },
    async confirmRole() {
      const isEdit = this.dialogType === "edit";
      if (isEdit) {
        await updateJob(this.job);
      } else {
        await addJob(this.job);
      }
      this.dialogVisible = false;
      this.$message({
        showClose: true,
        message: "保存成功",
        type: "success"
      });
      this.getList();
    },
    handleDelete(row) {
      this.$confirm("确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteJob(row.id);
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success"
          });
          this.getList();
        })
        .catch(err => {
          console.error(err);
        });
    },
    handleCurrentChange(val) {
      this.$refs.multipleTable.clearSelection();
      this.$refs.multipleTable.toggleRowSelection(val);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if (this.multipleSelection.length > 1) {
        this.$refs.editButton.disabled = true;
        this.$refs.delButton.disabled = true;
      } else {
        this.$refs.editButton.disabled = false;
        this.$refs.delButton.disabled = false;
      }
    },
    handleSelectionEdit() {
      if (this.multipleSelection.length != 1) {
        this.$message.error("请选择一条数据");
        return;
      }
      this.handleEdit(this.multipleSelection[0]);
    },
    handleSelectionDel() {
      if (this.multipleSelection.length != 1) {
        this.$message.error("请选择一条数据");
        return;
      }
      this.handleDelete(this.multipleSelection[0]);
    }
  }
};
</script>
