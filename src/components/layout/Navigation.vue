<template>
    <div class="sidebar">
        <!-- <div class="ui container"> -->
            <router-link class="header item" is="sui-menu-item" :to="{ name: 'home' }">
                <img src="../../assets/img/logo.png" alt="Neosemantics" />
                <strong>
                    n<span>10</span>s
                </strong>


            </router-link>

            <div class="ui secondary vertical pointing menu right">
                <router-link is="sui-menu-item" :to="{ name: 'config' }">Config</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'namespaces' }">Namespaces</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'mapping' }">Mapping</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'validation' }">Validation</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'preview' }">Preview</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'import' }">Import</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'export' }">Export</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'delete' }">Delete</router-link>

                <a class="item docs-link" href="https://neo4j.com/docs/labs/nsmntx/current/" target="_blank">
                    <strong>User Guide</strong>
                </a>
            </div>

            <neo4j-database-information
                :onDatabaseChange="handleDatabaseChange"
                openIcon="angle up"
                closeIcon="angle down"
            />
        <!-- </div> -->
    </div>
</template>

<script>
export default {
    name: 'n10s-navigation',
    props: {
        handleDatabaseChange: Function,
    },
}
</script>
