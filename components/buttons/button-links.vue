
<template>
    <div 
        :id     ="'external-links' + idPostfix"
        class   ="wrapper"
    >
        <button-link
            :id         ="'button-link-linkedin'"
            :href       ="'https://www.linkedin.com/in/andrejszontagh/'"
            :mode       ="ButtonMode.HOVER" 
            :visible    ="visible"
            :style      ="visibility (selected, ButtonID.LINKEDIN)"
            target      ="_blank"
            @on-button  ="(s) => { emitButton (s, ButtonID.LINKEDIN); }"
        >
            LinkedIn
        </button-link>
        <button-link
            :id         ="'button-link-behance'"
            :href       ="'https://www.behance.net/andrejszon331e'"
            :mode       ="ButtonMode.HOVER" 
            :visible    ="visible"
            :style      ="visibility (selected, ButtonID.BEHANCE)"
            target      ="_blank"
            @on-button  ="(s) => { emitButton (s, ButtonID.BEHANCE); }"
        >
            Behance
        </button-link>
        <button-link
            :id         ="'button-link-dribbble'"
            :href       ="'https://dribbble.com/AndrejSzontagh'"
            :mode       ="ButtonMode.HOVER" 
            :visible    ="visible"
            :style      ="visibility (selected, ButtonID.DRIBBBLE)"
            target      ="_blank"
            @on-button  ="(s) => { emitButton (s, ButtonID.DRIBBBLE); }"
        >
            Dribbble
        </button-link>
        <button-link
            :id         ="'button-link-github'"
            :href       ="'https://github.com/andrej-szontagh'"
            :mode       ="ButtonMode.HOVER" 
            :visible    ="visible"
            :style      ="visibility (selected, ButtonID.GITHUB)"
            target      ="_blank"
            @on-button  ="(s) => { emitButton (s, ButtonID.GITHUB); }"
        >
            GitHub
        </button-link>
    </div>
</template>

<script>

    import ButtonLink from '~/components/buttons/button-link.vue';

    import {Enum} from 'enumify';

    class ButtonID extends Enum {}

    ButtonID.initEnum ([

        'NONE',
        'LINKEDIN',
        'BEHANCE',
        'DRIBBBLE',
        'GITHUB',
    ]);

    class SelectMode extends Enum {}

    SelectMode.initEnum ([

        'NONE',
        'SOLO',
        'HIDE',
    ]);

    export default {

        ButtonID,
        SelectMode,

        components: {

            ButtonLink,
        },

        props: {

            visible         : { default: true,  type: Boolean   },
            idPostfix       : { default: "",    type: String    },
            selected        : { default: () => { return ButtonID    .NONE; }, type: Object },
            selectedMode    : { default: () => { return SelectMode  .NONE; }, type: Object },
        },

        data: function () {

            return {

                ButtonMode  : ButtonLink.ButtonMode,
                ButtonID    : ButtonID,
            }
        },

        methods: {

            emitButton: function (state, target) {

                this.$emit ('on-button', state, target);
            },

            visibility: function (selected, target) {

                // WARNING: visibility affects mouse events !!
                //
                // When visibility is changed to 'hidden' and there is a 
                // mouse over element 'mouseleave' is emitted !
                //
                // So in practice when using doubled elements to avoid blurring of the selected element
                // there are 3 events generated .. enter >> leave >> enter .. 
                // instead of one because of visibility manipulation ..

                // SOLUTION: use 'opacity:0' instead of 'visibility:hidden' ?

                // TODO: consider disabling mouse events during transitions !

                if (selected !== ButtonID.NONE) {

                    switch (this.selectedMode) {

                        case SelectMode.SOLO: return { visibility: (selected == target) ? 'visible' : 'hidden' };
                        case SelectMode.HIDE: return { visibility: (selected == target) ? 'hidden'  : 'visible' };
                    }
                }

                return 'visible';
            },
        },
    }
    
</script>

<style lang="scss" scoped>

    // Defaults ..

    .wrapper {

        display: none;
    }

    // Variations ..

    @include links ("horizontal") {

        .wrapper {

            display:            block;

            position:           absolute;
            top:                $ui-margin-top;
            left:               auto;
            right:              $ui-margin-right;

            text-align:         right;
            float:              right;

            max-width:          none;

            a {
                margin-left:        5em;    // this is for horizontally stacked links
                margin-bottom:      5em;    // this is for vertically stacked links

                float:              right;
                clear:              none;
            }

            /deep/ div {

                transform:          none;
            }
        }
    }

    @include links ("stacked") {

        .wrapper {

            display:            block;

            position:           absolute;
            top:                $ui-margin-top;
            left:               auto;
            right:              $ui-margin-right;

            text-align:         right;
            float:              right;

            max-width:          450px;

            a {
                margin-left:        5em;
                margin-bottom:      4em;

                float:              right;
                clear:              none;
            }

            /deep/ div {

                transform:          none;
            }
        }
    }

    @include links ("vertical") {

        .wrapper {

            display:            block;

            position:           absolute;
            top:                $ui-margin-top;
            left:               auto;
            right:              $ui-margin-right - 0.48rem;

            text-align:         right;
            float:              right;

            max-width:          none;

            a {
                margin-left:        0em;    // this is for horizontally stacked links
                margin-bottom:      7em;    // this is for vertically stacked links

                float:              right;
                clear:              both;

                // this is little hack that will help remove extra margins
                // caused by rotation of the children

                //width:              0;
                //height:             0;

                /deep/ div {

                    // rotation doesn't affect the parent container which is a problem !
                    // https://stackoverflow.com/questions/16301625/rotated-elements-in-css-that-affect-their-parents-height-correctly

                    transform-origin:   top right;
                    transform:          rotate(90deg) translateX(100%);
                }
            }
        }
    }

</style>
