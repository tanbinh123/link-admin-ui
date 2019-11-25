<template>
  <div class="app-container">
    <div style="margin-top:20px;max-width:600px;margin-left: 80px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
        </el-col>
        <el-col :span="4">
          <el-button class="filter-item" type="primary" @click="() => handleCreate()">
            <i class="el-icon-plus" /> 添加
          </el-button>
        </el-col>
      </el-row>
      <el-row style="padding-top:20px">
        <el-col>
          <el-tree
            ref="tree"
            :data="permissions"
            :props="defaultProps"
            node-key="id"
            class="permission-tree"
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span>
                <el-button
                  v-permission="['/rest/permission/add']"
                  type="text"
                  size="mini"
                  @click="() => handleCreate(data)"
                >添加子项</el-button>
                <el-button
                  v-permission="['/rest/permission/update']"
                  type="text"
                  size="mini"
                  @click="() => handleEdit(node,data)"
                >编辑</el-button>
                <el-button
                  v-permission="['/rest/permission/delete']"
                  type="text"
                  size="mini"
                  @click="() => handleDelete(data)"
                >删除</el-button>
              </span>
            </span>
          </el-tree>
        </el-col>
      </el-row>
    </div>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'" width="600px">
      <el-form ref="form" :inline="true" :rules="rules" size="small" label-width="80px">
        <el-form-item label="权限类型">
          <el-radio-group v-model="permission.types" size="mini" style="width: 178px">
            <el-radio-button label="0">目录</el-radio-button>
            <el-radio-button label="1">菜单</el-radio-button>
            <el-radio-button label="2">按钮</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="permission.types.toString() !== '2'" label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="450"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selected" />
            <el-input
              slot="reference"
              v-model="permission.icon"
              style="width: 450px;"
              placeholder="点击选择图标"
              clearable
            >
              <svg-icon
                v-if="permission.icon"
                slot="prefix"
                :icon-class="permission.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>
        <el-form-item v-show="permission.types.toString() !== '2'" label="外链">
          <el-radio-group v-model="permission.i_frame" size="mini">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="permission.types.toString() !== '2'" label="缓存">
          <el-radio-group v-model="permission.cache" size="mini">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="permission.types.toString() !== '2'" label="隱藏">
          <el-radio-group v-model="permission.hidden" size="mini">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="权限名">
          <el-input v-model="permission.name" placeholder="权限名" />
        </el-form-item>

        <el-form-item label="路由地址">
          <el-input v-model="permission.url" placeholder="路由地址" style="width: 450px;" />
        </el-form-item>

        <el-form-item
          v-show="permission.i_frame == false && permission.types.toString() === '1'"
          label="组件名称"
        >
          <el-input
            v-model="permission.component_name"
            style="width: 178px;"
            placeholder="匹配组件内Name字段"
          />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number
            v-model.number="permission.sorts"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 178px;"
          />
        </el-form-item>
        <el-form-item
          v-show="permission.i_frame == false && permission.types.toString() === '1'"
          label="组件路径"
        >
          <el-input v-model="permission.component_path" style="width: 450px;" placeholder="组件路径" />
        </el-form-item>
        <el-form-item label="上级权限">
          <treeselect
            v-model="permission.parentId"
            style="width: 450px;"
            :options="permissions"
            :normalizer="normalizer"
            placeholder="选择上级权限"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'
import permission from '@/directive/permission/index.js' // 权限判断指令
import {
  permissions,
  addPermission,
  updatePermission,
  deletePermission
} from '@/api/permission/permission'
import { deepClone } from '@/utils'
const defaultPermission = {
  id: undefined,
  name: '',
  parentId: undefined,
  parentName: '',
  url: '',
  types: 0,
  sorts: undefined,
  component_name: '',
  component_path: '',
  icon: '',
  cache: 0,
  hidden: 0,
  i_frame: 0
}
export default {
  name: 'Permission',
  components: { Treeselect, IconSelect },
  directives: { permission },
  data() {
    return {
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      permission: Object.assign({}, defaultPermission),
      permissions: [],
      dialogVisible: false,
      dialogType: 'new',
      filterText: '',
      rules: {
        types: [
          { required: true, message: '请选择权限类型', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入权限名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        url: [{ required: true, message: '请输入路由地址', trigger: 'blur' }],
        parentId: [
          { required: true, message: '请选择上级权限', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getPermissions()
  },
  methods: {
    async getPermissions() {
      const res = await permissions()
      const result = res.result
      this.diGuiTree(result)
      this.permissions = [{ id: 0, name: '权限树', childrens: result }]
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    diGuiTree(item) {
      // 递归便利树结构
      item.forEach(item => {
        item.childrens === '' ||
        item.childrens === undefined ||
        item.childrens === null
          ? delete item.childrens
          : this.diGuiTree(item.childrens)
      })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.childrens
      }
    },
    selected(name) {
      this.permission.icon = name
    },
    handleCreate(data) {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.permission = Object.assign({}, defaultPermission)
      if (data != null) {
        this.permission.parentId = data.id
        this.permission.parentName = data.name
      }
    },

    async handleEdit(node, data) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.permission = deepClone(data)
      const parent = node.parent.data
      this.permission.parentId = parent.id
      this.permission.parentName = parent.name
    },
    async confirmPermission() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updatePermission(this.permission)
      } else {
        await addPermission(this.permission)
      }
      this.dialogVisible = false
      this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      })
      this.getPermissions()
    },
    handleDelete(data) {
      this.$confirm('确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deletePermission(data.id)
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getPermissions()
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
