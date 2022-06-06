<template>
  <svg class="icon">
    <use :xlink:href="'#' + name" />
  </svg>
</template>

<script>
let importAll = (requireContext) =>
  requireContext.keys().forEach(requireContext);
try {
  importAll(require.context("../assets/icons", true, /\.svg$/)); //../assets/icons是文件路径
} catch (error) {
  console.log(error);
}
export default {
  props: ["name"],
  name: "Icon",
};
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
