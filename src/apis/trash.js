import request from "@/helper/request"
import { friendlyDate } from "@/helper/util"
const URL = {
    GET: '/notes/trash',
    REVERT: '/notes/:noteId/revert',
    DELETE: '/notes/:noteId/confirm',
}
export default {
    getAll() {
        return new Promise((resolve, reject) => {
            // 时间从大到小排列,在数据的每一个对象添加一个createdAtFriendlyDate
            request(URL.GET).then(res => {
                res.data = res.data.sort((note1, note2) =>
                    note1.createdAt < note2.createdAt ? 1 : -1)
                res.data.map(note => {
                    note.createdAtFriendly = friendlyDate(note.createdAt)
                    note.updatedAtFriendly = friendlyDate(note.updatedAt)
                })
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    deleteNote({ noteId }) {
        return request(URL.DELETE.replace(":noteId", noteId), "DELETE")
    },
    revertNote({ noteId }) {
        return request(URL.REVERT.replace(":noteId", noteId), "PATCH")
    },

}