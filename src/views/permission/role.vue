<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="角色名"
        style="width: 200px"
        class="filter-item"
      />

      <el-button type="primary" icon="el-icon-search" @click="handleSearch"
        >查找</el-button
      >

      <div class="toolbar-right">
        <el-button-group>
          <el-button
             v-action="permission.add"
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate"
            >新增</el-button
          >
          <el-button
            ref="editButton"
             v-action="permission.edit"
            type="primary"
            icon="el-icon-edit"
            @click="handleSelectionEdit"
            >编辑</el-button
          >
          <el-button
            ref="dataScopeButton"
             v-action="permission.datascope"
            type="primary"
            icon="el-icon-edit"
            @click="handleSelectionDataScope"
            >数据权限</el-button
          >
          <el-button
            ref="delButton"
             v-action="permission.del"
            type="primary"
            icon="el-icon-delete"
            @click="handleSelectionDel"
            >删除</el-button
          >
         
        </el-button-group>
      </div>
    </div>

    <el-table
      ref="multipleTable"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%"
      height="450"
      highlight-current-row
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="name" label="角色名" />
      <!-- <el-table-column prop="levels" label="级别"></el-table-column> -->
      <el-table-column
        prop="data_scope"
        label="数据权限"
        :formatter="formatDataScope"
      />
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
      <el-table-column prop="description" label="描述" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
             v-action="permission.datascope"
            size="small"
            type="text"
            @click="handleDataScope(scope.row)"
            >数据权限</el-button
          >
          <el-button
             v-action="permission.edit"
            type="text"
            size="small"
            @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button
             v-action="permission.del"
            type="text"
            size="small"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType === 'edit' ? '编辑' : '新增'"
    >
      <el-form
        ref="roleForm"
        :model="role"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="name">
          <el-input v-model="role.name" placeholder="角色名" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item label="权限许可">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="permissions"
            :props="defaultProps"
            default-expand-all
            show-checkbox
            node-key="id"
            class="permission-tree"
            @check="checkPermissionTree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog
      :title="'分配数据权限'"
      :visible.sync="dataScopeDialogVisible"
      width="500px"
    >
      <el-form :model="role" label-width="80px">
        <el-form-item label="角色名称">{{ role.name }}</el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="role.data_scope">
            <el-option
              v-for="item in dataScopes"
              :key="parseInt(item.data_key)"
              :label="item.data_value"
              :value="parseInt(item.data_key)"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="role.data_scope == 2" label="数据权限">
          <el-tree
            ref="deptTree"
            :data="departments"
            show-checkbox
            default-expand-all
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div style="text-align: right">
        <el-button type="danger" @click="dataScopeDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" @click="submitDataScope">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import permission from "@/directive/permission/index.js"; // 权限判断指令
import {
  roleList,
  addRole,
  updateRole,
  deleteRole,
  saveDataScope,
  queryDataScope,
  updateState,
} from "@/api/permission/role";
import { permissions, permissionsByRole } from "@/api/permission/permission";
import { departments } from "@/api/permission/department";
import { dictInfo } from "@/api/permission/dict";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { deepClone } from "@/utils";
const defaultRole = {
  id: undefined,
  name: "",
  description: "",
  permIds: [],
  data_scope: undefined,
  deptIds: [],
};
export default {
  name: "Role",
  components: { Pagination },
  directives: { permission },
  data() {
    return {
      permission: {
        list: "role:list",
        add: "role:add",
        edit: "role:edit",
        del: "role:del",
        datascope: "role:datascope",
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        name: "",
      },
      allColumnsSelected: [],
      tableColumns: [],
      multipleSelection: [],
      role: Object.assign({}, defaultRole),
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "childrens",
        label: "name",
      },
      permissions: [],
      permissionsByRole: [],
      dataScopeDialogVisible: false,
      departments: [],
      dataScopes: [],
      rules: {
        name: [
          { required: true, message: "请输入角色名", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 1 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getPermissions();
    this.getDepartments();
    this.getDataScopes();
  },
  methods: {
    async getList() {
      this.listLoading = true;
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await roleList(this.listQuery);
        this.listLoading = false;
        this.list = res.result.rows;
        this.total = res.result.records;
      } catch (e) {
        this.listLoading = false;
      }
    },
    formatDataScope(row, column) {
      var val = "";
      if (row.data_scope != null) {
        for (var item of this.dataScopes) {
          if (parseInt(item.data_key) === row.data_scope) {
            val = item.data_value;
            break;
          }
        }
      }
      return val;
    },
    async getPermissions() {
      const res = await permissions();
      this.permissions = res.result;
    },
    async getPermissionsByRole(roleId) {
      const res = await permissionsByRole(roleId);
      this.permissionsByRole = res.result;
    },
    async getDataScopes() {
      const res = await dictInfo("data_scope");
      this.dataScopes = res.result;
    },
    async getDepartments() {
      const res = await departments();
      this.departments = res.result;
    },
    handleSearch() {
      this.getList();
    },
    // 权限树
    checkPermissionTree(currentObj, treeStatus) {
      const currentNode = this.$refs.tree.getNode(currentObj);
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      const selected = treeStatus.checkedKeys.indexOf(currentNode.key); // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentNode);
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentNode, true);
      } else {
        // 未选中 处理子节点全部未选中
        if (currentNode.childNodes) {
          if (currentNode.childNodes.length !== 0) {
            this.uniteChildSame(currentNode, false);
          }
        }
      }
    },
    // 统一处理子节点为相同的勾选状态
    uniteChildSame(currentNode, isSelected) {
      this.$refs.tree.setChecked(currentNode.key, isSelected);
      if (currentNode.childNodes) {
        for (let i = 0; i < currentNode.childNodes.length; i++) {
          this.uniteChildSame(currentNode.childNodes[i], isSelected);
        }
      }
    },
    // 统一处理父节点为选中
    selectedParent(currentNode) {
      if (currentNode.parent.key !== undefined) {
        this.$refs.tree.setChecked(currentNode.parent, true);
        this.selectedParent(currentNode.parent);
      }
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
          type: "warning",
        }
      )
        .then(async () => {
          await updateState({ id: row.id, state: row.state });
          this.$message({
            message: text + "成功",
            type: "success",
          });
        })
        .catch((err) => {
          console.error(err);
          row.state = row.state === 0 ? 1 : 0;
        });
    },
    handleCreate() {
      this.role = Object.assign({}, defaultRole);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([]);
      }
      this.checkStrictly = true;
      this.dialogType = "new";
      this.dialogVisible = true;
    },
    generateArr(routes) {
      let data = [];
      routes.forEach((route) => {
        data.push(route);
        if (route.childrens) {
          const temp = this.generateArr(route.childrens);
          if (temp.length > 0) {
            data = [...data, ...temp];
          }
        }
      });
      return data;
    },
    async handleEdit(row) {
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.role = deepClone(row);
      const res = await permissionsByRole(this.role.id);
      this.permissionsByRole = res.result;
      this.$nextTick(() => {
        if (this.permissionsByRole != null) {
          this.$refs.tree.setCheckedNodes(
            this.generateArr(this.permissionsByRole)
          );
        } else {
          this.$refs.tree.setCheckedNodes([]);
        }
      });
    },
    async confirmRole() {
      const isEdit = this.dialogType === "edit";
      this.role.permIds = this.$refs.tree.getCheckedKeys();
      if (isEdit) {
        await updateRole(this.role);
      } else {
        await addRole(this.role);
      }
      this.dialogVisible = false;
      this.$message({
        showClose: true,
        message: "保存成功",
        type: "success",
      });
      this.getList();
    },
    handleDelete(row) {
      this.$confirm("确认删除角色?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await deleteRole(row.id);
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
          this.getList();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async setCheckDeptTree(roleId) {
      const res = await queryDataScope(roleId);
      this.$refs.deptTree.setCheckedKeys(res.result);
    },
    handleDataScope(row) {
      this.role = deepClone(row);
      if (this.$refs.deptTree) {
        this.$refs.deptTree.setCheckedKeys([]);
      }
      if (row.data_scope === 2) {
        this.setCheckDeptTree(row.id);
      }
      this.dataScopeDialogVisible = true;
    },
    /** 提交按钮（数据权限） */
    async submitDataScope() {
      if (this.role.id) {
        this.role.deptIds = this.$refs.deptTree.getCheckedKeys();
        await saveDataScope(this.role);
        this.dataScopeDialogVisible = false;
        this.$message({
          showClose: true,
          message: "操作成功",
          type: "success",
        });
        this.getList();
      }
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
        this.$refs.dataScopeButton.disabled = true;
      } else {
        this.$refs.editButton.disabled = false;
        this.$refs.delButton.disabled = false;
        this.$refs.dataScopeButton.disabled = false;
      }
    },
    handleSelectionEdit() {
      if (this.multipleSelection.length != 1) {
        this.$message.error("请选择一条数据");
        return;
      }
      this.handleEdit(this.multipleSelection[0]);
    },
    handleSelectionDataScope() {
      if (this.multipleSelection.length != 1) {
        this.$message.error("请选择一条数据");
        return;
      }
      this.handleDataScope(this.multipleSelection[0]);
    },
    handleSelectionDel() {
      if (this.multipleSelection.length != 1) {
        this.$message.error("请选择一条数据");
        return;
      }
      this.handleDelete(this.multipleSelection[0]);
    },
  },
};
</script>
