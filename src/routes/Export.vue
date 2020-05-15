<template>
    <sui-container>
        <h1 is="sui-header">Exporting RDF data</h1>
        <p>Use n10s HTTP RDF endpoint on your graph database to publish your data as RDF. </p>

        <p>Enter the ID or URI of a Node to export an RDF description.</p>

        <!-- TODO: detect settings and toggle ID or URI -->

        <sui-form>
            <sui-form-field>
                <label>Node ID or URI</label>
                <sui-input
                    type="text"
                    placeholder="Node ID"
                    icon="circle"
                    icon-position="left"
                    v-model="id"
                />
            </sui-form-field>
        </sui-form>

        <sui-segment>
            <code style="margin-right:12px; font-weight: bold; padding: 8px 8px 8px 0;">:GET</code>
            <code style="margin-right: 12px; background: #f2f2f2; padding: 8px 12px;">{{ url }}</code>
            <sui-loader />
        </sui-segment>

        <sui-button primary :loading="loading" @click.prevent="runQuery">
            Export
        </sui-button>

        <pre v-if="result">{{ result }}</pre>
        <sui-message negative v-if="error" header="Error Running Query" :content="error.message" />
    </sui-container>
</template>

<script>
export default {
    name: 'export',

    data: () => ({
        id: 1,
        result: false,
        protocol: 'http',
        host: 'localhost',
        port: 7474,
        endpoint: 'rdf',
        principal: false,
        credentials: false,
        database: 'neo4j',

        loading: false,
        error: false,
    }),
    created() {
        const driver = this.$neo4j.getDriver()

        const auth = driver._authToken

        this.scheme = auth.scheme
        this.principal = auth.principal
        this.credentials = auth.credentials

        if ( this.$neo4j.getDatabase() ) {
            this.database = this.$neo4j.getDatabase()
        }
    },
    computed: {
        url() {
            // TODO: Get the rdf endpoint from `CALL dbms.listConfig("dbms.unmanaged_extension_classes")`
            return `${this.protocol}://${this.host}:${this.port}/${this.endpoint}/${this.database}/describe/${encodeURIComponent( this.id )}`
        },
    },
    methods: {
        runQuery() {
            const token = btoa(`${this.principal}:${this.credentials}`)

            fetch(this.url, {
                headers: {
                    Authorization: `Basic ${token}`
                },
            })
                .then(response => response.text())
                .then(text => this.result = text)
                .catch(e => this.error = e)
                .finally(this.loading = false)
        },
    },
    watch: {
        id() {
            this.error = false
        },
    },
}
</script>