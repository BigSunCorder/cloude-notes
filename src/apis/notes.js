import request from '@/helper/request'
import { friendlyDate } from '@/helper/util'

const URL = {
    GET: '/notes/from/:notebookId',
    ADD: '/notes/to/:notebookId',
    UPDATE: '/notes/:noteId',
    DELETE: '/notes/:noteId'
}

export default {
    getAll({ notebookId }) {
        return new Promise((resolve, reject) => {
            request(URL.GET.replace(':notebookId', notebookId))
                .then(res => {
                    res.data = res.data.map(notebook => {
                        notebook.createdAtFriendly = friendlyDate(notebook.createdAt)
                        notebook.updatedAtFriendly = friendlyDate(notebook.updatedAt)
                        return notebook
                    }).sort((note1, note2) => {
                        note1.createdAt < note2.createdAt ? 1 : -1
                    })
                    console.log(res.data)
                    resolve(res)
                }).catch(err => {
                    reject(err)
                })
        })
    },

    updateNote({ noteId }, { title, content }) {
        return request(URL.UPDATE.replace(':noteId', noteId), 'PATCH', { title, content })
    },

    deleteNote({ noteId }) {
        return request(URL.DELETE.replace(':noteId', noteId), 'DELETE')
    },

    addNote({ notebookId }, { title = '', content = '' } = { title: '', content: '' }) {
        return new Promise((resolve, reject) => {
            request(URL.ADD.replace(':notebookId', notebookId), 'POST', { title, content })
                .then(res => {
                    resolve(res)
                    res.data.createdAtFriendly = friendlyDate(res.data.createdAt)
                    res.data.updatedAtFriendly = friendlyDate(res.data.updatedAt)
                }).catch(err => {
                    reject(err)
                })
        })
        //return request(URL.ADD.replace(':notebookId', notebookId), 'POST', { title, content })
    }

}