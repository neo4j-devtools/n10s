<template>
    <div id="app" class="ui">
        <neo4j-connect v-if="!driver" :onConnect="onConnect" protocol="bolt" password="neo">
            <img class="logo" slot="logo" src="./assets/img/neosemantics.png" alt="Neosemantics" />
            <div class="footer" slot="footer">n10s v{{ version }}</div>
        </neo4j-connect>

        <template v-else>
            <neo4j-database-information
                :onDatabaseChange="handleDatabaseChange"
                openIcon="angle up"
                closeIcon="angle down"
            />

            <plugin-detector v-if="!plugins" :onPluginsLoaded="onPluginsLoaded" :onVersionLoaded="onVersionLoaded" />
            <constraint-detector v-else-if="!constraints" :database="database" :onConstraintsLoaded="onConstraintsLoaded" />

            <div class="n10s" v-else>
                <n10s-navigation />
                <router-view />
            </div>
        </template>

    </div>
</template>

<script>
import { version, } from '../package.json'
import n10sNavigation from './components/layout/Navigation'
import PluginDetector from './components/PluginDetector'
import ConstraintDetector from './components/ConstraintDetector'

export default {
    name: 'App',
    data: () => ({
        version,

        driver: false,
        neo4jVersion: false,
        plugins: false,
        constraints: false,
        database: null,
    }),
    components: {
        n10sNavigation,
        PluginDetector,
        ConstraintDetector,
    },
    methods: {
        onConnect(driver) {
            this.driver = driver
        },
        onVersionLoaded(neo4jVersion) {
            this.neo4jVersion = neo4jVersion
        },
        onPluginsLoaded(plugins) {
            this.loading = plugins.length === 0

            if ( plugins.length  > 0 ) {
                this.plugins = plugins
            }
        },
        onConstraintsLoaded(constraints) {
            this.constraints = constraints
        },
        handleDatabaseChange(database) {
            this.constraints = false
            this.database = database
        },
    },
}
</script>

<style lang="postcss">
.n10s .sidebar {
    display: flex;
    width: 100px;
}

.vue-neo4j.connect {
    background: #f2f2f2;

}
.vue-neo4j.connect .logo {
    width: 80%;
    display: block;
    margin: 12px auto 24px;
}

.ui.top.attached.menu a.header.item {
    border-color: transparent !important;
}

/* .ui.top.attached.menu .header.item:before, .ui.top.attached.menu .header.item:after, */
.ui.menu .item:before {
    background: transparent !important;
}

.ui.pointing.menu .item {
    border-color: transparent !important;
}

.ui.top.ui.top.attached.menu .header.item {
    color: #0047a2 !important;
}
.ui.top.ui.top.attached.menu .header.item span {
    color: #929292;
}

.ui.secondary.pointing.menu .item.router-link-active {
    font-weight: bold;
    border-color: #0047a2 !important;
}

.neo4j-database {
    z-index: 20000;
}

.footer {
    color: rgba(0, 0, 0, .4);
    padding: 24px 0 12px;
}

.main {
    margin: 2em 0 8em;
}

.neo4j-database  {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0 !important;
    margin-bottom: 0 !important;
}


pre, textarea {
    font-family: monospace !important;
    width: 100%;
    overflow-x: auto;
    padding: 12px 8px;
    background: #f2f2f2;
}

.forced {
    background: #f2f2f2;
    position: relative;
}
.forced .graph {
    width: 100%;
    height: 600px;
    overflow-x: auto;
    padding: 12px 8px;
    margin-bottom: 18px;
}
.forced .selected {
    position: absolute !important;
    top: 0px;
    right: 12px;
}
.forced .selected i {
    float: right;
}

.results {
    overflow-y: auto;
}

.ui.dimmer .ui.message,
.ui.dimmer .ui.message pre {
    text-align: left !important;
}


</style>