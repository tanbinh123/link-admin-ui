<template>
  <div class="app-container">
    <el-input
      v-model="filename"
      placeholder="Please enter the file name (default file)"
      style="width:300px;"
      prefix-icon="el-icon-document"
    />
    <el-button
      :loading="downloadLoading"
      style="margin-bottom:20px;"
      type="primary"
      icon="el-icon-document"
      @click="handleDownload"
    >Export Zip</el-button>
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="Author" width="95" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.author }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Readings" width="115" align="center">
        <template slot-scope="scope">{{ scope.row.pageviews }}</template>
      </el-table-column>
      <el-table-column align="center" label="Date" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Zip',
  data() {
    return {
      list: [
        {
          id: 1,
          title: '111111111111',
          author: '哈哈',
          pageviews: 200,
          timestamp: 1574473177122
        },
        {
          id: 2,
          title: '222222222222',
          author: '嘿嘿',
          pageviews: 566,
          timestamp: 1574473177122
        },
        {
          id: 3,
          title: '333333333333333',
          author: '嗯嗯',
          pageviews: 5956,
          timestamp: 1574473177122
        }
      ],
      downloadLoading: false,
      filename: ''
    }
  },
  created() {},
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Zip').then(zip => {
        const tHeader = ['Id', 'Title', 'Author', 'Readings', 'Date']
        const filterVal = [
          'id',
          'title',
          'author',
          'pageviews',
          'timestamp'
        ]
        const list = this.list
        const data = this.formatJson(filterVal, list)
        zip.export_txt_to_zip(tHeader, data, this.filename, this.filename)
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>
