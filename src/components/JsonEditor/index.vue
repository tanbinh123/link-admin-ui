<template>
  <div style=" height: auto; width: 100%; position: relative;">
    <div class="json-editor">
      <textarea ref="textarea" />
    </div>
    <div style="margin-top: 10px;">
      <el-button type="primary" @click="jsonFormat">格式化</el-button>
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror'
import 'codemirror/addon/lint/lint.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/rubyblue.css'
require('script-loader!jsonlint')
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/lint/lint'
import 'codemirror/addon/lint/json-lint'

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: ['value'],
  data() {
    return {
      jsonEditor: false
    }
  },
  watch: {
    value(value) {
      const editorValue = this.jsonEditor.getValue()
      if (value !== editorValue) {
        this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
      }
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'default',
      lint: true,
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true
    })

    this.jsonEditor.setValue(JSON.stringify(this.value, null, 2))
    this.jsonEditor.on('change', cm => {
      this.$emit('changed', cm.getValue())
      this.$emit('input', cm.getValue())
    })
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue()
    },
    jsonFormat() {
      if (typeof this.value === 'object') {
        return
      }
      this.jsonEditor.setValue(JSON.stringify(JSON.parse(this.value), null, 2))
    }
  }
}
</script>

<style scoped>
.json-editor {
  border: 1px solid #e1e1e1;
  font-size: 14px;
}
.json-editor >>> .CodeMirror {
  height: 460px;
  min-height: 300px;
}
.json-editor >>> .CodeMirror-scroll {
  min-height: 300px;
}
.json-editor >>> .cm-s-rubyblue span.cm-string {
  color: #f08047;
}
</style>
