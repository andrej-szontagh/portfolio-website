
<template>
    <a  
        :id         ="id"
        :href       ="href"
        :class      ="{ 
            'hover':    (s_mode     === ButtonMode.HOVER),
            'press':    (s_mode     === ButtonMode.PRESS),
            'visible':  (s_visible  === true),
            'hidden':   (s_visible  === false),
        }" 
        class       ="button"
        @mouseenter ="mouseEnter"
        @mouseleave ="mouseLeave"
        @mousedown  ="mouseDown"
        @touchstart ="touchStart"
    >
        <slot/>
    </a>
</template>

<script>

    import {Enum} from 'enumify';

    class ButtonMode extends Enum {}

    ButtonMode.initEnum (['PRESS', 'HOVER']);

    export default {

        ButtonMode,

        props: {

            id      : { default: null,              type: String    },
            href    : { default: null,              type: String    },
            visible : { default: true,              type: Boolean   },
            mode    : { default: ButtonMode.PRESS,  type: Object,
            
                validator (val) {

                    return [ButtonMode.HOVER, ButtonMode.PRESS].includes (val);
                }
            },
        },

        data: function () {

            return {

                s_visible   : this.visible,
                s_mode      : this.mode,
                s_hover     : false,
                ButtonMode,
            }
        },

        methods: {

            mouseEnter: function () {

                if (this.s_mode === ButtonMode.HOVER) {
                    this.s_hover = true;

                    this.$emit ('on-button', this.s_hover);
                }
            },

            mouseLeave: function () {

                if (this.s_mode === ButtonMode.HOVER) {
                    this.s_hover = false;

                    this.$emit ('on-button', this.s_hover);
                }
            },

            mouseDown: function () {
                
                if (this.s_mode === ButtonMode.PRESS) {

                    this.$emit ('on-button', true);
                }
            },

            touchStart: function () {

                // convert into "press" button
                this.s_mode = ButtonMode.PRESS;

                this.$emit ('on-button', true);
            },
        }
    }
    
</script>

<style lang="scss" scoped>

    .button {

        @include font-normal;

        transition: opacity 0.5s;

        &.visible {

            opacity:        1.0;
            pointer-events: auto;
        }

        &.hidden {

            opacity:        0.0;
            pointer-events: none;
        }

        &.hover { cursor: default; }
        &.press { cursor: pointer; }
    }

</style>
