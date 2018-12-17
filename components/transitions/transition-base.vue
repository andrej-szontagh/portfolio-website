
<template>
    <transition 
        :appear         ="appear"
        :duration       ="{ 
            enter: (transitionDurationEnter + appearDelay) / speed,
            leave: transitionDurationLeave / speed,
        }"
        @before-appear  ="onBeforeAppear"
    >
        <template>
            <slot :anim-styles ="animationInitStyles"/>
        </template>
    </transition>
</template>

<script>

    import anime from 'animejs'

    // from 'anime.js' ..
    const validTransforms = [

        'translateX', 
        'translateY', 
        'translateZ', 
        'rotate', 
        'rotateX', 
        'rotateY', 
        'rotateZ', 
        'scale', 
        'scaleX', 
        'scaleY', 
        'scaleZ', 
        'skewX', 
        'skewY', 
        'perspective'
    ];

    import {Enum} from 'enumify';

    class Easings extends Enum {}

    Easings.initEnum ({

        LINEAR:     { get val () { return 'linear'          }},
        EASE:       { get val () { return 'easeInOutQuad'   }},
        FADE_IN:    { get val () { return 'easeFadeIn'      }},
        FADE_OUT:   { get val () { return 'easeFadeOut'     }},
        FOCUS_IN:   { get val () { return 'easeFocusIn'     }},
        FOCUS_OUT:  { get val () { return 'easeFocusOut'    }},
    });

    anime.easings [Easings.FADE_IN  .val] = anime.bezier (0.0, 0.0, 0.6, 1.0);
    anime.easings [Easings.FADE_OUT .val] = anime.bezier (0.0, 0.7, 0.3, 1.0);
    anime.easings [Easings.FOCUS_IN .val] = anime.bezier (0.0, 0.5, 0.5, 1.0);
    anime.easings [Easings.FOCUS_OUT.val] = anime.bezier (0.0, 0.5, 0.5, 1.0);

    export default {

        Easings,

        Utils: {

            methods: {

                split: function (split, val1, val2, defaulval) {

                    return split ? 
                        this.choose (val1, defaulval) : 
                        this.choose (val2, defaulval);
                },

                choose: function (val, other) {

                    return (val > 0) ? val : other;
                },

                blur: function (isfocused) {

                    // BLUR CONSISTENCY PROBLEM :
                    //
                    // - small devices are a lot more blurry than desktop
                    // - previous solution 'vw' units .. 
                    // - Anime.js seems untable to properly use anything other than 'px' units
                    // - maybe worth considering switching library (Velocity.js ?)
                    //
                    // SOLUTION 1 >>
                    //
                    // use some blur in pixels as initial value and 
                    // when accesible calculate proper blur by window width
                    //
                    // SOLUTION 2 >>
                    //
                    // use some dummy property and animate between 0 and 1
                    // use 'run' callback to update style property 

                    // WARNING: 
                    //
                    // unfortunatelly is seems that 'Anime.js' 
                    // library doesn't properly handle unusual units like 'vw'
                    // values tend to get out of range often getting into extreme values
                    // however animation works fine with pixel values

                    // 'this.$md' returns string name of the breakpoint
                    // all breakpoints are defined as numbers representing particular screen width
                    // this is a little hack to obtain screen width in the early stages before 
                    // components are created when 'window' is not accessible ..

                    let w = Math.round (parseFloat (this.$mq) * 0.016);  // blur(1.6vw)

                    return isfocused ? "blur(0px)" : "blur(" + w + "px)";
                },
            },
        },

        components: {
        },

        props: {

            // TODO: add 'appearDelay' !! to avoid some lagging animations during page load ..

            visible         : { default: true,  type: Boolean   },

            appear          : { default: true,  type: Boolean   },
            appearDelay     : { default: 0.0,   type: Number    },

            speed           : { default: 1.0,   type: Number    },

            paramsInit      : { default: () => { return null },             type: Object },
            paramsEnter     : { default: () => { return { opacity: 1.0 }},  type: Object },
            paramsLeave     : { default: () => { return { opacity: 1.0 }},  type: Object },
            paramsMod       : { default: () => { return {}},                type: Object },
        },
        
        data: function () {

            return {

                s_animation : null,
            }
        },

        computed: {

            transitionDurationEnter: function () {

                return this.computeAnimDuration (this.paramsEnter);
            },

            transitionDurationLeave: function () {

                return this.computeAnimDuration (this.paramsLeave);
            },

            animationInitStyles: function () {

                return this.computeAnimStylesInit ();
            }
        },

        watch: {

            visible: {

                // keep false we cannot animate until mounted
                immediate: false,

                handler (n, o) {

                    this.$nextTick (function () {

                        this.updateAnimation ();
                    })
                },
            },

            paramsMod: {

                // keep false we cannot animate until mounted
                immediate: false,

                handler (n, o) {

                    this.$nextTick (function () {

                        this.updateAnimation ();
                    })
                },
            }
        },

        methods: {

            stringifyStyles (params) {

                let s = "";

                for (let p in params) {

                    if (params.hasOwnProperty (p)) {

                        let v = params [p];

                        v = ((typeof v === 'object') ? v.value : v);

                        s += p + ":" + v + ";";
                    }
                }

                return s;
            },

            computeAnimStylesInit () {

                return this.computeAnimStyles (
                    (this.paramsInit != null) ? 
                        this.paramsInit : 
                        this.paramsLeave);
            },

            computeAnimStyles (params) {

                let styles      = {};
                let transforms  = "";

                for (let p in params) {

                    if (params.hasOwnProperty (p)) {

                        let v = params [p];

                        v = ((typeof v === 'object') ? v.value : v);

                        if (validTransforms.includes (p)) {

                            transforms += p + "(" + v + ") ";

                        } else {

                            styles [p] = v;
                        }
                    }
                }

                styles = (transforms) ? 
                    Object.assign (styles, { 
                        transform : transforms 
                    }) : 
                    styles;

                // console.log ("computeAnimStyles >> ", styles);

                return styles;
            },

            computeAnimDuration: function (params) {

                let duration = 0;

                for (let p in params) {

                    if (params.hasOwnProperty (p)) {

                        let v = params [p];

                        if (typeof v === 'object') {

                            let d = 0;

                            if (v.hasOwnProperty ('duration')) {

                                d += v ['duration'];
                            }

                            if (v.hasOwnProperty ('delay')) {

                                d += v ['delay'];
                            }

                            duration = Math.max (duration, d);
                        }
                    }
                }

                return duration;
            },

            updateAnimation: function (paramsExtra = {}) {

                // this removes animation from the queue 
                if (this.s_animation != null) {
                    this.s_animation.pause ();
                }

                anime.speed = this.speed;

                this.s_animation = anime (
                    Object.assign (
                        {
                            targets: this.$el,
                        },
                        Object.assign (
                            this.visible ? this.paramsEnter : this.paramsLeave, 
                            this.paramsMod,
                            paramsExtra)
                    )
                );
            },

            onBeforeAppear: function (el) {

                this.$nextTick (function () {

                    this.updateAnimation ({ delay: this.appearDelay });
                })
            },
        },
    }
    
</script>

<style lang="scss" scoped>
</style>
