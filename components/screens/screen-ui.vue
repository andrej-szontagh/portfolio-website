
<template>
    <div id="screen-ui-wrapper">
        <screen-base
            :id             ="'screen-ui'"
            :visible        ="true"
            :appear         ="appear"
            :appear-delay   ="appearDelay"
            :infocus        ="s_infocus"
            :overlay        ="overlay"
        >
            <button-contact     @on-button ="(s) => { onButton (s, ButtonID.CONTACT)    }"/>
            <button-terms       @on-button ="(s) => { onButton (s, ButtonID.TERMS)      }"/>
            <button-copyright   @on-button ="(s) => { onButton (s, ButtonID.COPYRIGHT)  }"/>
            <button-links 
                :selected       ="s_link"
                :selected-mode  ="SelectMode.HIDE"
                @on-button      ="(s, id) => { onButton (s, ButtonID.LINKS, id) }"
            />
        </screen-base>
        <button-links
            v-if            ="(s_link !== ButtonIDLink.NONE)"
            :id-postfix     ="'-selected'"
            :selected       ="s_link"
            :selected-mode  ="SelectMode.SOLO"
            @on-button      ="(s, id) => { onButton (s, ButtonID.LINKS, id) }"
        />
    </div>
</template>

<script>

    import ScreenBase       from '~/components/screens/screen-base.vue';
    import ButtonContact    from '~/components/buttons/button-contact.vue';
    import ButtonTerms      from '~/components/buttons/button-terms.vue';
    import ButtonCopyright  from '~/components/buttons/button-copyright.vue';
    import ButtonLinks      from '~/components/buttons/button-links.vue';

    import {Enum} from 'enumify';

    class ButtonID extends Enum {}

    ButtonID.initEnum ([

        'NONE',
        'CONTACT',
        'TERMS',
        'COPYRIGHT',
        'LINKS',
    ]);

    export default {

        ButtonID,
        ButtonIDLink: ButtonLinks.ButtonID,

        components: {

            ScreenBase,
            ButtonContact,
            ButtonTerms,
            ButtonCopyright,
            ButtonLinks,
            ButtonID,
        },

        props: {

            infocus         : { default: true,  type: Boolean   },
            overlay         : { default: true,  type: Boolean   },

            appear          : { default: true,  type: Boolean   },
            appearDelay     : { default: 0.0,   type: Number    },
        },

        data: function () {

            return {

                ButtonID        : ButtonID,
                ButtonIDLink    : ButtonLinks.ButtonID,
                SelectMode      : ButtonLinks.SelectMode,

                s_link          : ButtonLinks.ButtonID.NONE,
                s_infocus       : this.infocus,
            }
        },

        methods: {

            onButton: function (state, id, id_link = this.ButtonIDLink.NONE) {

                this.s_infocus  = !state;
                this.s_link     = id_link;

                this.$emit ('on-button', state, id, id_link); 
            },
        }
    }

</script>

<style lang="scss" scoped>
</style>
