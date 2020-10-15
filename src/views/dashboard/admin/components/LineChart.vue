<template>
  <div
    id="container"
    :class="className"
    :style="{ height: height, width: width }"
  />
</template>

<script>
import { Chart } from "@antv/g2";
import resize from "./mixins/resize";

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
      default: "350px",
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    chartData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        //chart.data(val);
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  methods: {
    initChart() {
      const chart = new Chart({
        container: "container",
        autoFit: true,
        height: 500,
      });

      chart.data(this.chartData);
      chart.scale({
        month: {
          range: [0, 1],
        },
        temperature: {
          nice: true,
        },
      });

      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });

      chart.axis("temperature", {
        label: {
          formatter: (val) => {
            return val + " °C";
          },
        },
      });

      chart.line().position("month*temperature").color("city").shape("smooth");

      chart.point().position("month*temperature").color("city").shape("circle");

      chart.render();
    },
  },
};
</script>
