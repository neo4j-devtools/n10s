<template>
    <sui-dimmer active :inverted="!loading">
        <sui-loader v-if="loading">Detecting n10s plugin...</sui-loader>

        <sui-message
            v-if="plugins.length === 0"
            header="Plugin Required"
        >
            <p>This Graph App requires the <strong>n10s</strong> plugin.  Please install the plugin before continuing.</p>

            <installation-instructions />

            <sui-button primary :loading="loading" @click="checkForPlugin">
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
        checkForPlugin(e) {
            // If there is an event, give the appearance that it's taking longer than it actually is
            const interval = e ? 500 : 0;

            this.loading = true

            setTimeout(() => {
                this.$neo4j.run(`
                    CALL dbms.procedures() YIELD name
                    WITH name WHERE name STARTS WITH 'n10s' OR name STARTS WITH 'neosemantics'
                    WITH split(name, ".")[0] as prefix, count(*) AS count, collect(name) AS procedures
                    RETURN collect({prefix: prefix, count: count, procedures: procedures}) AS plugins
                `)
                    .then(({ records }) => {
                        const [ first ] = records

                        this.loading = false
                        this.plugins = first ? first.get('plugins') : [];

                        this.onPluginsLoaded(this.plugins)
                    })
            }, interval)
        },
    },
}
</script>

<style>
.ui.dimmer .ui.message {
    text-align: left;;
}
</style>