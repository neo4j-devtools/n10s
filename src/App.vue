<template>
    <div id="app" class="ui">
        <vue-neo4j-connect v-if="!driver" :onConnect="onConnect" protocol="bolt" password="neo">
            <img class="logo" slot="logo" src="./assets/img/neosemantics.png" alt="Neosemantics" />
            <div class="footer" slot="footer">n10s v{{ version }}</div>
        </vue-neo4j-connect>

        <plugin-detector v-else-if="!plugins" :onPluginsLoaded="onPluginsLoaded" :onVersionLoaded="onVersionLoaded" />
        <constraint-detector v-else-if="!constraints" :onConstraintsLoaded="onConstraintsLoaded" />

        <div v-else>
            <n10s-navigation />
            <router-view />
        </div>
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
    },
}
</script>

<style lang="css">
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

.footer {
    color: rgba(0, 0, 0, .4);
    padding: 24px 0 12px;
}

.main {
    margin: 2em 0;
}

pre {
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