<template>
    <sui-dimmer active :inverted="!loading">
        <sui-loader v-if="loading">{{ loading }}</sui-loader>

        <sui-message
            v-if="!loading"
            header="Constraint Required"
        >
            <p>
                To run n10s you also need a constraint on <code>:{{ label }}({{ property }})</code>.
                Either run the following code or click <strong>&lt; Create Constraint &gt;</strong> to create the constraint.
            </p>

            <code-block :code="createConstraintCypher" />

            <sui-message class="negative" v-if="error" v-html="error.message" />

            <sui-button primary :loading="loading" @click="createConstraint">
                Create Constraint
            </sui-button>
        </sui-message>

    </sui-dimmer>
</template>

<script>
import CodeBlock from './CodeBlock'

export default {
    name: 'constraint-detector',
    components: {
        CodeBlock,
    },
    props: {
        database: null,
        onConstraintsLoaded: Function,
    },
    data: () => ({
        loading: false,

        error: false,

        name: 'n10s_unique_uri',
        label: 'Resource',
        property: 'uri',
    }),
    mounted() {
        this.checkForConstraints()
    },
    methods: {
        checkForConstraints() {
            this.error = false
            this.loading = 'Checking Constraints...'

            this.$neo4j.run(`
                CALL db.schemaStatements()
                YIELD name
                WHERE name = $name
                RETURN count(*) AS count
            `, { name: this.name })
                .then(({ records }) => {
                    const [ first ] = records

                    if ( first && first.get('count').toNumber() === 1 ) {
                        this.onConstraintsLoaded(first.get('count').toNumber())
                    }
                })
                .catch(e => this.error = e)
                .finally(() => this.loading = false)
        },
        createConstraint(e) {
            this.error = false
            this.loading = 'Creating Constraint...'

            const interval = e ? 1000 : 0

            setTimeout(() => {
                this.$neo4j.run(this.createConstraintCypher)
                    .catch(e => this.error = e)
                    .then(() => this.checkForConstraints())
            }, interval)


        },
    },
    computed: {
        createConstraintCypher() {
            return `CREATE CONSTRAINT ${this.name} ON (r:${this.label}) ASSERT r.${this.property} IS UNIQUE`
        }
    },
    watch: {
        database() {
            this.checkForConstraints()
        },
    },
}
</script>

<style>

</style>