<template>
  <div class="app-container">
    <aside style="margin-top:15px;">城市控件组件: {{region}}</aside>
    <city-control placeholder="请选择" v-model="region" @selected="onSelected" clearable />
  </div>
</template>
<script>
import CityControl from "@/components/CityControl"; //

export default {
  name: "CityControlDemo",
  components: { CityControl },

  data() {
    return {
      region: ""
    };
  },

  methods: {
    onSelected(data) {
      this.region =
        data.province.value + "-" + data.city.value + "-" + data.area.value;
    }
  }
};
</script>
