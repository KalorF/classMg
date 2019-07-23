<template>
  <transition name="hide">
    <slot></slot>
  </transition>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
.hide-enter, .hide-leave-to
  opacity 0
.hide-enter-active, .hide-leave-active
  transition opacity .7s
</style>
