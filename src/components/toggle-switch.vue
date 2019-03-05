<template>
  <label role="checkbox" :class="['switch', { toggled }]">
    <input type="checkbox"
           class="switch-input"
           @change="toggle"/>
    <div class="switch-core"
         :style="{backgroundColor: toggled ? colorChecked  : colorUnchecked}">
      <div class="switch-button"
           :style="{transition: `transform ${speed}ms`,
           transform: toggled ? null: `translate3d(68px, 0px, 0px)`}">
      </div>
    </div>
    <span class="switch-label label-right"
          v-if="toggled"
          v-html="labelChecked">
     </span>
    <span class="switch-label label-left"
          v-html="labelUnchecked" v-else>
    </span>
  </label>
</template>
<script>
  export default {
    name: 'ToggleSwitch',
    data () {
      return {
        toggled: this.value.default,
        colorChecked: '#608BF7',
        colorUnchecked: '#92C7FF',
        labelChecked: '从低到高',
        labelUnchecked: '从高到低'
      }
    },
    props: {
      value: {
        type: Boolean,
        default: false
      },
      speed: {
        type: Number,
        default: 100
      }
    },
    methods: {
      toggle (event) {
        this.toggled = !this.toggled
        this.$emit('change', this.toggled)
      }
    }
  }
</script>
 
<style scoped>
 
  .switch {
    display: inline-block;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    user-select: none;
    font-size: 10px;
    cursor: pointer;
    }
    .switch .switch-input {
      display: none;
    }
 
    .switch .switch-label {
      position: absolute;
      top: 0;
      font-weight: 600;
      color: white;
 
      z-index: 2;
    }
 
     .switch .label-left {
        left: 10px;
        line-height: 20px;
        border-top-left-radius: 2px;
        border-bottom-left-radius:2px;
      }
 
      .switch .label-right {
        right: 10px;
        line-height: 20px;
        border-top-right-radius: 2px;
        border-bottom-right-radius:2px;
      }
 
    .switch-core {
      display: block;
      position: relative;
      box-sizing: border-box;
      outline: 0;
      margin: 0;
      transition: border-color .3s, background-color .3s;
      user-select: none;
      width: 97px;
      height: 20px;
      border-radius: 10px;
      line-height: 20px;
 
      
    }
    .switch-core .switch-button {
        width: 32px;
        height: 20px;
        display: block;
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
        z-index: 3;
        transform: translate3d(0, 0, 0);
        background-color: #ecf0f5;
        border-radius: 10px;
      }
</style>