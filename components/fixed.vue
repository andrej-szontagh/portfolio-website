
<template>
    <section id ="fixed">
        <screen-u-i
            :infocus                ="true"
            :overlay                ="false"
            :appear                 ="true"
            :appear-delay           ="1000"
            @on-button              ="(s, id, id_link) => { onButton (s, id, id_link) }"
        />
        <screen-contact     :visible ="(popupScreen === PopupScreen.CONTACT)"/>
        <screen-terms       :visible ="(popupScreen === PopupScreen.TERMS)"/>
        <screen-copyright   :visible ="(popupScreen === PopupScreen.COPYRIGHT)"/>
    </section>
</template>

<script>

    import {Enum} from 'enumify';

    class PopupScreen extends Enum {}

    PopupScreen.initEnum ([

        'NONE', 
        'CONTACT', 
        'TERMS',
        'COPYRIGHT',
        'LINKS',
    ]);

    import ScreenUI         from '~/components/screens/screen-ui.vue';
    import ScreenContact    from '~/components/screens/screen-contact.vue';
    import ScreenTerms      from '~/components/screens/screen-terms.vue';
    import ScreenCopyright  from '~/components/screens/screen-copyright.vue';

    export default {

        components: {

            ScreenUI,
            ScreenContact,
            ScreenTerms,
            ScreenCopyright,
        },

        data: function () {

            return {

                PopupScreen,
                popupScreen     : PopupScreen.NONE,
                ButtonID        : ScreenUI.ButtonID,
                ButtonIDLink    : ScreenUI.ButtonIDLink,
            }
        },

        methods: {

            onButton: function (state, id, id_link = ButtonIDLink.NONE) {

                this.popupScreen = PopupScreen.NONE;

                if (state) {

                    switch (id) {

                        case this.ButtonID.CONTACT:     this.popupScreen = PopupScreen.CONTACT;     break;
                        case this.ButtonID.TERMS:       this.popupScreen = PopupScreen.TERMS;       break;
                        case this.ButtonID.COPYRIGHT:   this.popupScreen = PopupScreen.COPYRIGHT;   break;
                        case this.ButtonID.LINKS:       this.popupScreen = PopupScreen.LINKS;       break;
                        
                            // switch (id_link) {

                            //     case this.ButtonIDLink.LINKEDIN:    this.popupScreen = PopupScreen.LINKEDIN;    break;
                            //     case this.ButtonIDLink.BEHANCE:     this.popupScreen = PopupScreen.BEHANCE;     break;
                            //     case this.ButtonIDLink.DRIBBBLE:    this.popupScreen = PopupScreen.DRIBBBLE;    break;
                            //     case this.ButtonIDLink.GITHUB:      this.popupScreen = PopupScreen.GITHUB;      break;
                            // }
                    }
                }
            },
        }
    }

</script>

<style lang="scss" scoped>

    #fixed {

        position:       fixed;

        top:            0;
        left:           0;
        height:         100vh;
        width:          100vw;

        // TODO: 
        //      consider adding 'pointer-events: none;' to the root
        //      each active element will have to have pointer events enabled explicitly
        //      this helps to avoid these problems .. (which are obviously repeating over and over)

        // the container catches pointer events
        pointer-events: none;
    }

</style>
