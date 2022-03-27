<template>
    <div id="app" class="ui">
        <neo4j-connect v-if="!driver" :onConnect="onConnect" protocol="bolt" password="neo">
            <img class="logo" slot="logo" src="./assets/img/neosemantics.png" alt="Neosemantics" />
            <div class="footer" slot="footer">n10s v{{ version }}</div>
        </neo4j-connect>

        <template v-else>
            <neo4j-database-information
                v-if="!plugins || !constraints"
                class="full"
                :onDatabaseChange="handleDatabaseChange"
                openIcon="angle up"
                closeIcon="angle down"
            />

            <version-detector v-if="!neo4jVersion" :onVersionLoaded="onVersionLoaded" :onLogOut="logOut" :valid='["4.0.*", "4.1.*", "4.2.*", "4.3.*", "4.4.*"]' />
            <plugin-detector v-else-if="!plugins" :onPluginsLoaded="onPluginsLoaded" />
            <constraint-detector v-else-if="!constraints" :database="database" :onConstraintsLoaded="onConstraintsLoaded" />

            <div class="n10s" v-else>
                <n10s-navigation :handleDatabaseChange="handleDatabaseChange" />
                <div class="main">
                    <router-view />
                    <feedback />
                </div>
            </div>
        </template>
    </div>
</template>

<script>
/* eslint-disable */
import { name, version, } from '../package.json'
import n10sNavigation from './components/layout/Navigation'
import VersionDetector from './components/VersionDetector'
import PluginDetector from './components/PluginDetector'
import ConstraintDetector from './components/ConstraintDetector'
import Feedback from './components/Feedback'

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
        VersionDetector,
        PluginDetector,
        ConstraintDetector,
        Feedback,
    },
    methods: {
        onConnect(driver) {
            this.driver = driver

            this.$neo4j.desktop.sendMetrics(
                name,
                'login',
                {
                    version,
                    path: this.$route.path
                }
            ).catch(() => {})
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
        logOut() {
            this.driver = false
        },
        onConstraintsLoaded(constraints) {
            this.constraints = constraints
        },
        handleDatabaseChange(database) {
            this.constraints = false
            this.database = database
        },
    },
    watch: {
        $route() {
            this.$neo4j.desktop.sendMetrics(
                name,
                'pageview',
                { version, path:this.$route.path }
            )
        },
    },
}
</script>

<style>
.n10s {
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
.n10s .sidebar {
    display: flex;
    flex-direction: column;
    width: 240px;
    height: 100vh;
    background: #fff;
}

.n10s .sidebar .header {
    display: flex;
    flex-direction: row;
    padding: 12px;
    /* border-right: 1px solid #f2f2f2; */
    border-bottom: 1px solid rgba(0, 0, 0, .05);
}

.n10s .sidebar .ui.secondary.vertical.pointing.menu {
    /* margin-top: 0; */
    width: 100%;
}

.n10s .sidebar .neo4j-database .ui.inverted.menu {
    background: transparent;
    /* rgba(0, 0, 0, .2) !important */
}

.n10s .sidebar .header {
    background: #fff;
}

.n10s .sidebar .header img {
    height: 32px;
    margin-right: 12px;
    flex: 0;
}
.n10s .sidebar .header strong {
    display: flex;
    align-items: center;
}

.n10s .main {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    height: 100%;
    overflow: auto;
    background: rgba(0,0,0,0.03);
}

.n10s .panes {
    display: flex;
    flex: 1;
    flex-direction: row;
    height: 100%;
    width: 100%;
}
.n10s .panes .pane {
    background: rgba(0,0,0,0.01);
    flex: 0 0 260px;
    /* width: 220px; */
    padding: 12px 0;
    height: 100%;
    overflow-y:auto;
}

.n10s .panes .pane h1 {
    font-size: 18px;
    margin: 8px 0;
}

.n10s .panes .main {
    max-width: 90% !important;
}



.n10s .main .ui.container {
    padding: 12px 16px 12px 32px !important;
}

.vue-neo4j.connect {
    background: #f2f2f2;
}
.vue-neo4j.connect .logo {
    width: 80%;
    display: block;
    margin: 12px auto 24px;
}

.cypher-tabs {
    margin: 24px 0;
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

.n10s .sidebar .menu .header.item {
    color: #0047a2 !important;
}
.n10s .sidebar .menu .header.item span {
    color: #929292 !important;
}

.ui.secondary.pointing.menu .item.router-link-active {
    font-weight: bold;
    border-color: #0047a2 !important;
}

.ui.form .hint {
    opacity: .7;
    margin-top: 12px;
}

.ui.form .hint p, .ui.form .hint ul {
    margin: 0;
}



.footer {
    color: rgba(0, 0, 0, .4);
    padding: 24px 0 12px;
}

.neo4j-database .ui.vertical.menu {
    border: 0px none;
    background-color: rgba(0, 0, 0, .1);
    border-radius: 0;
    box-shadow: none;
}
.neo4j-database .databases {
    bottom: 100%;
    top: auto;
    background-color: rgba(0, 0, 0, .05) !important;
    padding: 0 !important;
}

.neo4j-database.full {
    background-color: rgba(0, 0, 0, .1) !important;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2000;
}

.neo4j-database.full .ui.vertical.menu {
    background: transparent;
    margin-bottom: 0 !important;

}

pre, textarea {
    font-family: monospace !important;
    width: 100%;
    overflow-x: auto;
    padding: 12px 8px;
    background: rgba(0,0,0,.05);
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

.forced .selected .ui.list .item {
    word-break: break-all;
}

.results {
    overflow-y: auto;
}

.ui.dimmer .ui.message,
.ui.dimmer .ui.message pre {
    text-align: left !important;
}

.n10s .sidebar .pointing.menu .docs-link strong {
    color:#4183c4;
     /* rgba(0, 0, 0, .7) */
}
.n10s .sidebar .pointing.menu {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    margin: 0;
    padding: 12px 0;
    border-right: 0px none !important;
}
.n10s .sidebar .ui.secondary.vertical.pointing.menu .item {
    margin-right: 0;
}
.n10s .sidebar .pointing.menu .router-link-active {
    border-right-color: #4183c4 !important;
}

.n10s .sidebar .neo4j-database {
    margin-top: 0;
    border-radius: 0;
}

.n10s .sidebar .neo4j-database .ui.vertical {
    margin: 0 !important;
    width: 100%;
}
.n10s .sidebar .neo4j-database .ui.vertical .header {
    background: transparent !important;
    padding: 0;
    border-right: 0px none;
}

/*
@red            : #B03060;
@orange         : #FE9A76;
@yellow         : #FFD700;
@olive          : #32CD32;
@green          : #016936;
@teal           : #008080;
@blue           : #0E6EB8;
@violet         : #EE82EE;
@purple         : #B413EC;
@pink           : #FF1493;
@brown          : #A52A2A;
@grey           : #A0A0A0;
@black          : #000000;
*/

.hljs {
    background: rgba(0, 0, 0, .03);
    color: rgba(0, 0, 0, .6);
}
    .hljs-comment,
    .hljs-quote {
        font-style: italic;
        color: rgba(0, 0, 0, .4);
    }

    .hljs-doctag,
    .hljs-keyword,
    .hljs-formula {
        font-weight: semibold;
        color: #B413EC;
    }

    .hljs-section,
    .hljs-name,
    .hljs-selector-tag,
    .hljs-deletion,
    .hljs-subst {
        color: #B413EC;
    }

    .hljs-literal {
        color: #0E6EB8;
    }

    .hljs-string,
    .hljs-regexp,
    .hljs-addition,
    .hljs-attribute,
    .hljs-meta-string {
        color: #016936;
    }

    .hljs-built_in,
    .hljs-class .hljs-title {
        color: #B03060;
    }

    .hljs-attr,
    .hljs-variable,
    .hljs-template-variable,
    .hljs-type,
    .hljs-selector-class,
    .hljs-selector-attr,
    .hljs-selector-pseudo,
    .hljs-number {
        color: #B413EC;
    }


    .hljs-symbol,
    .hljs-bullet,
    .hljs-link,
    .hljs-meta,
    .hljs-selector-id,
    .hljs-title {
        color: #0E6EB8;
    }

    .hljs-emphasis {
        font-style: italic;
    }

    .hljs-strong {
        font-weight: bold;
    }

    .hljs-link {
        text-decoration: underline;
    }
</style>
