<script setup lang="ts">
import { useMouse } from '@vueuse/core';

const props = defineProps<{
  hideable?: boolean;
}>();
const { y } = useMouse();

const showHeader = computed(() => y.value < 50 || !props.hideable);
</script>

<template>
  <Transition
    name="slide"
    enter-active-class="animate-fade-in-down animate-duration-200 animate-count-1"
    leave-active-class="animate-fade-out-up animate-duration-200 animate-count-1"
  >
    <header
      v-show="showHeader"
      class="
        fixed
        top-0
        left-0
        w-full
        bg-dark-500
        dark:bg-dark-400
        shadow-lg
        p-4
        h-8
        z-10
      "
    >
      <div class="flex container mx-auto">
        <a href="/" class="flex font-bold">
          <img
            src="https://nuxtnation.com/images/logo-nuxtnation.svg"
            class="mr-4"
            alt=""
        /></a>
        <div class="flex justify-between w-75px">
          <a href="https://github.com/alvarosabu/tres" target="_blank"
            ><i class="i-tabler-brand-github"></i
          ></a>
        </div>
      </div>
    </header>
  </Transition>
</template>
