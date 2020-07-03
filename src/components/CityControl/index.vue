<template>
  <div class="city-control">
    <el-input
      v-popover:popover
      v-bind="$attrs"
      :clearable="clearable"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    ></el-input>
    <el-popover placement="bottom-start" trigger="click" ref="popover">
      <div :class="wrapper">
        <div :class="addressHeader">
          <ul>
            <li :class="{'active': tab === 1}" @click="resetProvince">
              <a>{{ province ? province : placeholders.province }}</a>
            </li>
            <template v-if="!hideCity">
              <li v-if="showCityTab" :class="{'active': tab === 2}" @click="resetCity">
                <a>{{ city ? city : placeholders.city }}</a>
              </li>
            </template>
            <template v-if="!hideArea">
              <li v-if="showAreaTab " :class="{'active': tab === 3}">
                <a>{{ area ? area : placeholders.area }}</a>
              </li>
            </template>
          </ul>
        </div>
        <div :class="addressContainer">
          <ul v-if="tab === 1">
            <li
              v-for="(item, index) in provinces"
              :class="{'active': item === province}"
              @click="chooseProvince(index,item)"
              :key="index"
            >
              <a>{{ item }}</a>
            </li>
          </ul>
          <template v-if="!hideCity">
            <ul v-if="tab === 2">
              <li
                v-for="(item, index) in cities"
                :class="{'active': item === city}"
                @click="chooseCity(index,item)"
                :key="index"
              >
                <a>{{ item }}</a>
              </li>
            </ul>
          </template>
          <template v-if="!hideArea">
            <ul v-if="tab === 3 ">
              <li
                v-for="(item, index) in areas"
                :class="{'active': item === area}"
                @click="chooseArea(index,item)"
                :key="index"
              >
                <a>{{ item }}</a>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import DISTRICTS from "./citydata";

const DEFAULT_CODE = 100000;

export default {
  name: "CityControl",
  inheritAttrs: false,
  props: {
    size: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: "text"
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    hideCity: { type: Boolean, default: false },
    hideArea: { type: Boolean, default: false },
    addressHeader: { type: String, default: "address-header" },
    addressContainer: { type: String, default: "address-container" },
    wrapper: { type: String, default: "distpicker-address-wrapper" },
    districts: {
      type: [Array, Object],
      default() {
        return DISTRICTS;
      }
    }
  },
  data() {
    return {
      province: "",
      city: "",
      area: "",
      provinceCode: "",
      cityCode: "",
      areaCode: "",
      placeholders: {
        province: "省",
        city: "市",
        area: "区"
      },
      tab: 1,
      showCityTab: false,
      showAreaTab: false,
      provinces: [],
      cities: [],
      areas: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    handleBlur(event) {
      this.$emit("blur", event);
    },
    handleFocus(event) {
      this.$emit("focus", event);
    },
    handleInput(value) {
      this.$emit("input", value);
    },
    handleChange(value) {
      this.$emit("change", value);
    },
    initData() {
      this.provinces = this.getProvinces();
      if (this.province) {
        this.provinceCode = this.getCode(this.province);
        if (this.city && this.provinceCode) {
          this.cityCode = this.getCode(this.city, this.provinceCode);
          if (this.area && this.cityCode) {
            this.areaCode = this.getCode(this.area, this.cityCode);
          }
        }
      }
      if (!this.hideCity && this.city) {
        this.cities = this.getCities();
        this.tab = 2;
        this.showCityTab = true;
      }
      if (!this.hideArea && this.area) {
        this.areas = this.getAreas();
        this.tab = 3;
        this.showCityTab = true;
        this.showAreaTab = true;
      }
    },
    resetProvince() {
      this.tab = 1;
      this.provinces = this.getProvinces();
      this.showCityTab = false;
      this.showAreaTab = false;
    },
    resetCity() {
      this.tab = 2;
      this.showCityTab = true;
      this.showAreaTab = false;
    },
    resetArea() {},
    chooseProvince(code, value) {
      this.province = value;
      this.provinceCode = code;
      this.city = "";
      this.cityCode = "";
      this.area = "";
      this.areaCode = "";
      if (this.hideCity) {
        this.$refs.popover.doClose();
        let data = {
          province: {
            code: this.provinceCode,
            value: this.province
          },
          city: {
            code: "",
            value: ""
          },
          area: {
            code: "",
            value: ""
          }
        };
        this.$emit("selected", data);
        return;
      }
      this.tab = 2;
      this.showCityTab = true;
      this.showAreaTab = false;
      this.cities = this.getCities();
    },
    chooseCity(code, value) {
      this.city = value;
      this.cityCode = code;
      this.area = "";
      this.areaCode = "";
      if (this.hideArea) {
        this.$refs.popover.doClose();
        let data = {
          province: {
            code: this.provinceCode,
            value: this.province
          },
          city: { code: this.cityCode, value: this.city },
          area: {
            code: "",
            value: ""
          }
        };
        this.$emit("selected", data);
        return;
      }
      this.tab = 3;
      this.showCityTab = true;
      this.showAreaTab = true;
      this.areas = this.getAreas();
    },
    chooseArea(code, value) {
      this.$refs.popover.doClose();
      this.area = value;
      this.areaCode = code;
      let data = {
        province: {
          code: this.provinceCode,
          value: this.province
        },
        city: { code: this.cityCode, value: this.city },
        area: {
          code: this.areaCode,
          value: this.area
        }
      };
      this.$emit("selected", data);
      return;
    },

    getCode(name, pCode) {
      if (pCode) {
        for (let z in this.districts[pCode]) {
          if (name === this.districts[pCode][z]) {
            return z;
          }
        }
      } else {
        for (let x in this.districts) {
          for (let y in this.districts[x]) {
            if (name === this.districts[x][y]) {
              return y;
            }
          }
        }
      }
    },
    getProvinces() {
      return this.districts[DEFAULT_CODE] || [];
    },
    getCities() {
      if (this.provinceCode) {
        return this.districts[this.provinceCode];
      } else {
        return [];
      }
    },
    getAreas() {
      if (this.provinceCode && this.cityCode) {
        return this.districts[this.cityCode];
      }
      return [];
    },
    cleanList(name) {
      this[name] = [];
    }
  }
};
</script>

<style lang="scss">
.distpicker-address-wrapper {
  color: #9caebf;
  height: 220px;
  width: 350px;

  ul {
    margin: 0;
    padding: 0;

    li {
      list-style: none;
    }
  }
  .address-header {
    background-color: #fff;

    ul {
      display: flex;
      justify-content: space-around;
      align-items: stretch;

      li {
        display: inline;
        // padding: 10px 10px 7px;

        &.active {
          border-bottom: #52697f solid 3px;
          color: #52697f;
        }
      }
    }
  }
  .address-container {
    background-color: #fff;
    margin: 5px;
    ul {
      height: 100%;
      overflow: auto;

      li {
        line-height: 40px;
        display: inline;
        // padding: 8px 10px;
        padding-top: 10px;
        padding-right: 10px;
        border-top: 1px solid #f6f6f6;

        &.active {
          color: #52697f;
        }
      }
    }
  }
}
.disabled-color {
  background: #f8f8f8;
}
</style>
