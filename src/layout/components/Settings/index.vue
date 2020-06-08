<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">整体风格设置</h3>
      <div class="drawer-item">
        <div style="display: flex;">
          <div @click="sidebarColorChange('light')" class="block-checbox-item">
            <a href="#">
              <svg-icon icon-class="layout-light" size="45" />
            </a>
            <div v-if="sidebarColor==='light'" class="block-checbox-selectIcon">
              <svg-icon icon-class="yes" size="15" />
            </div>
          </div>
          <div @click="sidebarColorChange('dark')" class="block-checbox-item">
            <a href="#">
              <svg-icon icon-class="layout-dark" size="45" />
            </a>
            <div v-if="sidebarColor==='dark'" class="block-checbox-selectIcon">
              <svg-icon icon-class="yes" size="15" />
            </div>
          </div>
        </div>
      </div>
      <h3 class="drawer-title">系统布局配置</h3>

      <div class="drawer-item">
        <span>主题色</span>
        <theme-picker
          style="float: right;height: 26px;margin: -3px 8px 0 0;"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>开启 Tags-View</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>固定 Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>侧边栏 Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  components: { ThemePicker },
  data() {
    return {};
  },
  computed: {
    fixedHeader: {
      get() {
        return this.$store.getters.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("app/changeSetting", {
          key: "fixedHeader",
          value: val
        });
      }
    },
    tagsView: {
      get() {
        return this.$store.getters.tagsView;
      },
      set(val) {
        this.$store.dispatch("app/changeSetting", {
          key: "tagsView",
          value: val
        });
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.getters.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("app/changeSetting", {
          key: "sidebarLogo",
          value: val
        });
      }
    },
    sidebarColor: function() {
      return this.$store.getters.sidebarColor;
    }
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch("app/changeSetting", {
        key: "theme",
        value: val
      });
    },
    sidebarColorChange(val) {
      this.$store.dispatch("app/changeSetting", {
        key: "sidebarColor",
        value: val
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
    span {
      padding-right: 15px;
    }
    .block-checbox-item {
      position: relative;
      margin-right: 16px;
      border-radius: 2px;
      cursor: pointer;
      .block-checbox-selectIcon {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        padding-top: 15px;
        padding-left: 24px;
        color: #f5222d;
        font-weight: 700;
        font-size: 14px;
      }
    }
  }

  .drawer-switch {
    float: right;
  }
}
</style>
