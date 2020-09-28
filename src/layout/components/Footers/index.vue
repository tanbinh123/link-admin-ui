<template>
  <div class="footer">
    <!-- <div class="links">
      <a href="https://cn.vuejs.org/" target="_blank">Vue</a>
      <a href="https://github.com/252956/vue-link-admin" target="_blank">Github</a>
      <a href="https://github.com/ElemeFE/element" target="_blank">Element</a>
    </div> -->
    <div class="copyright">Copyright © 2020 252956</div>
  </div>
</template>

<script>
export default {
  name: 'PageFooter',
  props: ['copyright', 'linkList']
}
</script>

<style lang="scss" scoped>
  .footer{
    padding: 0 16px;
    padding: 24px 0 24px;
    text-align: center;
    .copyright{
      color: rgba(0,0,0,.45);
      font-size: 14px;
    }
    .links{
      margin-bottom: 8px;
      a:not(:last-child) {
        margin-right: 40px;
      }
      a{
        font-size: 14px;
        color: rgba(0,0,0,.45);
        -webkit-transition: all .3s;
        transition: all .3s;
      }
    }
  }
</style>