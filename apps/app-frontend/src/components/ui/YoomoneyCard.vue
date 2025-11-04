<script lang="ts" setup>
import { open } from '@tauri-apps/plugin-shell';
import { Button, Card, Heading, Text } from '@repo/ui';

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  const form = e.target as HTMLFormElement;

  const params = new URLSearchParams(new FormData(form) as any).toString();
  const url = `https://yoomoney.ru/quickpay/confirm?${params}`;

  await open(url);
};
</script>

<template>
  <div class="flex flex-col gap-2.5 w-64 drop-shadow-xl drop-shadow-bgPrimary">
    <Card>
      <Heading :level="4" class="mb-2" align="center">
        Поддержать <span class="text-fg">Sachsen</span>
      </Heading>
      <form @submit="handleSubmit" class="gap-2">
        <input type="hidden" name="receiver" value="4100117607849594" />
        <input type="hidden" name="label" value="$order_id" />
        <input type="hidden" name="quickpay-form" value="button" />
        <input
          placeholder="Сумма"
          name="sum"
          required
          data-type="number"
          class="w-full bg-fg text-black border-black border-1 mb-2 p-2 font-display text-sm outline-none"
          maxlength="4"
        />

        <Button type="approve" class="w-full">Пожертвовать</Button>
      </form>
    </Card>
    <Card>
      <Text size="sm" align="center">
        ВСЕ ДОНАТЫ БЕЗВОЗМЕЗДНЫ, ЗА НИХ НЕ ПОЛОЖЕНО СОВЕРШЕННО НИКАКИХ ВОЗНАГРАЖДЕНИЙ!
      </Text>
    </Card>
  </div>

</template>