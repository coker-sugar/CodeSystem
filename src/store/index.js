import vue from "vue"
import vuex from "vuex"

vue.use(vuex)
const store = new vuex.Store({
    state: {
        routes: "zs"                  // routes
    },
    getters: {
        getMsg(state) {
            return state.routes
        }
    },
    mutations: {
        onChangeRoutes(state, data) {
            state.routes = 'lisi'
        }
    },
    actions: {
        setRoutes(content) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    content.commit('onChangeRoutes')
                    resolve()
                },1000)
            })
        }
    }
})

export default store