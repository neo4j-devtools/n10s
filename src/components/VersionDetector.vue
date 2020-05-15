<template>
    <sui-dimmer active :inverted="!loading">
        <sui-loader v-if="loading">Detecting Neo4j Version</sui-loader>

        <sui-message
            v-else-if="!isValid"
            header="Neo4j Version Mismatch"
        >
            <template v-if="cleanedVersions.length > 1">
                <p>This Graph App requires one of the following version of Neo4j</p>

                <ul>
                    <li v-for="version in cleanedVersions" :key="version" v-html="version" />
                </ul>
            </template>
            <div v-else>
                <p>This Graph App requires version <strong>{{ cleanedVersions[0] }}</strong> of Neo4j.</p>
            </div>

            <p>Try switching to another database in Neo4j Desktop or logging in to another instance of Neo4j.</p>

            <sui-button primary @click.prevent="checkVersion">I have switched database</sui-button>
            <sui-button negative v-if="onLogOut" @click.prevent="onLogOut">Log Into Another Neo4j Instance</sui-button>
        </sui-message>

    </sui-dimmer>
</template>

<script>
/* eslint-disable */
import semver from 'semver'

export default {
    name: 'plugin-detector',
    props: {
        valid: {
            type: [ String, Array, ],
            default: '4.0.x',
        },
        error: {
            type: String,
            default: 'Oops, you need one of the following versions',
        },
        onVersionLoaded: Function,
        onLogOut: Function,
    },
    data: () => ({
        loading: true,
        neo4jVersions: [],
        edition: false,
    }),
    mounted() {
        this.checkVersion()
    },
    computed: {
        cleanedVersions() {
            return Array.isArray(this.valid) ? this.valid : [ this.valid ]
        },
        isValid() {
            for ( let version of this.cleanedVersions ) {
                if ( this.neo4jVersions.find(neo4jVersion => semver.satisfies(neo4jVersion, version)) ) return true
            }

            return false
        },
    },
    methods: {
        checkVersion() {
            this.$neo4j.run(`
                CALL dbms.components() YIELD name, versions, edition
                WHERE name ENDS WITH 'Kernel'
                RETURN name, versions, edition

            `)
                .then(({ records }) => {
                    // console.log(records);

                    const [ first ] = records

                    if ( first !== undefined ) {
                        this.neo4jVersions = first.get('versions')
                        this.edition = first.get('edition')
                    }

                    this.loading = false

                    if ( this.isValid ) {
                        this.onVersionLoaded(this.neo4jVersions)
                    }
                })
        },
    },
}
</script>

<style>
.ui.dimmer .ui.message {
    text-align: left;;
}
</style>