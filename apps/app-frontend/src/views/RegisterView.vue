<script setup lang="ts">
import { Card, Button } from '@repo/ui';
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
  <Card>
    <input
      v-model="email"
      placeholder="Почта"
      required
      class="w-full bg-fg text-black border-black border-1 mb-2 p-2 font-display text-sm outline-none"
    />
    <input
      v-model="username"
      placeholder="Никнейм"
      required
      class="w-full bg-fg text-black border-black border-1 mb-2 p-2 font-display text-sm outline-none"
    />
    <input
      v-model="password"
      placeholder="Пароль"
      type="password"
      required
      class="w-full bg-fg text-black border-black border-1 mb-2 p-2 font-display text-sm outline-none"
    />
    <input
      v-for="(q, id) in questions"
      v-model="answers[id].answerText"
      :placeholder="q.text"
      required
      class="w-full bg-fg text-black border-black border-1 mb-2 p-2 font-display text-sm outline-none"
    />
    <Button class="w-full" @click="handleRegister()">Подать завявку</Button>
  </Card>
</template>
