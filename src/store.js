import Vue from 'vue'
import Vuex from 'vuex'

import { queryTypes, outputFormats, url, shaclUrl, formats, } from './constants'

Vue.use(Vuex)

const state = {
    // Preview, Import, Export forms
    queryType: queryTypes[2].value,
    url,
    value: '',
    displayAs: outputFormats[0].value,
    format: formats[0].value,

    // Validation Form
    shaclUrl,
    shaclValue: '',
    shaclFormat: formats[0].value,
}

const mutations = {
    setQueryType(state, queryType) {
        state.queryType = queryType
    },
    setValue(state, value) {
        state.value = value
    },
    setDisplayAs(state, displayAs) {
        state.displayAs = displayAs
    },
    setUrl(state, url) {
        state.url = url
    },
    setFormat(state, format) {
        state.format = format
    },
    setShaclValue(state, value) {
        state.shaclValue = value
    },
    setShaclUrl(state, url) {
        state.shaclUrl = url
    },
    setShaclFormat(state, format) {
        state.shaclFormat = format
    },
}

export default new Vuex.Store({
    state,
    mutations,
})