<template>
    <sui-container>
        <div class="feedback">
            <div v-if="confirmation">
                <sui-icon name="smile" v-if="helpful" outline size="big" color="yellow" style="float:left; margin-right: 12px; padding-top: 6px" />
                <sui-icon name="frown" v-if="!helpful" outline size="big" color="yellow" style="float:left; margin-right: 12px; padding-top: 6px" />
                <strong>Thanks for your feedback</strong>
                <p v-html="confirmation" />
            </div>
            <div v-else-if="helpful === undefined">
                <p><strong>Was the information on this page helpful?</strong></p>

                <sui-icon name="thumbs up" outline size="big" color="green" @click.prevent="isHelpful()" style="margin-right: 12px;" />
                <sui-icon name="thumbs down" outline size="big" color="red" @click.prevent="setHelpful(false)" />
            </div>
            <sui-form v-else-if="helpful === false">
                <p><strong>How could we improve this page?</strong></p>

                <sui-form-field v-for="r in reasons" :key="r.value">
                    <sui-checkbox radio v-model="reason" :label="r.text" :value="r.value" />
                </sui-form-field>

                <sui-form-field>
                    <label for="moreInformation">More Information</label>
                    <textarea class="field" v-model="moreInformation" id="moreInformation" rows="2"></textarea>
                </sui-form-field>

                <sui-form-field>
                    <sui-button primary @click.prevent="submit">Submit Feedback</sui-button>
                    <sui-button basic primary @click.prevent="cancel">Cancel</sui-button>
                </sui-form-field>
            </sui-form>
        </div>
    </sui-container>
</template>

<script>
/* eslint-disable */
const { name } = require('../../package.json')

const api = 'https://uglfznxroe.execute-api.us-east-1.amazonaws.com/dev/Feedback'

const reasons = [
    { value: 'missing', text: "It has missing information", },
    { value: 'hard-to-follow', text: "It's hard to follow or confusing", },
    { value: 'inaccurate', text: "It's inaccurate, out of date, or doesn't work", },
    { value: 'other', text: "It has another problem not covered by the above", },
]

export default {
    name: 'feedback',

    data: () => ({
        reasons,

        helpful: undefined,
        reason: null,
        moreInformation: null,

        confirmation: undefined,
    }),

    computed: {
        url() {
            return this.$route.path
        },
        payload() {
            let output = `project=${encodeURIComponent(name)}&url=${encodeURIComponent(this.url)}&helpful=${this.helpful}`

            for ( let key of ['reason', 'moreInformation'] ) {
                if ( this[ key ] && this[ key ] !== '' ) {
                    output += `&${key}=${encodeURIComponent(this[ key ])}`
                }
            }

            return output
        },
    },
    methods: {
        isHelpful() {
            this.setHelpful(true)
            this.submit()
        },
        setHelpful(value) {
            this.helpful = value
        },
        sendFeedback() {
            fetch(api, { method: 'POST', mode: 'no-cors', body: this.payload, headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            } })
        },
        submit() {
            this.sendFeedback()
            this.confirmation = this.helpful ? "We're happy to hear that the information on this page is helpful"
                : "We'll take it account when we're updating our documentation"
        },
        cancel() {
            this.helpful = undefined
            this.confirmation = undefined
            this.reason = undefined
            this.moreInformation = undefined
        },
    },
    watch: {
        $route() {
            this.cancel()
        },
    },
}
</script>

<style>
.feedback {
    background: rgba(0, 0, 0, 0.04);
    padding: 22px 16px;
    margin: 32px 0;
    margin-bottom: 12px;
    border-radius: 4px;
}

.feedback .ui.form .fields {
    flex-direction: column;
}
</style>