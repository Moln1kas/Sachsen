<script lang="ts" setup>
import { open } from '@tauri-apps/plugin-shell';
import { Button, Card, Heading, Text, Input } from '@repo/ui';

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;

  const params = new URLSearchParams(new FormData(form) as any).toString();
  const url = `https://yoomoney.ru/quickpay/confirm?${params}`;

  await open(url);
};
</script>

<template>
  <Card class="flex flex-col gap-2.5" type="glass">
    <Heading :level="4" align="center">
      Поддержать <span class="text-fg">Sachsen</span>
    </Heading>
    <form @submit="handleSubmit" class="flex flex-col gap-1">
      <Input type="hidden" name="receiver" value="4100117607849594" />
      <Input type="hidden" name="label" value="$order_id" />
      <Input type="hidden" name="quickpay-form" value="button" />
      <Input 
        placeholder="Сумма"
        name="sum"
        required
        data-type="number"
        maxlength="4"
        color="glass"
      />

      <Button type="approve" class="w-full">Пожертвовать</Button>
    </form>
    <Text size="sm">
      Все пожертвования безвозмездны!
    </Text>
  </Card>

</template>