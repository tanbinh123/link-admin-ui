<template>
  <div class="app-container">
    <div>
      <el-row :gutter="10">
        <el-col :span="4">
          <el-input
            v-model="searchDeptName"
            prefix-icon="el-icon-search"
            placeholder="请输入部门名称"
            clearable
            @clear="clearSearchDept"
          />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.name" placeholder="账号" />
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.vserName" placeholder="真实姓名" />
        </el-col>

        <el-col :span="4">
          <el-select v-model="listQuery.state" placeholder="用户状态" clearable>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button
            v-permission="[permission.list]"
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleSearch"
          >查找</el-button>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-row>
        <el-col :span="4">
          <el-tree
            ref="serchDeptTree"
            :data="departments"
            :props="defaultProps"
            node-key="id"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            class="objectTree"
            @node-click="handleSearchDeptNode"
          />
        </el-col>

        <el-col :span="20">
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
            style="width: 100%;"
            height="450"
            border
            highlight-current-row
            @selection-change="handleSelectionChange"
            @current-change="handleCurrentChange"
          >
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="name" label="账号" width="100" />
            <el-table-column prop="vserName" label="真实姓名" width="100" />
            <el-table-column prop="mobile" label="手机" width="150" />
            <!-- <el-table-column prop="email" label="邮箱" width="180"></el-table-column> -->
            <el-table-column prop="deptName" label="部门/岗位" width="210" :formatter="formatDept" />
            <el-table-column prop="roleName" label="角色" width="180" :formatter="formatRole" />

            <el-table-column label="禁用/启用" width="85">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.state"
                  :active-value="1"
                  :inactive-value="0"
                  @change="handleStateChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-permission="[permission.edit]"
                  type="text"
                  size="small"
                  @click="handleEdit(scope.row)"
                >编辑</el-button>
                <el-button
                  v-permission="[permission.del]"
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
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form ref="form" :model="user" :rules="rules" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="name">
              <el-input v-model="user.name" placeholder="账号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="user.password" placeholder="密码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="vserName">
              <el-input v-model="user.vserName" placeholder="真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="user.mobile" placeholder="手机号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptid">
              <treeselect
                v-model="user.deptid"
                :options="departments"
                :normalizer="normalizer"
                placeholder="选择部门"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-autocomplete
                v-model="user.jobName"
                :fetch-suggestions="queryJobSearch"
                placeholder="请输入内容"
                style="width:100%"
                @select="handleJobSelect"
              >
                <template slot-scope="{ item }">
                  <div class="name">{{ item.name }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="user.email" placeholder="邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="state">
              <el-radio-group v-model="user.state">
                <el-radio
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.value"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色">
              <el-select v-model="user.roleIds" multiple placeholder="请选择" style="width:100%">
                <el-option
                  v-for="item in roles"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  userList,
  addUser,
  updateUser,
  deleteUser,
  updateState
} from "@/api/permission/user";
import { departments } from "@/api/permission/department";
import { jobs } from "@/api/permission/job";
import { roles } from "@/api/permission/role";
import { deepClone } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
const defaultUser = {
  uid: "",
  name: "",
  password: 123456,
  vserName: "",
  mobile: "",
  state: 1,
  email: "",
  deptid: undefined,
  jobid: undefined,
  jobName: "",
  deptName: "",
  roleIds: []
};

export default {
  name: "User",
  components: { Pagination, Treeselect },
  data() {
    return {
      permission: {
        list: "user:list",
        add: "user:add",
        edit: "user:edit",
        del: "user:del"
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        vserName: "",
        name: "",
        mobile: "",
        deptid: undefined,
        state: undefined
      },
      searchDeptName: "",
      stateOptions: [
        { label: "禁用", value: 0 },
        { label: "启用", value: 1 }
      ],
      user: Object.assign({}, defaultUser),
      allColumnsSelected: [],
      tableColumns: [],
      multipleSelection: [],
      defaultProps: {
        children: "childrens",
        label: "name"
      },
      departments: [],
      roles: [],
      activeName: "first",
      dialogVisible: false,
      dialogType: "new",
      rules: {
        name: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        vserName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10 个字符", trigger: "blur" }
        ],
        deptid: [{ required: true, message: "请选择部门", trigger: "change" }],
        state: [{ required: true, message: "请选择状态", trigger: "change" }]
      }
    };
  },
  watch: {
    searchDeptName(val) {
      this.$refs.serchDeptTree.filter(val);
    }
  },
  created() {},
  mounted() {
    this.getList();
    this.getDepartments();
    this.getJobs();
    this.getRoles();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await userList(this.listQuery);
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
    formatDept(row, column) {
      return row.deptName + " / " + row.jobName;
    },
    formatRole(row, column) {
      var roleNames = [];
      row.roles.forEach(role => {
        roleNames.push(role.name);
      });
      return roleNames.join(" , ");
    },
    // 用户状态修改
    handleStateChange(row) {
      const text = row.state === 1 ? "启用" : "禁用";
      this.$confirm(
        "确认要 [" + text + "] [" + row.name + "] 用户吗?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          await updateState({ uid: row.uid, state: row.state });
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
    async getDepartments() {
      const res = await departments();
      const result = res.result;
      this.diGuiTree(result);
      this.departments = [{ id: 0, name: "部门树", childrens: result }];
    },
    async getJobs() {
      const res = await jobs();
      this.jobs = res.result;
    },
    async getRoles() {
      const res = await roles();
      this.roles = res.result;
    },
    clearSearchDept() {
      this.listQuery.deptid = undefined;
    },
    diGuiTree(item) {
      // 递归便利树结构
      item.forEach(item => {
        item.childrens === "" ||
        item.childrens === undefined ||
        item.childrens === null
          ? delete item.childrens
          : this.diGuiTree(item.childrens);
      });
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.childrens
      };
    },
    queryJobSearch(queryString, cb) {
      var jobs = this.jobs;
      var results = queryString
        ? jobs.filter(this.createJobFilter(queryString))
        : jobs;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createJobFilter(queryString) {
      return jobs => {
        return jobs.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    handleJobSelect(item) {
      this.user.jobid = item.id;
      this.user.jobName = item.name;
    },
    handleCreate() {
      this.dialogType = "new";
      this.activeName = "first";
      this.dialogVisible = true;
      this.user = Object.assign({}, defaultUser);
    },
    handleEdit(row) {
      this.dialogType = "edit";
      this.activeName = "first";
      this.dialogVisible = true;
      row.roleIds = [];
      this.user = deepClone(row);
      if (this.user.roles) {
        const roleIds = this.user.roleIds;
        this.user.roles.forEach(role => {
          roleIds.push(role.id);
        });
      }
    },
    async confirmUser() {
      const isEdit = this.dialogType === "edit";
      if (isEdit) {
        await updateUser(this.user);
      } else {
        await addUser(this.user);
      }
      this.dialogVisible = false;
      this.$message({
        showClose: true,
        message: "保存成功",
        type: "success"
      });
      this.getList();
    },
    // 节点单击事件
    handleSearchDeptNode(data) {
      this.isShowSelect = false;
      this.listQuery.deptid = data.id;
      this.getList();
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleDelete(row) {
      this.$confirm("确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await deleteUser(row.uid);
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
