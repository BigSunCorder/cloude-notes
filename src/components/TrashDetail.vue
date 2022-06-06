<template>
  <div id="trash">
    <div class="trash-detail">
      <div class="trash-detail__title">
        <h3>回收站</h3>
      </div>
      <div class="trash-detail__menu">
        <div>更新时间</div>
        <div>标题</div>
      </div>
      <ul class="trash-detail__list">
        <li v-for="(note, index) in trashNotes" :key="note.index">
          <router-link :to="`/trash?noteId=${note.id}`">
            <span class="noteName">{{ note.updatedAtFriendly }}</span>
            <span class="time">{{ note.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="trash__content">
      <div class="header">
        <div class="data">
          <span>创建日期 ：{{ curTrashNote.createdAtFriendly }}</span>
          <span class="line">|</span>
          <span>更新日期:{{ curTrashNote.updatedAtFriendly }}</span>
          <span class="line">|</span>
          <span>所属笔记本 ： {{ belongTo }}</span>
        </div>
        <div class="delete">
          <a @click="onRevert">恢复</a>
          <a @click="onDelete">彻底删除</a>
        </div>
      </div>
      <div class="note-title">
        <span>{{ curTrashNote.title }}</span>
      </div>
      <div class="editor">
        <div class="preview markdown-body" v-html="compiledMarkdown"></div>
      </div>
    </div>
  </div>
</template>
<script>
import MarkdownIt from "markdown-it";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
let md = new MarkdownIt();
export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["setCurTrashNote"]),
    ...mapActions([
      "checkLogin",
      "deleteTrashNote",
      "revertTrashNote",
      "getTrashNotes",
      "getNotebooks",
    ]),
    onDelete() {
      console.log({ noteId: this.curTrashNote.id });
      this.$confirm("删除后将无法恢复?", "确定删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        return this.deleteTrashNote({ noteId: this.curTrashNote.id })
        .then(
          () => {
            this.setCurTrashNote({});
            this.$router.replace({
              path: "/trash",
              query: { noteId: this.curTrashNote.id },
            });
          }
        );
      });
    },
    onRevert() {
      this.revertTrashNote({ noteId: this.curTrashNote.id }).then(() => {
        this.setCurTrashNote({});
        this.$router.replace({
          path: "/trash",
          query: { noteId: this.curTrashNote.id },
        });
      });
    },
  },
  computed: {
    ...mapGetters(["trashNotes", "curTrashNote", "belongTo"]),
    compiledMarkdown() {
      return md.render(this.curTrashNote.content || "");
    },
  },
  created() {
    this.checkLogin({ path: "/login" });
    this.getNotebooks();
    this.getTrashNotes().then(() => {
      this.setCurTrashNote({ curTrashNoteId: this.$route.query.noteId });
      this.$router.replace({
        path: "/trash",
        query: { noteId: this.curTrashNote.id },
      });
    });
  },
  //当更新路由时，传递的参数
  beforeRouteUpdate(to, from, next) {
    this.setCurTrashNote({ curTrashNoteId: to.query.noteId });
    next();
  },
};
</script>

<style lang="less" scoped>
#trash {
  display: flex;
  flex: 1;
  background-color: #fff;
  .trash-detail {
    overflow: scroll;
    width: 290px;
    position: relative;
    border-right: 1px solid #ccc;
    background-color: #eee;
    span.add {
      position: absolute;
      right: 5px;
      top: 12px;
      color: #666;
      font-size: 12px;
      padding: 2px 4px;
      box-shadow: 0 0 3px 0 #ccc;
      z-index: 1;
      background: white;
    }
    &__title {
      font-size: 18px;
      font-weight: 400;
      color: #333;
      height: 45px;
      line-height: 45px;
      text-align: center;
      border-bottom: 1px solid #ccc;
      background-color: #f7f7f7;
      // element的组件样式
    }
    &__menu {
      display: flex;
      div {
        font-size: 12px;
        padding: 2px 10px;
        flex: 1;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        &:last-child {
          border-right: none;
        }
      }
    }
    &__list {
      li {
        &:nth-child(odd) {
          background-color: #f2f2f2;
        }
        .router-link-exact-active {
          border: 2px solid #81c0f3;
          border-radius: 3px;
        }
        a {
          display: flex;
          font-size: 12px;

          .time {
            width: 50%;
            padding: 2px 10px;
          }
          .noteName {
            width: 50%;
            padding: 2px 10px;
          }
        }
      }
    }
  }
  .trash__content {
    flex: 1;
    .header {
      padding: 4px 20px;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: #999;
      span {
        margin-right: 4px;
        .line {
        }
      }
      .delete a {
        color: #666;
        font-size: 12px;
        padding: 2px 4px;
        box-shadow: 0 0 3px 0 #ccc;
        z-index: 1;
        background: white;
        margin-right: 5px;
        border-radius: 3px;
      }
    }
  }
  .note-title {
    font-size: 18px;
    padding: 10px 20px;
  }
  .editor {
    overflow: auto;
    height: ~"calc(100% - 70px)";
    position: relative;
  }
  .preview {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 20px;
  }
}
</style>