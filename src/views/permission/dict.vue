<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.data_type"
        placeholder="请输入类型/key/value"
        style="width: 200px;"
        class="filter-item"
      />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">查找</el-button>
    </div>
    <div class="table-toolbar">
      <div class="table-toolbar-left">
        <el-button
          v-permission="[permission.add]"
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="handleCreate"
        >新增</el-button>
        <el-button
          ref="editButton"
          v-permission="[permission.edit]"
          class="filter-item"
          type="success"
          icon="el-icon-edit"
          @click="handleSelectionEdit"
        >编辑</el-button>
        <el-button
          ref="delButton"
          v-permission="[permission.del]"
          class="filter-item"
          type="danger"
          icon="el-icon-delete"
          @click="handleSelectionDel"
        >删除</el-button>
        <!--   <el-button
                v-permission="permission.download"
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
      height="450"
      highlight-current-row
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
    >
      <!-- <el-table-column width="50">
        <template slot-scope="scope">
          <span>{{ scope.$index+(listQuery.page - 1) * listQuery.limit + 1 }}</span>
        </template>
      </el-table-column>-->
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="data_type" label="类型" />
      <el-table-column prop="data_key" label="key" />
      <el-table-column prop="data_value" label="value" />
      <el-table-column prop="sorts" label="排序" />
      <el-table-column prop="description" label="描述" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
      <el-form ref="form" :model="dict" :rules="rules" label-width="80px" label-position="right">
        <el-form-item label="Type" prop="data_type">
          <el-input v-model="dict.data_type" placeholder="类型" />
        </el-form-item>
        <el-form-item label="Key" prop="data_key">
          <el-input v-model="dict.data_key" placeholder="Key" />
        </el-form-item>
        <el-form-item label="Value" prop="data_value">
          <el-input v-model="dict.data_value" placeholder="Value" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="dict.sorts" placeholder="排序" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="dict.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDict">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  dictList,
  addDict,
  updateDict,
  deleteDict
} from "@/api/permission/dict";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { deepClone } from "@/utils";
const defaultDict = {
  id: undefined,
  data_type: "",
  data_key: "",
  data_value: "",
  sorts: undefined,
  description: ""
};
export default {
  name: "Dict",
  components: { Pagination },
  data() {
    return {
      permission: {
        list: "dict:list",
        add: "dict:add",
        edit: "dict:edit",
        del: "dict:del"
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        data_type: ""
      },
      allColumnsSelected: [],
      tableColumns: [],
      multipleSelection: [],
      dict: Object.assign({}, defaultDict),
      dialogVisible: false,
      dialogType: "new",
      rules: {
        data_type: [{ required: true, message: "请输入type", trigger: "blur" }],
        data_key: [{ required: true, message: "请输入key", trigger: "blur" }],
        data_value: [
          { required: true, message: "请输入value", trigger: "blur" }
        ]
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
        const res = await dictList(this.listQuery);
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
    handleCreate() {
      this.dict = Object.assign({}, defaultDict);
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    async handleEdit(row) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.dict = deepClone(row);
    },
    async confirmDict() {
      const isEdit = this.dialogType === "edit";
      if (isEdit) {
        await updateDict(this.dict);
      } else {
        await addDict(this.dict);
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
      this.$confirm("确认删除吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteDict(row.id);
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
