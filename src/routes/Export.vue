<template>
    <sui-container class="main">
        <h1 is="sui-header">Exporting RDF data</h1>
        <p>n the previous section we covered how to ingest RDF into Neo4j, in this one we will focus on how to generate RDF from our Neo4j graph. We will see that it is possible to serialise in RDF any Neo4j graph, even in the case when the data in Neo4j is not the result of importing RDF.</p>
        <p>RDF is a W3C standard model for data interchange on the Web that represents data as a graph, hence the seamless serialisation of graph data from Neo4j in RDF as we’ll see.</p>
        <p>There are three main ways of generating RDF from your graph in Neo4j. Selecting a node in the graph by its unique identifier (id or uri), selecting a group of nodes by Label + property value and via Cypher. Let’s analyse each of them in detail.</p>



        <sui-form>
            <sui-form-field>
                <label>Node ID</label>
                <sui-input
                    type="number"
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
                Run Query
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

        loading: false,
        error: false,
    }),
    created() {
        const driver = this.$neo4j.getDriver()

        const auth = driver._authToken

        this.scheme = auth.scheme
        this.principal = auth.principal
        this.credentials = auth.credentials
    },
    computed: {
        url() {
            // TODO: Get the rdf endpoint from `CALL dbms.listConfig("dbms.unmanaged_extension_classes")`
            return `${this.protocol}://${this.host}:${this.port}/${this.endpoint}/describe/id/${this.id}`
        },
    },
    methods: {
        runQuery() {
            fetch(this.url, {
                headers: {
                    authorization: `${this.scheme} ${this.principal}:${this.credentials}`
                },
            })
                .then(response => response.json())
                .then(json => this.result = json)
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