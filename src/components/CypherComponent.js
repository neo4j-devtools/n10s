import { name } from '../../package.json'

export default {
    props: {
        showDisplayAs: Boolean,
    },
    data: () => ({
        loading: false,
        error: false,
        confirmation: false,
        result: false,

        tab: 0,
    }),
    computed: {
        cypher: () => 'MATCH (n) RETURN count(n) AS count',
        params: () => {},
    },
    methods: {
        closeConfirmation() {
            this.confirmation = false
        },
        closeError() {
            this.error = false
        },
        runQuery() {
            this.loading = true
            this.error = false
            this.confirmation = false

            this.displayAsFixed = this.showDisplayAs ? this.displayAs : 'table'

            this.$neo4j.desktop.sendMetrics(name, 'procedure', { name: this.$route.name })

            return this.$neo4j.run(this.cypher, this.params)
                .then(res => {
                    this.result = res
                    this.tab = 1
                    this.loading = false

                    return res
                })
                .catch(e => {
                    this.error = e
                    this.tab = 1
                    this.loading = false
                })
        },
    },
}