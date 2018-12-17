
<template>
    <screen-base
        :id         ="'screen-terms'"
        :visible    ="visible"
        :infocus    ="visible"
    >
        <transition-roll 
            :visible        ="visible"
            :duration       ="200"
            :offset-x       ="'0%'"
        >
            <div
                v-show      ="visible"
                slot-scope  ="slot"
                :style      ="slot.animStyles"
                class       ="scroll"
            >
                <div class="block-a">
                    <transition-roll 
                        :visible        ="visible"
                        :duration-enter ="200"
                        :duration-leave ="200"
                        :delay-enter    ="50"
                        :delay-leave    ="200"
                    >
                        <div 
                            v-show      ="visible"
                            slot-scope  ="slot"
                            :style      ="slot.animStyles"
                            class       ="wrapper"
                        >
                            <h2>Weekly milestones</h2>
                            <p>The project will be subdivided into milestone blocks which are designed to be completed in one week. If you are happy with the result and I receive the payment for the milestone we can move on to the next one.</p>
                        </div>
                    </transition-roll>
                </div>
                <div class="block-b">
                    <transition-roll 
                        :visible        ="visible"
                        :duration-enter ="300"
                        :duration-leave ="200"
                        :delay-enter    ="50"
                        :delay-leave    ="200"
                    >
                        <div
                            v-show      ="visible"
                            slot-scope  ="slot"
                            :style      ="slot.animStyles"
                            class       ="wrapper"
                        >
                            <h2>Written communi&shy;cation</h2>
                            <p>It might sounds counterintuitive, but it saves time, makes communication more clear and provide archivation for reference. Primarily email, secondary messaging app. like Skype.</p>
                        </div>
                    </transition-roll>
                </div>
                <div class="block-c">
                    <transition-roll
                        :visible        ="visible"
                        :duration-enter ="400"
                        :duration-leave ="300"
                        :delay-enter    ="200"
                        :delay-leave    ="50"
                    >
                        <div
                            v-show      ="visible"
                            slot-scope  ="slot"
                            :style      ="slot.animStyles"
                            class       ="wrapper"
                        >
                            <h2>Working solo and remote</h2>
                            <p>Ability to have control over my time is very important for me. I understand that sometimes there is too much work for a one man show, but I will always choose the job with conditions that gives me more control over my own life.</p>
                        </div>
                    </transition-roll>
                </div>
                <div class="block-d">
                    <transition-roll
                        :visible        ="visible"
                        :duration-enter ="450"
                        :duration-leave ="300"
                        :delay-enter    ="200"
                        :delay-leave    ="50"
                    >
                        <div
                            v-show      ="visible"
                            slot-scope  ="slot"
                            :style      ="slot.animStyles"
                            class       ="wrapper"
                        >
                            <h2>I read agreements</h2>
                            <p>I would love to keep the right to show the work in my portfolio. I care about tech. support, risks and future burden. Attribution is welcome.</p>
                        </div>
                    </transition-roll>
                </div>
            </div>
        </transition-roll>
    </screen-base>
</template>

<script>

    import ScreenBase       from '~/components/screens/screen-base.vue';
    import TransitionRoll   from '~/components/transitions/transition-roll.vue';

    export default {

        components: {

            ScreenBase,
            TransitionRoll,
        },

        props: {

            visible : { default: false, type: Boolean },
        },
    }
    
</script>

<style lang="scss" scoped>

    .screen {

        height:             100%;

        overflow:           auto;

        display:            flex;
        align-items:        center;

        .scroll {

            pointer-events:         none;

            & > div {

                // content catches pointer events
                pointer-events:     none;
                overflow:           hidden;
            }

            --gap-row:              var(--font-size-3);
            --gap-col:              var(--font-size-3);

            --padding-left:         calc(var(--font-size-6) * 0.7);
            --padding-right:        #{$ui-margin-right};

            // padding-top:            6.3rem;             // to line up with links
            padding-top:            $ui-margin-top;     // to line up with links
            padding-bottom:         $ui-margin-top;     // top !

            padding-left:           var(--padding-left);
            padding-right:          var(--padding-right);

            // this stretches scroll to cover entire screen so
            // we can grab and scroll anywhere on the screen ..
            width:                  calc(100% - var(--padding-left) - var(--padding-right));

            display:                grid;

            grid-template-columns:  30rem 30rem;
            grid-template-rows:     12.5rem 12.5rem;

            // grid-gap:               var(--gap-vert) var(--gap-horz);

            // 'grid-gap' seems not working on Edge, this is a walkaround ..
            row-gap:                var(--gap-row);
            column-gap:             var(--gap-col);

            justify-items:          stretch;

            > div {

                // color:              var(--color-bg);

                display:            inline-block;
                float:              left;
                justify-self:       stretch;
                align-self:         stretch;

                width:              fit-content;
                height:             fit-content;
            }

            h2 {

                // this breaks the heading lines at desired point
                max-width:          8em;

                // do not break the words, do not show the hypens
                -webkit-hyphens:    none;
                    -ms-hyphens:    none;
                        hyphens:    none;

                break-word:         keep-all;
            }

            p, h2 {

                // color:              var(--color-bg);
            }

            .block-a {

                // breaks the line at specific word
                // h2 {    max-width: 10em;    }

                grid-column-start:  1;
                grid-column-end:    span 1;
                grid-row-start:     1;
                grid-row-end:       span 1;
            }

            .block-b {

                // breaks the line at specific word
                // h2 {    max-width: 10em;    }

                grid-column-start:  2;
                grid-column-end:    span 1;
                grid-row-start:     1;
                grid-row-end:       span 1;
            }

            .block-c {

                // breaks the line at specific word
                // h2 {    max-width: 10em;    }

                grid-column-start:  1;
                grid-column-end:    span 1;
                grid-row-start:     2;
                grid-row-end:       span 1;
            }

            .block-d {

                // breaks the line at specific word
                // h2 {    max-width: 15em;    }

                grid-column-start:  2;
                grid-column-end:    span 1;
                grid-row-start:     2;
                grid-row-end:       span 1;
            }
        }

        @include media ("width<text") {

            @include media ("height<1250px") {

                align-items: flex-start;
            }
        }

        @include media ("width<1750px") {

            @include media ("width>=text") {

                @include media ("height<1600px") {

                    align-items: flex-start;
                }
            }

            .scroll {

                grid-template-columns:  30rem;
                grid-template-rows:     auto;

                .block-a {

                    grid-column-start:  1;
                    grid-column-end:    span 1;
                    grid-row-start:     1;
                    grid-row-end:       span 1;
                }

                .block-b {

                    grid-column-start:  1;
                    grid-column-end:    span 1;
                    grid-row-start:     2;
                    grid-row-end:       span 1;
                }

                .block-c {

                    grid-column-start:  1;
                    grid-column-end:    span 1;
                    grid-row-start:     3;
                    grid-row-end:       span 1;
                }

                .block-d {

                    grid-column-start:  1;
                    grid-column-end:    span 1;
                    grid-row-start:     4;
                    grid-row-end:       span 1;
                }
            }
        }

        @include media ("width<850px") {

            align-items: flex-start;

            .scroll {

                grid-template-columns:  30rem;
                grid-template-rows:     auto;

                padding-left:           10%;
                padding-right:          10%;
                width:                  80%;
            }
        }

        @include media ("width<700px") {

            align-items: flex-start;

            .scroll {

                grid-template-columns:  20rem;
                grid-template-rows:     auto;
            }
        }

        @include media ("width<550px") {

            align-items: flex-start;

            .scroll {

                grid-template-columns:  100%;
                grid-template-rows:     auto;

                padding-left:           10%;
                padding-right:          10%;
                width:                  80%;

                h2 {

                    // break the words if necessary, show the hypens
                    -webkit-hyphens:    manual;
                        -ms-hyphens:    manual;
                            hyphens:    manual;

                    break-word:         break-word;
                }
            }
        }
    }

</style>
