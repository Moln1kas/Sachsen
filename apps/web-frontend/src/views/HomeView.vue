<script setup lang="ts">
import { ShrimpsOceanBg, ShrimpsBg , DonateBg, TelegramIcon, ReloadIcon, ShrimpIcon} from '@repo/assets';
import { Card, Heading, Text, Button, Stamp } from '@repo/ui'
import { computed, ref } from 'vue';

type Theme = {
  bg: string
}

const psychoMode = ref(false)

const togglePsychoMode = () => {
  psychoMode.value = !psychoMode.value
}


const themeIndex = ref<number>(0);

const themes: Theme[] = [
  { bg: ShrimpsOceanBg },
  { bg: ShrimpsBg },
  { bg: DonateBg }
];

const currentTheme = computed(() => themes[themeIndex.value])

const changeTheme = () => {
  themeIndex.value = (themeIndex.value + 1) % themes.length
}

const openTelegramChanel = () => {
  window.open('https://t.me/sachsen_launcher', '_blank');
}

</script>

<template>
  <div 
    class="w-full h-full bg-cover"
    :class="{ 'psycho-mode': psychoMode }"
    :style="{ backgroundImage: `url(${currentTheme.bg})` }"
  >
  <Card class="w-full h-full flex flex-col justify-center items-center" type="glass">
    <Card class="w-96 flex flex-col gap-2.5" type="glass">
      <Heading align="center" :level="1">Sachsen</Heading>
      <Heading align="center" :level="2" color="secondary">...еще не готов.</Heading>
      <Text weight="bold">Сейчас я веду работу над обновлением этого сайта. Прежняя версия больше не активна. Спасибо за ваш интерес!</Text>

      <div class="pt-2 pb-2 flex justify-center">
        <Stamp class="w-48" text="В разработке" color="purple"/>
      </div>

      <div class="flex justify-center items-center gap-2 h-">
        <div class="w-12 cursor-pointer">
          <TelegramIcon @click="openTelegramChanel"/>
        </div>
        <div class="w-12 cursor-pointer">
          <ShrimpIcon @click="togglePsychoMode"/>
        </div>
        <Button class="w-full" @click="changeTheme">
          <ReloadIcon/> Сменить обои
        </Button>
      </div>
    </Card>
  </Card>
  </div>
</template>

<style scoped>
@keyframes hueFlow {
  0% {
    filter: hue-rotate(0deg) saturate(1.2);
  }
  50% {
    filter: hue-rotate(180deg) saturate(1.6);
  }
  100% {
    filter: hue-rotate(360deg) saturate(1.2);
  }
}

@keyframes floatBg {
  0% {
    background-position: 50% 50%;
    transform: scale(1);
  }
  50% {
    background-position: 55% 45%;
    transform: scale(1.05);
  }
  100% {
    background-position: 50% 50%;
    transform: scale(1);
  }
}

@keyframes wobble {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-6px) rotate(0.5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.psycho-mode {
  animation:
    hueFlow 8s linear infinite,
    floatBg 12s ease-in-out infinite;
}

.psycho-mode .card {
  animation: wobble 6s ease-in-out infinite;
}

</style>