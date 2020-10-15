<template>
  <div id="barChart" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import { Chart } from "@antv/g2";
import resize from "./mixins/resize";

const animationDuration = 6000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "300px",
    },
  },
  data() {
    return {
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },

  methods: {
    initChart() {
      const data = [
        { name: "London", 月份: "Jan.", 月均降雨量: 18.9 },
        { name: "London", 月份: "Feb.", 月均降雨量: 28.8 },
        { name: "London", 月份: "Mar.", 月均降雨量: 39.3 },
        { name: "London", 月份: "Apr.", 月均降雨量: 81.4 },
        { name: "London", 月份: "May", 月均降雨量: 47 },
        { name: "London", 月份: "Jun.", 月均降雨量: 20.3 },
        { name: "London", 月份: "Jul.", 月均降雨量: 24 },
        { name: "London", 月份: "Aug.", 月均降雨量: 35.6 },
        { name: "Berlin", 月份: "Jan.", 月均降雨量: 12.4 },
        { name: "Berlin", 月份: "Feb.", 月均降雨量: 23.2 },
        { name: "Berlin", 月份: "Mar.", 月均降雨量: 34.5 },
        { name: "Berlin", 月份: "Apr.", 月均降雨量: 99.7 },
        { name: "Berlin", 月份: "May", 月均降雨量: 52.6 },
        { name: "Berlin", 月份: "Jun.", 月均降雨量: 35.5 },
        { name: "Berlin", 月份: "Jul.", 月均降雨量: 37.4 },
        { name: "Berlin", 月份: "Aug.", 月均降雨量: 42.4 },
      ];

      const chart = new Chart({
        container: "barChart",
        autoFit: true,
        height: 300,
      });

      chart.data(data);
      chart.scale("月均降雨量", {
        nice: true,
      });
      chart.tooltip({
        shared: true,
        showMarkers: false,
      });

      chart
        .interval()
        .position("月份*月均降雨量")
        .color("name")
        .adjust("stack");

      chart.interaction("active-region");

      chart.render();
    },
  },
};
</script>
