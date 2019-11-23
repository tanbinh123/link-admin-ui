<template>
  <div class="app-container" style>
    <div style="margin-top:20px;max-width:600px;margin-left: 80px;">
      <el-row :gutter="20">
        <el-col :span="20">
          <el-input v-model="filterText" placeholder="输入关键字进行过滤" clearable />
        </el-col>
        <el-col :span="4">
          <el-button class="filter-item" type="primary" @click="handleCreate()">
            <i class="el-icon-plus" /> 添加
          </el-button>
        </el-col>
      </el-row>
      <el-row style="padding-top:20px">
        <el-col>
          <el-tree
            ref="tree"
            :data="departments"
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
                  v-permission="['/rest/department/add']"
                  type="text"
                  size="mini"
                  @click="() => handleCreate(data)"
                >添加子项</el-button>
                <el-button
                  v-permission="['/rest/department/update']"
                  type="text"
                  size="mini"
                  @click="() => handleEdit(node,data)"
                >编辑</el-button>
                <el-button
                  v-permission="['/rest/department/delete']"
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form
        ref="form"
        :model="department"
        :rules="rules"
        label-width="80px"
        label-position="right"
      >
        <el-form-item label="上级部门" prop="parentId">
          <!-- <span>{{department.parentName}}</span> -->
          <treeselect
            v-model="department.parentId"
            :options="departments"
            :normalizer="normalizer"
            placeholder="选择上级部门"
          />
        </el-form-item>
        <el-form-item label="部门名" prop="name">
          <el-input v-model="department.name" placeholder="部门名" />
        </el-form-item>
        <!-- <el-form-item label="级别">
          <el-select v-model="department.levels" style="width: 140px" class="filter-item">
            <el-option
              v-for="item in levelsOptions"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>-->
        <el-form-item label="排序">
          <el-input v-model="department.sorts" placeholder="排序" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmDepartment">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import permission from '@/directive/permission/index.js' // 权限判断指令
import {
  departments,
  addDpartment,
  updateDpartment,
  deleteDpartment
} from '@/api/permission/department'
import { deepClone } from '@/utils'
const defaultDepartment = {
  id: undefined,
  name: '',
  parentId: undefined,
  parentName: '',
  levels: undefined,
  deleted: 0
}
export default {
  name: 'Department',
  components: { Treeselect },
  directives: { permission },
  data() {
    return {
      defaultProps: {
        children: 'childrens',
        label: 'name'
      },
      department: Object.assign({}, defaultDepartment),
      departments: [],
      dialogVisible: false,
      dialogType: 'new',
      levelsOptions: [
        { label: '集团', key: 0 },
        { label: '分公司', key: 1 },
        { label: '部门', key: 2 }
      ],
      filterText: '',
      rules: {
        name: [
          { required: true, message: '请输入部门名', trigger: 'blur' },
          { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择上级部门', trigger: 'change' }
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
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await departments()
      const result = res.result
      this.diGuiTree(result)
      this.departments = [{ id: 0, name: '部门树', childrens: result }]
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
    handleCreate(data) {
      this.dialogType = 'new'
      this.dialogVisible = true
      this.department = Object.assign({}, defaultDepartment)
      if (data != null) {
        this.department.parentId = data.id
        this.department.parentName = data.name
      }
    },

    async handleEdit(node, data) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.department = deepClone(data)
      const parent = node.parent.data
      this.department.parentId = parent.id
      this.department.parentName = parent.name
    },
    async confirmDepartment() {
      const isEdit = this.dialogType === 'edit'
      if (isEdit) {
        await updateDpartment(this.department)
      } else {
        await addDpartment(this.department)
      }
      this.dialogVisible = false
      this.$message({
        showClose: true,
        message: '保存成功',
        type: 'success'
      })
      this.getDepartments()
    },
    handleDelete(data) {
      this.$confirm('确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteDpartment(data.id)
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getDepartments()
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
