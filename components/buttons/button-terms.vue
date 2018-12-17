
<template>
    <button-base
        :id         ="'button-terms'"
        :mode       ="ButtonMode.HOVER"
        :visible    ="visible"
        @on-button  ="(p) => { $emit('on-button', p); }"
    >
        Terms & Conditions
    </button-base>
</template>

<script>

    import ButtonBase from '~/components/buttons/button-base.vue';

    export default {

        components: {

            ButtonBase
        },

        props: {

            visible : { default: true, type: Boolean },
        },

        data: function () {

            return {

                ButtonMode : ButtonBase.ButtonMode,
            }
        },
    }
    
</script>

<style lang="scss" scoped>

    .button {

        position:       absolute;
        top:            auto;
        bottom:         $ui-margin-bottom;
        left:           $ui-margin-left;
        right:          auto;
        text-align:     right;

        // hide button when on so it doesn't collide with text
        &[button-state='on'] {

            z-index:    999;
            opacity:    0.0;
        }
    }

</style>
