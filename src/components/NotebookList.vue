<template>
  <div class="detail" id="notebook-list">
    <header>
      <a href="#" class="btn" @click.prevent="onCreate">
        <Icons name="add" /><span>新建笔记本</span>
      </a>
    </header>
    <main>
      <div class="layout">
        <h3>笔记本列表({{ notebooks.length }})</h3>
        <div class="note">
          <router-link
            :to="`note?notebookId=${notebook.id}`"
            href="#"
            class="note__book"
            v-for="(notebook, index) in notebooks"
            :key="notebook.index"
          >
            <div class="books__list">
              <Icons name="notebook" />
              {{ notebook.title }}
              <span>{{ notebook.noteCounts }} </span>

              <span
                @click.stop.prevent="onDelete(notebook)"
                class="book__delete"
                >删除</span
              >
              <span @click.stop.prevent="onEdit(notebook)" class="book__edit"
                >编辑</span
              >
              <span class="book__time">{{ notebook.createdAtFriendly }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Auth from "@/apis/auth";
import Icons from "./Icons.vue";
import Notebooks from "@/apis/notebooks";
import { friendlyDate } from "@/helper/util";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

// window.Notebooks = Notebooks;
export default {
  name: "Login",
  data() {
    return {};
  },
  created() {
    //当没有注册时跳转到登录页面
    this.checkLogin({ path: "/login" });
    this.$store.dispatch("getNotebooks");
  },
  computed: {
    //注意要使用mapState
    ...mapState(["notebooks"]),
  },
  methods: {
    ...mapActions([
      "getNotebooks",
      "addNotebooks",
      "updateNotebooks",
      "deleteNotebooks",
      "checkLogin",
    ]),
    // 创建笔记本
    onCreate() {
      this.$prompt("请输入笔记本标题", "创建笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: "标题不能为空，且不超过30个字符",
      })
        .then(({ value }) => {
          //使用映射出来的action
          this.addNotebooks({ title: value });
          this.$message({
            type: "success",
            message: "创建成功",
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "创建失败",
          });
        });
    },
    onEdit(notebook) {
      // 修改笔记本
      let title = "";
      this.$prompt("修改笔记本", "请输入笔记本的标题", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.{1,30}$/,
        inputValue: notebook.title, //摄制输入框的初始文
        inputErrorMessage: "标题不能为空，且不超过30个字符",
      }).then(({ value }) => {
        title = value;
        this.updateNotebooks({ notebookId: notebook.id, title: title });
      });
    },
    onDelete(notebook) {
      // 删除笔记本
      this.$confirm("此操作将永久删除, 是否继续?", "删除笔记本", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.deleteNotebooks({ notebookId: notebook.id });
      });
    },
  },
};
</script>
<style lang="less" scoped>
#notebook-list {
  flex: 1;
  header {
    padding: 12px 30px;
    border-bottom: 1px solid #ccc;
    .btn {
      border-radius: 3px;
      font-size: 12px;
      color: #666;
      cursor: pointer;
    }
  }
  main {
    .layout {
      max-width: 966px;
      margin: 30px auto;
      .note {
        margin-top: 10px;
        border-radius: 5px;
        background-color: #fff;
        .note__book {
          display: block;
          cursor: pointer;
        }
      }
      .books__list {
        padding: 12px 14px;
        font-size: 14px;
        color: #666;
        font-weight: bold;
        border-bottom: 1px solid #ebebeb;

        &:hover {
          background-color: #f7fafd;
        }
      }
      h3 {
        font-size: 12px;
        color: #000;
      }
      .books__list span {
        margin-left: 5px;
        font-size: 12px;
        font-weight: bold;
        color: #b3c0c8;
      }
      .books__list .book__time,
      .book__edit,
      .book__delete {
        float: right;
        margin-right: 5px;
      }
    }
  }
  .icon {
    color: #b3c0c8;
    margin-right: 5px;
  }
  main .error-msg {
    font-size: 12px;
    color: red;
  }
}
</style>
