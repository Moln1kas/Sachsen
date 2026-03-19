<script lang="ts" setup>
import { Card, Button, DropdownItem, DropdownList, OnlineStatus, Text, Input, Textarea } from '@repo/ui';
import { AddIcon, ApplyIcon, TrashcanIcon } from '@repo/assets';
import Mod from '../../types/mod.type';
import { updateServer } from '../../api/admin/servers/servers.api';
import { alertDialog, confirmDialog } from '../../core/dialog/dialog';
import { ref } from 'vue';
import { NewServer } from '../../types/server.type';

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isOnline: {
    type: Boolean,
    required: true,
  },
  adress: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  versionHash: {
    type: String,
    required: true,
  },
  mods: {
    type: Array as () => Mod[],
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

const updateData = ref<Partial<NewServer>>({});

const handleUpdate = async () => {
  const confirm = await confirmDialog(
    'Обновление сервера',
    'Вы уверены, что хотите обновить данные этого сервера?',
    { width: 300, height: 200 },
  );

  if(!confirm) return;

  const payload = Object.fromEntries(
    Object.entries(updateData.value).filter(([_, v]) => v !== null && v !== undefined && v !== '')
  );

  if (Object.keys(payload).length === 0) {
    return await alertDialog('Форма пуста', 'Изменения не внесены. Заполните хотя бы одно поле.', { width: 300, height: 200 });
  }

  try {
    await updateServer(props.id, payload as NewServer);

    await alertDialog('Сервер обновлён', 'Вы успешно обновили данные сервера.', { width: 300, height: 200 });
  } catch {
    await alertDialog('Ошибка обновления', 'Неизвестная ошибка при обновлении сервера.', { width: 300, height: 200 });
  }
}
</script>

<template>
  <Card type="dark" class="w-full flex flex-col gap-1">
    <div class="w-full h-10 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <Text size="lg" weight="semibold">
          <OnlineStatus :is-online="props.isOnline"/>
        </Text>
        <Text size="lg" weight="semibold" class="w-80 max-w-80 overflow-x-hidden">{{ props.name }}</Text>

        <Text size="sm" weight="semibold" class="overflow-x-hidden" color="dark">{{ props.adress }}</Text>
      </div>

      <div class="flex items-center space-x-4" v-if="$slots">
        <div class="flex">
          <slot></slot>
        </div>
      </div>
    </div>

    <div class="flex gap-1">
      <div class="w-1/2 h-full">
        <Card>
          <Text v-if="props.description" class="wrap-break-word" size="sm" weight="semibold" color="secondary">{{ props.description }}</Text>
          <Text v-else class="wrap-break-word" size="sm" weight="semibold" color="dark">Описание отсутствует.</Text>
        </Card>
      </div>

      <div class="w-1/2">
        <Card class="flex flex-col gap-2.5">
          <form class="w-full flex flex-col gap-1">
            <div class="flex flex-col gap-0.5">
              <Input v-model="updateData.name" color="dark" placeholder="Название"/>
              <Input v-model="updateData.serverAddress" color="dark" placeholder="Адрес сервера"/>
            </div>

            <div class="flex flex-col gap-0.5">
              <Input v-model="updateData.minecraftVersion" color="dark" placeholder="Версия майнкрафта"/>
              <Input v-model="updateData.minecraftVersionHash" color="dark" placeholder="Хеш версии"/>
            </div>

            <Textarea v-model="updateData.description" color="dark" placeholder="Описание сервера" class="max-h-40"/>

            <Button type="accent" class="w-full h-8" @click="handleUpdate()">
              <ApplyIcon class="fill-fgPrimary"/>
            </Button>
          </form>

          <div class="w-full flex gap-1">
            <DropdownList label="Список модов" class="w-full h-8">
              <DropdownItem v-if="props.mods.length===0" text="Список пуст."/>

              <DropdownItem v-else v-for="m in props.mods" :key="m.id" :text="m.name">
                <template #actions>
                  <Button type="danger" class="w-6 h-6">
                    <TrashcanIcon class="fill-fgPrimary" />
                  </Button>
                </template>
              </DropdownItem>
            </DropdownList>

            <Button 
              type="approve"
              class="w-8 h-8"
              @click=""
            >
              <AddIcon class="fill-fgPrimary" />
            </Button>
          </div>
        </Card>
      </div>
    </div>

    <Card class="flex justify-center gap-5 overflow-x-auto">
      <Text size="sm" weight="semibold" color="secondary">
        {{ props.version }}
      </Text>

      <Text size="sm" weight="semibold" color="dark">
        {{ props.versionHash }}
      </Text>
    </Card>
  </Card>
</template>
