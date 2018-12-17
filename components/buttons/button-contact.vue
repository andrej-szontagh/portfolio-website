
<template>
    <button-base
        :id         ="'button-contact'"
        :mode       ="ButtonMode.HOVER" 
        :visible    ="visible"
        @on-button  ="(p) => { $emit('on-button', p); }"
    >
        <span class="button-contact-slash">\ </span>Contact
        <span class="button-contact-tail"> me</span>
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

        @include font-boldest;

        font-size:          var(--font-size-3);
        text-transform:     uppercase;
        text-align:         left;

        line-height:        1.6;    // no units !!

        position:           absolute;
        left:               calc(#{$ui-margin-left} - 0.78em);
        top:                $ui-margin-top  - 1.47rem;
        width:              auto;
        height:             auto;

        padding:            0;
        margin:             0;

        cursor:             pointer;

        pointer-events:     auto;
        user-select:        none;

        @include media ("width<text") {

            @include media ("width<text-contact") {

                font-size: var(--font-size-2);
            }

            @include media ("width<450px") {

                .button-contact-tail { display: none; }

                // @include media ("width<370px") {
                //
                //     .button-contact-slash { display: none; }
                //
                //     left: $ui-margin-left;
                // }
            }
        }
    }

</style>
