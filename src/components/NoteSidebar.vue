<template>
  <div class="note">
    <span @click="onAddNotes" class="add">添加笔记</span>
    <div class="note__title">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          {{ curBook.title }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :command="notebook.id"
            v-for="notebook in notebooks"
            :key="notebook.id"
            >{{ notebook.title }}</el-dropdown-item
          >
          <el-dropdown-item command="trash">回收站</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="note__menu">
      <div>更新时间</div>
      <div>标题</div>
    </div>
    <ul class="note__list">
      <li v-for="(note, index) in notes" :key="note.index">
        <router-link :to="`/note?noteId=${note.id}&notebookId=${curBook.id}`">
          <span class="noteName">{{ note.updatedAtFriendly }}</span>
          <span class="time">{{ note.title }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import Notes from "@/apis/notes";
import Bus from "@/helper/bus";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
window.Notes = Notes;
export default {
  created() {
    this.getNotebooks()
      .then(() => {
        //
        this.setCurBook({ curBookId: this.$route.query.notebookId });
        return this.getNotes({ notebookId: this.curBook.id });
      })
      .then(() => {
        // mapMutations中的setCurNote的简写模式
        this.setCurNote({ curNoteId: this.$route.query.noteId });
        this.$router.replace({
          path: "/note",
          query: {
            noteId: this.curNote.id,
            notebookId: this.curBook.id,
          },
        });
      });
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["curBook", "notebooks", "notes", "curNote"]),
  },
  methods: {
    ...mapMutations(["setCurBook", "setCurNote"]),
    ...mapActions(["getNotebooks", "getNotes", "addNotes"]),
    //添加笔记
    onAddNotes() {
      this.$prompt("请输入标题", "添加笔记", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^.{1,30}$/,
        inputErrorMessage: "笔记标题格式不正确",
      }).then(({ value }) => {
        // this.addNotes({ notebookId: this.curBook.id }, { title: value });
        Notes.addNote({ notebookId: this.curBook.id }, { title: value }).then(
          (res) => {
            this.notes.unshift(res.data);
            this.$message({
              type: "success",
              message: res.msg,
            });
          }
        );
      });
    },
    // 点击回收站跳转回收页面，
    handleCommand(notebookId) {
      if (notebookId == "trash") {
        this.$router.push({ path: "/trash" });
      } else {
        this.$store.commit("setCurBook", {
          curBookId: notebookId,
        });
        //获取notes的列表
        this.getNotes({ notebookId }).then(() => {
          // mapMutations中的setCurNote的简写模式
          this.setCurNote({});
          this.$router.replace({
            path: "/note",
            query: {
              noteId: this.curNote.id,
              notebookId: this.curBook.id,
            },
          });
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.note {
  overflow: auto;
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
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
    }
    .el-icon-arrow-down {
      font-size: 12px;
    }
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
        padding: 5px 0;
        font-size: 12px;
        border: 2px solid transparent;

        span {
          padding: 0 3px 0 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          width: 50%;
        }
        // .time {
        //   width: 50%;
        // }
        // .noteName {
        //   width: 50%;
        // }
      }
    }
  }
}
</style>