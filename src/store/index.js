import Vue from 'vue'
import Vuex from 'vuex'
import Notebooks from "@/apis/notebooks"
import Notes from '@/apis/notes'
import Auth from "@/apis/auth";
import router from "@/router"
import Trash from "@/apis/trash"
import { Message } from "element-ui"
Vue.use(Vuex)
window.router = router
export default new Vuex.Store({
  state: {
    //  auth
    user: null,
    slug: null,
    notebooks: null,
    curBookId: null,
    notes: null,
    curNoteId: null,
    trashNotes: null,
    curTrashNoteId: null,
  },
  getters: {
    //belong to 
    belongTo: (state, getters) => {
      console.log(state.notebooks);
      console.log(getters.curTrashNote);
      let notebook = state.notebooks.find(notebook => notebook.id == getters.curTrashNote.notebookId) || {}
      return notebook.title || ""
    },
    //trash
    trashNotes: state => state.trashNotes || [],
    curTrashNote: (state, getters) => {
      if (!state.curTrashNoteId) return getters.trashNotes[0] || {}
      return state.trashNotes.find(note => note.id == state.curTrashNoteId) || {}
    },
    //auth
    username: (state) =>
      state.user === null ? "未登录" : state.user.username
    ,
    slug: (state) =>
      state.user === null ? "未" : state.user.username.charAt(0)
    ,
    //notebooks的getter
    notebooks: (state) => {
      return state.notebooks || []
    },
    curBook: (state) => {
      if (!Array.isArray(state.notebooks)) return {}
      if (!state.curBookId) return state.notebooks[0] || {}
      return state.notebooks.find(notebook => notebook.id == state.curBookId) || {}
    },
    //notes的getter
    notes: (state) => {
      return state.notes || []
    },
    curNote: (state) => {
      if (!Array.isArray(state.notes)) return {}
      if (!state.curNoteId) return state.notes[0] || {}
      return state.notes.find(note => note.id == state.curNoteId) || {}
    },
  },
  mutations: {
    //trash
    //得到所有的数据
    setTrashNotes(state, payload) {
      state.trashNotes = payload.trashNotes
    },
    //noteDetail删除一个页面，trashNote添加一个页面
    addTrashNote(state, payload) {
      setTrashNotes.unshift(payload.note)
    },
    deleteTrashNote(state, payload) {
      state.trashNotes = state.trashNotes.filter(note => note.id != payload.noteId)
    },
    setCurTrashNote(state, payload) {
      state.curTrashNoteId = payload.curTrashNoteId
    },
    //auth的方法
    setUser(state, payload) {
      state.user = payload.user
    },
    //notebooks的方法
    //创建一个笔记
    setNotebooks(state, payload) {
      state.notebooks = payload.notebook
    },
    //添加一个笔记
    addNotebooks(state, payload) {
      state.notebooks.unshift(payload.notebook)
    },
    //更新笔记列表
    updateNotebooks(state, payload) {
      let notebook = state.notebooks.find(notebook => notebook.id == payload.notebookId) || {} //找到相等的
      notebook.title = payload.title
    },
    //删除笔记列表
    deleteNotebooks(state, payload) {
      state.notebooks = state.notebooks.filter(notebook => notebook.id !== payload.notebookId) //过滤掉不相等的
    },
    setCurBook(state, payload) {
      state.curBookId = payload.curBookId
    },
    //notes的方法
    setNotes(state, payload) {
      state.notes = payload.note
    },
    addNotes(state, payload) {
      state.notes.unshift(payload.note)
    },
    updateNotes(state, payload) {
      let note = state.notes.find(note => note.id == payload.noteId) || {} //找到相等的
      note.title = payload.title
      note.content = payload.content
    },
    deleteNotes(state, payload) {
      state.notes = state.notes.filter(note => note.id != payload.noteId) //过滤掉不相等的
    },
    setCurNote(state, payload) {
      state.curNoteId = payload.curNoteId
    },

  },
  actions: {
    getTrashNotes({ commit }, payload) {
      return Trash.getAll().then(res => {
        commit("setTrashNotes", { trashNotes: res.data })
      })
    },
    deleteTrashNote({ commit }, { noteId }) {
      return Trash.deleteNote({ noteId }).then(res => {
        commit("deleteTrashNote", { noteId })
        Message.success(res.msg)
      })
    },
    revertTrashNote({ commit }, { noteId }) {
      return Trash.revertNote({ noteId }).then(res => {
        commit("deleteTrashNote", { noteId })
        Message.success(res.msg)
      })
    },
    //登录状态获取的详细信息
    checkLogin({ commit }, payload) {
      return Auth.getInfo().then(res => {
        if (!res.isLogin) {
          Message.error("登录后才能操作")
          router.push(payload)
        } else {
          commit("setUser", { user: res.data })
            ;
        }
      })
    },
    // auth的action
    login({ commit }, { username, password }) {
      return Auth.login({ username, password }).then(res => {
        console.log(res);
        commit("setUser", { user: res.data })
        Message.success(res.msg)
      })
    },
    register({ commit }, { username, password }) {
      return Auth.register({ username, password }).then(res => {
        commit('setUser', { user: res.data })
        Message.success(res.msg)
      })
    },
    logout({ commit }, payload) {
      return Auth.logout().then(res => {
        commit('setUser', { user: null })
        router.push(payload)
        Message.error(res.msg)
      })
    },
    //notebooks的action
    //获取笔记本列表全部数据
    getNotebooks({ commit, state }) {
      // if (state.notebooks !== null) return Promise.resolve()
      return Notebooks.getAll().then(res => {
        console.log(res.data);
        commit("setNotebooks", { notebook: res.data })

      })
    },
    addNotebooks({ commit }, payload) {
      return Notebooks.addNoteBook({ title: payload.title }).then(res => {
        commit('addNotebooks', { notebook: res.data })
      })
    },
    updateNotebooks({ commit }, payload) {
      return Notebooks.updateNotebook(payload.notebookId, { title: payload.title }).then(res => {
        commit("updateNotebooks", { notebookId: payload.notebookId, title: payload.title })
        Message.success(res.msg)
      })
    },

    deleteNotebooks({ commit }, payload) {
      return Notebooks.deleteNotebook(payload.notebookId).then(res => {
        commit('deleteNotebooks', { notebookId: payload.notebookId })
        Message.success(res.msg)
      }).catch(res => {
        Message.error(res.msg)
      })
    },

    // notes的action
    getNotes({ commit }, payload) {
      return Notes.getAll({ notebookId: payload.notebookId }).then(res => {
        commit("setNotes", { note: res.data })
      })
    },
    addNotes({ commit }, payload) {
      return Notes.addNote({ notebookId: payload.notebookId, title: payload.title }).then(res => {
        commit('addNotes', { note: res.data })
      })
    },
    updateNotes({ commit }, payload) {
      return Notes.updateNote({ noteId: payload.noteId }, { title: payload.title, content: payload.content }).then(res => {
        commit("updateNotes", { noteId: payload.noteId, title: payload.title, content: payload.content })
      }).catch(res => {
        Message.error(res.msg)
      })
    },
    deleteNotes({ commit }, payload) {
      return Notes.deleteNote({ noteId: payload.noteId }).then(res => {
        commit('deleteNotes', { noteId: payload.noteId })

      })
    },


  },
  modules: {
  }
})
