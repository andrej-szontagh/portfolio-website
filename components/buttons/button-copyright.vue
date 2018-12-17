
<template>
    <button-base
        :id         ="'button-copyright'"
        :mode       ="ButtonMode.HOVER" 
        :visible    ="visible"
        @on-button  ="(p) => { $emit('on-button', p); }"
    >
        © 2018
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
        left:           auto;
        right:          $ui-margin-right;
        text-align:     right;

        // the size is so small here that wrapping to
        // major text breakpoints is redundant

        @include media ("width<500px") {

            display:    none;
        }
    }

</style>
