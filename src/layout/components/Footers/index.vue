<template>
  <div class="footer">
    <div class="links">
      <a href="https://cn.vuejs.org/" target="_blank">Vue</a>
      <a href="https://gitee.com/xyy12611/link-admin-ui" target="_blank"
        >Gitee</a
      >
      <a href="https://element.eleme.io" target="_blank">Element</a>
    </div>
    <div class="copyright">Copyright © 2021 252956</div>
  </div>
</template>

<script>
export default {
  name: "PageFooter",
};
</script>

<style lang="scss" scoped>
.footer {
  padding: 0 16px;
  padding: 24px 0 24px;
  text-align: center;
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
  .links {
    margin-bottom: 8px;
    a:not(:last-child) {
      margin-right: 40px;
    }
    a {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      -webkit-transition: all 0.3s;
      transition: all 0.3s;
    }
  }
}
</style>