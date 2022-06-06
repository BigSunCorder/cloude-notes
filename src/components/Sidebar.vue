<template>
  <div id="sidebar">
    <avatar></avatar>
    <div class="iconsList">
      <router-link to="/note" title="笔记"> <Icons name="note" /></router-link>

      <router-link to="/notebooks" title="笔记本">
        <Icons name="notebook"
      /></router-link>

      <router-link to="/trash" title="回收站">
        <Icons name="trash"
      /></router-link>
    </div>

    <div class="logout" @click="onLogout">
      <Icons name="logout" />
    </div>
  </div>
</template>
<script>
import avatar from "@/components/Avatar";
import { mapActions } from "vuex";
export default {
  components: {
    avatar,
  },
  methods: {
    ...mapActions(["logout"]),
    onLogout() {
      // 注销登录数据
      this.logout({ path: "/login" });
    },
  },
};
</script>
<style lang="less" scoped>
#sidebar {
  position: relative;
  width: 56px;
  text-align: center;
  background-color: #2c333c;
  .iconsList {
    margin-top: 15px;
    a {
      padding: 6px 0;
      display: block;
    }
    .router-link-active {
      background-color: #5e6266;
    }
  }
}

.logout {
  position: absolute;
  bottom: 20px;
  width: 100%;
  text-align: center;
  cursor: pointer;
}
.icon {
  color: #fff;
  //   font-size: 20px;
}
</style>