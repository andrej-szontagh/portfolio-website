
<template>
    <screen-base
        :id         ="'screen-copyright'"
        :visible    ="visible"
        :infocus    ="visible"
    >
        <div>
            <div class="block-a">
                <p>Design</p>
                <p><b>Andrej Szontagh</b></p>
            </div>
            <div class="block-b">
                <p>Development</p>
                <p><b>Andrej Szontagh</b></p>
            </div>
            <div class="block-c">
                <p>© 2018 Andrej Szontagh.<br>All Rights Reserved.</p>
            </div>
        </div>
    </screen-base>
</template>

<script>

    import ScreenBase from '~/components/screens/screen-base.vue';

    export default {

        components: {

            ScreenBase
        },

        props: {

            visible : { default: false, type: Boolean },
        },
        
        methods: {
        }
    }
    
</script>

<style lang="scss" scoped>

    .screen > div {

        --block-padding:        1.3rem;

        position:               absolute;

        right:                  $ui-margin-right-content;
        bottom:                 $ui-margin-bottom-content;

        width:                  30rem;
        height:                 auto;

        pointer-events:         none;   // !!

        & > div {

            display:            inline-block;
            padding:            var(--block-padding);
        }

        // when the space is running out we align to the left
        @include media ("width<670px") {

            right:              auto;
            left:               calc(#{$ui-margin-left} - var(--block-padding));
        }

        // when the space is running out we push closer to the edge
        @include media ("height<400px") {

            bottom:             $ui-margin-bottom;
        }

        // one column
        @include media ("width<450px") {

            width:              15rem;
        }
    }

</style>
