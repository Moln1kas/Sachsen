<script setup lang="ts">
import { Card, Button, Input, Heading, Text, Textarea } from '@repo/ui';
import { ShrimpsOceanBg } from '@repo/assets';
import { useAuthStore } from '../stores/auth.store';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getQustions } from '../api/questions.api';
import Answer from '../types/answer.type';
import Question from '../types/question.type';

const auth = useAuthStore();
const router = useRouter();

const email = ref<string>('');
const username = ref<string>('');
const password = ref<string>('');
const questions = ref<Question[]>([]);
const answers = ref<Answer[]>([]);

onMounted(async () => {
  const questionsRes = await getQustions();
  if(!questionsRes) return console.error(questionsRes);

  questions.value = questionsRes;

  answers.value = questions.value.map((_, id) => ({
    questionId: questions.value[id].id,
    answerText: '',
  }));

  console.log(questions.value)
});

const handleRegister = async () => {
  try {
    const message = await auth.signUp(email.value, username.value, password.value, answers.value)
    alert(message);
    router.push('/');
  } catch (error: any) {
    alert(`Ошибка регистрации: ${error}`);
  }
};
</script>

<template>
  <div 
    class="w-full h-full flex flex-col justify-center items-center shadow-[inset_0_0_0_1px_black]"
    :style="{ backgroundImage: `url(${ShrimpsOceanBg})` }"
  >
    <Card class="flex flex-col gap-2.5" type="glass">
      <Heading align="center" :level="3">Присоединяйтесь к нам!</Heading>
      <form class="flex flex-col gap-2.5" @submit.prevent="handleRegister">
        <div class="flex flex-col gap-1">
          <Input
            v-model="email"
            placeholder="Почта"
            required
            color="glass"
          />
          <Input
            v-model="username"
            placeholder="Никнейм"
            required
            color="glass"
          />
          <Input
            v-model="password"
            placeholder="Пароль"
            type="password"
            required
            color="glass"
          />
        </div>

        <div class="max-h-32 overflow-y-auto">
          <div class="flex flex-col gap-1">
            <Textarea
              v-for="(q, id) in questions"
              :key="q.id"
              v-model="answers[id].answerText"
              :placeholder="q.text"
              required
              color="glass"
            />
          </div>
        </div>

        <Button class="w-full">Подать завявку</Button>
      </form>

      <Text @click="router.push('/login');" :underline="true" color="secondary">Уже есть аккаунт? Тогда вам сюда.</Text>
    </Card>
  </div>
</template>
