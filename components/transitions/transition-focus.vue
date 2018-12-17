
<template>
    <transition-base 
        :visible        ="visible"
        :appear         ="appear"
        :appear-delay   ="appearDelay"
        :speed          ="speed"
        :params-init    ="{
            opacity:        0.0, 
            filter:         blur (false)
        }"
        :params-enter   ="{
            opacity: {
                value:      1.0,
                duration:   choose (durationEnter,  duration),
                delay:      choose (delayEnter,     delay),
                easing:     Easings.FADE_IN.val
            }
        }"
        :params-leave   ="{
            opacity: {
                value:      0.0,
                duration:   choose (durationLeave,  duration),
                delay:      choose (delayLeave,     delay),
                easing:     Easings.FADE_OUT.val
            }
        }"
        :params-mod     ="Object.assign ({ 
            filter: { 
                value:      blur (infocus),
                duration:   split (infocus, durationFocusIn,    durationFocusOut,   duration),
                delay:      split (infocus, delayFocusIn,       delayFocusOut,      delay),
                easing:     infocus ? Easings.FOCUS_IN.val : Easings.FOCUS_OUT.val
            }
        }, params)"
    >
        <template slot-scope ="slot">
            <slot
                :anim-styles ="slot.animStyles"
            />
        </template>
    </transition-base>
</template>

<script>

    import TransitionBase from '~/components/transitions/transition-base.vue';

    export default {

        Easings : TransitionBase.Easings,

        components: {

            TransitionBase
        },

        mixins: [TransitionBase.Utils],

        props: {

            visible             : { default: true,  type: Boolean   },
            infocus             : { default: false, type: Boolean   },

            appear              : { default: true,  type: Boolean   },
            appearDelay         : { default: 0.0,   type: Number    },

            speed               : { default: 1.0,   type: Number    },

            duration            : { default: 200,   type: Number    },
            durationEnter       : { default: -1,    type: Number    },
            durationLeave       : { default: -1,    type: Number    },
            durationFocusIn     : { default: -1,    type: Number    },
            durationFocusOut    : { default: -1,    type: Number    },

            delay               : { default: 0,     type: Number    },
            delayEnter          : { default: -1,    type: Number    },
            delayLeave          : { default: -1,    type: Number    },
            delayFocusIn        : { default: -1,    type: Number    },
            delayFocusOut       : { default: -1,    type: Number    },

            params              : { default: () => { return {} }, type: Object },
        },

        data: function () {

            return {

                Easings : TransitionBase.Easings,
            }
        },

        methods: {
        },
    }
    
</script>

<style lang="scss" scoped>
</style>
