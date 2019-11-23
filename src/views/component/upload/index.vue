<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top:30px;">
      <el-input
        v-model="listQuery.name"
        placeholder="文件名"
        style="width: 200px;"
        class="filter-item"
      />

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleSearch">查找</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >上传TikTok</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      style="width: 100%;"
      height="450"
    >
      <el-table-column prop="name" label="文件名" />
      <el-table-column prop="path" label="路径" />
      <el-table-column prop="createtime" label="上传时间" :formatter="formatDateTime" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleView(scope)">查看</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'上传'">
      <div style="text-align:center;">
        <el-upload
          class="upload-demo"
          drag
          :headers="headersObj"
          :action="uplodatPath"
          :before-upload="beforeUploadVideo"
          :on-success="handleVideoSuccess"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div slot="tip" class="el-upload__tip">
            只能上传"video/mp4",
            "video/ogg",
            "video/flv",
            "video/avi",
            "video/wmv",
            "video/rmvb"文件，且不超过50M
          </div>
        </el-upload>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible1">
      <div style="text-align:center;">
        <video
          :src="videoUrl"
          controls="controls"
          style=" width: 500px; height: 550px;max-width: 90%;"
        >您的浏览器不支持视频播放</video>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { tiktokList, deleteTikTok } from '@/api/video/tiktok'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { formatDateTime } from '@/utils'
const token = getToken()
export default {
  name: 'Upload',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        name: ''
      },
      headersObj: { 'LinkAdmin-Token': token },
      uplodatPath:
        process.env.VUE_APP_BASE_API_URL + '/rest/video/tiktok/upload',
      dialogVisible: false,
      dialogVisible1: false,
      dialogType: 'new',
      videoUrl: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      // If the Promise is rejected, the rejected value is thrown.
      try {
        const res = await tiktokList(this.listQuery)
        this.listLoading = false
        this.list = res.result.rows
        this.total = res.result.records
      } catch (e) {
        this.listLoading = false
      }
    },
    handleSearch() {
      this.getList()
    },
    formatDateTime(row, column) {
      return formatDateTime(row.createtime)
    },
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 50
      if (
        [
          'video/mp4',
          'video/ogg',
          'video/flv',
          'video/avi',
          'video/wmv',
          'video/rmvb'
        ].indexOf(file.type) === -1
      ) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt10M) {
        this.$message.error('上传视频大小不能超过50MB哦!')
        return false
      }
    },
    handleVideoSuccess(res, file) {
      // 获取上传图片地址
      if (res.code === 20000) {
        this.$message.success('上传成功')
        this.getList()
      } else {
        this.$message.error(res.msg)
      }
    },
    handleCreate() {
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleView({ row }) {
      this.dialogVisible1 = true
      this.videoUrl =
        process.env.VUE_APP_BASE_API_URL +
        '/rest/video/tiktok/view?path=' +
        row.name
    },
    handleDelete({ row }) {
      this.$confirm('确认删除?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteTikTok(row.id)
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
          this.getList()
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
