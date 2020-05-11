import Vue from 'vue'
import VueNeo4j from 'vue-neo4j'
import SuiVue from 'semantic-ui-vue'

import App from './App.vue'
import n10sCypherTabs from './components/CypherTabs.vue'
import n10sQueryForm from './components/QueryForm.vue'
import router from './router'

import 'semantic-ui-css/semantic.min.css'

Vue.use(VueNeo4j)
Vue.use(SuiVue)

Vue.component('n10s-cypher-tabs', n10sCypherTabs)
Vue.component('n10s-query-form', n10sQueryForm)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
