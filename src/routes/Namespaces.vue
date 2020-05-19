<template>
    <sui-container>
        <h1>Namespaces</h1>

        <p>Define prefixes for the namespaces you'll be using. These will be used for import and export, and will let you define mappings too.</p>
        <p>If you're unsure, grab the header from your RDF data and paste it below in the "extract namespaces from text" tab. It does not matter what serialisation you're using.</p>

        <sui-message positive v-if="confirmation" dismissable @dismiss="closeConfirmation">{{ confirmation }}</sui-message>
        <sui-message negative v-if="error" dismissable @dismiss="closeError">{{ error }}</sui-message>

        <sui-list divided relaxed>
            <sui-list-item v-for="namespace in namespaces" :key="namespace.prefix">
                <sui-list-icon name="server" size="large" vertical-align="middle" />
                <sui-list-content>
                    <div class="left floated">
                        <a is="sui-list-header">{{ namespace.prefix }}</a>
                        <a is="sui-list-description">{{ namespace.namespace }}</a>
                    </div>

                    <sui-button basic negative size="mini" floated="right" icon="remove" @click.prevent="remove(namespace)">Remove</sui-button>
                </sui-list-content>
            </sui-list-item>
        </sui-list>

        <sui-tab class="cypher-tabs">
            <sui-tab-pane title="Add Namespace">
                <sui-form>
                    <sui-form-field>
                        <label>Prefix</label>
                        <sui-input
                            type="url"
                            placeholder="Prefix"
                            icon="long arrow alternate right"
                            icon-position="left"
                            v-model="prefix"
                        />
                    </sui-form-field>
                    <sui-form-field>
                        <label>Namespace</label>
                        <sui-input
                            type="url"
                            placeholder="Namespace"
                            icon="server"
                            icon-position="left"
                            v-model="namespace"
                        />
                    </sui-form-field>

                    <pre v-if="addCypher">{{ addCypher }}</pre>

                    <sui-button primary :loading="loading" @click.prevent="add">Add Namespace</sui-button>
                </sui-form>
            </sui-tab-pane>
            <sui-tab-pane title="Extract Namespaces from RDF">
                <sui-form>
                    <sui-form-field>
                        <label>RDF Query</label>
                        <textarea v-model="txt" rows="10"></textarea>
                    </sui-form-field>

                    <pre v-if="addFromTextCypher">{{ addFromTextCypher }}</pre>
                    <sui-button primary :loading="loading" @click.prevent="addFromText">Extract Namespaces</sui-button>
                </sui-form>
            </sui-tab-pane>
        </sui-tab>

        <sui-message negative>
            <h3 is="sui-header">Remove All Namespace Prefixes</h3>
            <p>Remove all Schemas</p>

            <pre>CALL n10s.nsprefixes.removeAll()</pre>
            <p>Be careful, this cannot be undone.</p>

            <sui-button negative @click.prevent="removeAll">Remove All Namespace Prefixes</sui-button>
        </sui-message>
    </sui-container>
</template>

<script>
export default {
    data: () => ({
        // Add Schema
        loading: true,
        confirmation: undefined,
        error: undefined,

        namespace: 'http://schema.org/',
        prefix: 'sch',

        txt: `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:foaf="http://xmlns.com/foaf/0.1/"
  xmlns:cert="http://www.w3.org/ns/auth/cert#"
  xmlns:dct="http://purl.org/dc/terms/"`,

        namespaces: [],
    }),
    mounted() {
        this.loadNamespaces()
    },

    computed: {
        addCypher() {
            if ( !this.prefix || !this.namespace ) return

            return `CALL n10s.nsprefixes.add('${this.prefix.replace(/'/g, "\\'")}', '${this.namespace.replace(/'/g, "\\'")}')`
        },
        addFromTextCypher() {
            return `WITH '${this.txt.replace(/'/g, "\\'")}' AS txt\nCALL n10s.nsprefixes.addFromText(txt)\nYIELD prefix, namespace\nRETURN prefix, namespace`
        },
    },

    methods: {
        closeError() {
            this.error = undefined
        },
        closeConfirmation() {
            this.confirmation = undefined
        },
        loadNamespaces() {
            this.$neo4j.run(`
                CALL n10s.nsprefixes.list()
            `)
                .then(({ records }) => {
                    this.namespaces = records.map(row => ({ prefix: row.get('prefix'), namespace: row.get('namespace') }))
                })
                .finally(() => this.loading = false)
        },
        add() {
            if ( !this.prefix || !this.namespace ) {
                return;
            }

            this.loading = true

            this.$neo4j.run(this.addCypher)
                .then(() => this.confirmation = `Namespace added for ${this.namespace} with prefix ${this.prefix}`)
                .then(() => this.loadNamespaces())
                .catch(e => this.error = e)
                .finally(() => this.loading = false)
        },
        addFromText() {
            this.loading = true

            return this.$neo4j.run(this.addFromTextCypher)
                // .then(res => this.confirmation = `${res.records.length} namespace${res.records.length !== 1 ? 's' : ''} added from text`)
                .then(() => this.confirmation = `Namespaces successfully added from text`)
                .then(() => this.loadNamespaces())
                .catch(e => this.error = e)
                .finally(() => this.loading = false)
        },
        remove(namespace) {
            return this.$neo4j.run(`CALL n10s.nsprefixes.remove($prefix)`, { prefix: namespace.prefix })
                .then(() => this.confirmation = `Namespace for ${this.prefix} removed`)
                .then(() => this.loadNamespaces())
                .catch(e => this.error = e)
        },
        removeAll() {
            return this.$neo4j.run(`CALL n10s.nsprefixes.removeAll()`)
                .then(() => this.confirmation = `All namespaces have been removed`)
                .then(() => this.loadNamespaces())
                .catch(e => this.error = e)
        },
    },
}
</script>
