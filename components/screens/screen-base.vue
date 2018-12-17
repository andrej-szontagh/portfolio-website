
<template>
    <transition-focus 
        :visible        ="visible"
        :infocus        ="infocus"
        :appear         ="appear"
        :appear-delay   ="appearDelay"
        :duration       ="1000"
    >
        <div 
            v-show      ="visible"
            slot-scope  ="slot"
            :style      ="slot.animStyles"
            :id         ="id"
            :key        ="id"
            :class      ="{
                'infocus': infocus,
            }"
            class       ="screen"
        >
            <div 
                v-if    ="overlay"
                :key    ="id + '-background'"
                class   ="background"
            />  
            <slot/>
        </div>
    </transition-focus>
</template>

<script>

    // TODO: 
    
    // background is also blurred with the content and 
    // it creates this blurring on the edges .. 
    // we shouldn't blur the background overlay !

    import TransitionFocus from '~/components/transitions/transition-focus.vue';

    export default {

        components: {

            TransitionFocus
        },

        props: {

            id              : { default: null,  type: String    },
            visible         : { default: false, type: Boolean   },
            infocus         : { default: false, type: Boolean   },
            overlay         : { default: true,  type: Boolean   },

            appear          : { default: true,  type: Boolean   },
            appearDelay     : { default: 0.0,   type: Number    },
        },

        methods: {
        },
    }
    
</script>

<style lang="scss" scoped>

    .screen {

        position:               fixed;

        top:                    0;
        left:                   0;
        min-height:             100vh;
        width:                  100vw;

        pointer-events:         none;

        overflow:               hidden;

        .background {

            position:           fixed;

            left:               0;
            top:                0;
            width:              100vw;
            height:             100vh;

            padding:            0;
            margin:             0;

            z-index:            -1;

            // background-image:
            //     radial-gradient(
            //         rgba(
            //             var(--color-bg-r), 
            //             var(--color-bg-g), 
            //             var(--color-bg-b), 0.5) 50%,
            //         rgba(
            //             var(--color-bg-r), 
            //             var(--color-bg-g), 
            //             var(--color-bg-b), 1.0) 100%);

            background-color:   var(--color-bg);
            opacity:            0.8;

            pointer-events:     none;
            user-select:        none;
        }
    }

</style>
