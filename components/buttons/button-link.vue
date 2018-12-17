
<template>
    <button-base
        :id         ="id"
        :href       ="href"
        :mode       ="mode" 
        :visible    ="visible"
        @on-button  ="(p) => { $emit('on-button', p); }"
    >
        <div>
            <slot/>
        </div>
    </button-base>
</template>

<script>

    import ButtonBase from '~/components/buttons/button-base.vue';

    export default {

        ButtonMode : ButtonBase.ButtonMode,

        components: {

            ButtonBase
        },

        props: {

            id      : { default: null, type: String     },
            href    : { default: null, type: String     },
            visible : { default: true, type: Boolean    },
            mode    : { default: ButtonBase.ButtonMode.PRESS, type: Object },
        },
    }
    
</script>

<style lang="scss" scoped>
</style>
