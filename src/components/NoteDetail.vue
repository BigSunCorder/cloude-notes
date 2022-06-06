<template>
  <div id="note-detail">
    <NoteSidebar @update:notes="(val) => (notes = val)" />
    <div class="content">
      <div class="content__empty" v-show="!curNote.id">请选择笔记</div>
      <div v-show="curNote.id" class="content-main">
        <div class="content__header">
          <span>创建日期：{{ curNote.createdAtFriendly }}</span>
          <span>更新日期：{{ curNote.updatedAtFriendly }}</span>
          <span>{{ statusText }}</span>
          <span @click="onDeleteNote" class="leftIcons">
            <Icons name="trash"
          /></span>

          <span class="leftIcons" @click="isShowPreview = !isShowPreview">
            <Icons name="open"
          /></span>
        </div>
        <div class="content__title">
          <input
            v-model="curNote.title"
            @keydown="statusText = '正在输入...'"
            type="text"
            @input="onupdateNote"
            placeholder="输入标题"
          />
        </div>
        <div class="content__edit">
          <textarea
            v-model="curNote.content"
            @keydown="statusText = '正在输入...'"
            v-show="!isShowPreview"
            @input="onupdateNote"
            placeholder="输入内容，支持markdown"
          ></textarea>
          <div
            class="preview"
            v-show="isShowPreview"
            v-html="previewContent"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from "@/apis/auth";
import NoteSidebar from "./NoteSidebar.vue";
import Icons from "./Icons.vue";
import _ from "lodash";
import MarkdownIt from "markdown-it";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
// 引入markdown
let md = new MarkdownIt();
export default {
  components: {
    NoteSidebar,
    Icons,
  },
  name: "Login",
  data() {
    return {
      statusText: "笔记未改动",
      isShowPreview: false,
    };
  },
  computed: {
    // 将content的值转化为HTML
    previewContent() {
      return md.render(this.curNote.content || "");
    },
    ...mapGetters(["curNote", "notes"]),
  },
  created() {
    this.checkLogin({ path: "/login" });
    this.getNotebooks();
  },

  //引入lodash,当用户停下来的时候其会发生请求
  methods: {
    ...mapMutations(["setCurNote"]),
    ...mapActions(["updateNotes", "deleteNotes", "checkLogin", "getNotebooks"]),
    onupdateNote: _.debounce(function () {
      //更新input，textarea数据
      this.updateNotes({
        noteId: this.curNote.id,
        title: this.curNote.title,
        content: this.curNote.content,
      })
        .then((data) => {
          this.statusText = "已保存";
          console.log(data);
        })
        .catch((data) => {
          this.statusText = "保存出错";
          console.log("error", data);
        });
    }, 300),
    onDeleteNote() {
      this.$confirm("此操作将删除笔记, 是否继续?", "删除笔记", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        return this.deleteNotes({ noteId: this.curNote.id }).then(() => {
          this.$message.success("删除成功");
          this.$router.replace({ path: "/note" });
        });
      });
    },
  },
  //当更新路由时，传递的参数
  beforeRouteUpdate(to, from, next) {
    this.setCurNote({ curNoteId: to.query.noteId });
    next();
  },
};
</script>

<style lang="less" scoped>
#note-detail {
  display: flex;
  flex: 1;
  background-color: #fff;
}

.content {
  overflow: auto;
  &__empty {
    font-size: 50px;
    color: #ccc;
    text-align: center;
    margin: auto 0;
  }
  .content-main {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  display: flex;
  flex: 1;
  flex-direction: column;
  &__header {
    padding: 4px 20px;
    border-bottom: 1px solid #eee;

    &:after {
      content: "";
      display: block;
      clear: both;
    }
    span {
      font-size: 12px;
      color: #999;
      margin-right: 4px;
    }
    .leftIcons {
      float: right;
      margin-left: 10px;
      font-size: 18px;
      cursor: pointer;
    }
  }
  &__title {
    input {
      display: inline-block;
      width: 100%;
      outline: none;
      border: none;
      padding: 10px 20px;
      font-size: 18px;
    }
  }
  &__edit {
    height: ~"calc(100% - 70px)";
    position: relative;
    flex: 1;
    textarea,
    .preview {
      position: absolute;
      width: 100%;
      height: 100%;
      padding: 20px;
    }
    textarea {
      border: none;
      outline: none;
      font-size: 14px;
      font-family: "Monaco", courier, monospace;
    }
  }
}
</style>