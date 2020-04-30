export default {
    data: () => ({
        loading: false,
        error: false,
        result: false,

        tab: 0,
    }),
    computed: {
        cypher: () => 'MATCH (n) RETURN count(n) AS count',
        params: () => {},
    },
    methods: {
        runQuery() {
            this.loading = true
            this.error = false

            this.$neo4j.run(this.cypher, this.params)
                .then(res => this.result = res)
                .catch(e => this.error = e)
                .finally(() => {
                    this.tab = 1
                    this.loading = false
                })
        },
    },
}