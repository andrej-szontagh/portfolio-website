<template >
    <transition-base 
        :visible        ="visible"
        :appear         ="appear"
        :speed          ="speed"
        :params-enter   ="{ 
            translateX: { 
                value:      0,
                duration:   choose (durationEnter,  duration),
                delay:      choose (delayEnter,     delay),
                easing:     Easings.EASE.val,
            }, 
            translateY: { 
                value:      0,
                duration:   choose (durationEnter,  duration),
                delay:      choose (delayEnter,     delay),
                easing:     Easings.EASE.val,
            }
        }"
        :params-leave   ="{
            translateX: {
                value:      offsetX,
                duration:   choose (durationLeave,  duration),
                delay:      choose (delayLeave,     delay),
                easing:     Easings.EASE.val,
            },
            translateY: {
                value:      offsetY,
                duration:   choose (durationLeave,  duration),
                delay:      choose (delayLeave,     delay),
                easing:     Easings.EASE.val,
            }
        }"
        :params-mod     ="params"
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

        Easings: TransitionBase.Easings,

        components: {

            TransitionBase,
        },

        mixins: [TransitionBase.Utils],

        props: {

            visible         : { default: true,      type: Boolean   },
            appear          : { default: true,      type: Boolean   },

            speed           : { default: 1.0,       type: Number    },

            duration        : { default: 200,       type: Number    },
            durationEnter   : { default: -1,        type: Number    },
            durationLeave   : { default: -1,        type: Number    },

            delay           : { default: 0,         type: Number    },
            delayEnter      : { default: -1,        type: Number    },
            delayLeave      : { default: -1,        type: Number    },

            offsetY         : { default: "-100%",   type: String    },
            offsetX         : { default: "0%",      type: String    },

            params          : { default: () => { return {}}, type: Object },
        },

        data: function () {

            return {

                Easings : TransitionBase.Easings,
            }
        },
    }
    
</script>

<style lang="scss" scoped>
</style>
