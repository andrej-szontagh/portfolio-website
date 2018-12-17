
<template>
    <section class="container">
        <div>
            <gallery/>
            <fixed/>
        </div>
    </section>
</template>

<script>

    import Gallery  from '~/components/gallery.vue';
    import Fixed    from '~/components/fixed.vue';

    export default {

        components: {

            Gallery,
            Fixed
        }
    }

</script>

<style lang="scss">
</style>
