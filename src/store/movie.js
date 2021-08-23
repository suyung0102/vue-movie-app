import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        title: '',
        loading: false,
        movies: []
    }),
    getters: {

    },
    mutations: {
        updateState (state, payload) {
            Object.keys(payload).forEach(key => {
                state[key] = payload[key];
            })
        },
        pushIntoMovies (state, movies) {
            state.movies.push(...movies)
        }
    },
    actions: {
        fetchMovies ({ state }, pageNum) {
            const promise = new Promise(resolve => {
                const res = axios.get(`https://www.omdbapi.com/?apikey=4e5a9b26&s=${state.title}&page=${pageNum}`)
                resolve(res)
            })

            return promise.then(res => res.data)
        },
        async searchMovies ({ commit, dispatch }) {
            commit('updateState', {
                loading: true, // 로딩 애니메이션 시작
                movies: [] // 초기화
        })
      
            const { totalResults } = await dispatch('fetchMovies', 1)
            const pageLength = Math.ceil(totalResults / 10)
      
            if (pageLength > 1) {
                for (let i = 2; i <= pageLength; i += 1) {
                    if (i > 4) break
                    const { Search } = await dispatch('fetchMovies', i)
                    commit('pushIntoMovies', Search)
                }
            }
      
            commit('updateState', {
                loading: false // 로딩 애니메이션 종료
            })
        }
    }
}