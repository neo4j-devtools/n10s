<template>
    <sui-dimmer active :inverted="!loading">
        <sui-loader v-if="loading">Detecting n10s plugin...</sui-loader>

        <sui-message
            v-if="plugins.length === 0"
            header="Plugin Required"
        >
            <p>This Graph App requires the <strong>n10s</strong> plugin.  Please install the plugin before continuing.</p>

            <installation-instructions />

            <sui-button primary @click="checkForPlugin">
                I have installed the plugin
            </sui-button>
        </sui-message>

    </sui-dimmer>
</template>

<script>
import InstallationInstructions from './InstallationInstructions'
export default {
    name: 'plugin-detector',
    components: {
        InstallationInstructions
    },
    props: {
        onVersionLoaded: Function,
        onPluginsLoaded: Function,
    },
    data: () => ({
        loading: true,
        version: false,
        plugins: false,
    }),
    mounted() {
        this.checkForPlugin()
    },
    methods: {
        checkForPlugin() {
            this.$neo4j.run(`
                CALL dbms.components() YIELD versions, edition
                WITH distinct versions[0] AS version

                CALL dbms.procedures() YIELD name
                WITH version, name WHERE name STARTS WITH 'n10s' OR name STARTS WITH 'neosemantics'
                WITH version, split(name, ".")[0] as prefix, count(*) AS count, collect(name) AS procedures
                RETURN version, collect({prefix: prefix, count: count, procedures: procedures}) AS plugins
            `)
                .then(({ records }) => {
                    const [ first ] = records

                    this.loading = false
                    this.version = first ? first.get('version') : [];
                    this.plugins = first ? first.get('plugins') : [];

                    this.onVersionLoaded(this.version)
                    this.onPluginsLoaded(this.plugins)
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