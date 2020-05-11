<template>
    <div class="ui top attached menu">
        <div class="ui container">
            <a href="#" class="header item">
                <img src="../../assets/img/logo.png" alt="Neosemantics" />
            </a>
            <router-link class="header" is="sui-menu-item" :to="{ name: 'home' }">
                <strong>
                    n<span>10</span>s
                </strong>
            </router-link>

            <div class="ui secondary pointing menu right">
                <router-link is="sui-menu-item" :to="{ name: 'config' }">Config</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'mapping' }">Mapping</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'validation' }">Validation</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'preview' }">Preview</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'import' }">Import</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'export' }">Export</router-link>
                <router-link is="sui-menu-item" :to="{ name: 'delete' }">Delete</router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'n10s-navigation',
}
</script>