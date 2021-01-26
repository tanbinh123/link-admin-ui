<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <el-link
          type="primary"
          :underline="false"
          v-if="!collapse"
          class="sidebar-title"
          >{{ title }}</el-link
        >
      </router-link>
    </transition>
  </div>
</template>

<script>
import avatarGif from "@/assets/logo.png";
import settings from "@/settings";
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: settings.title,
      logo: avatarGif,
    };
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
</style>
