<script lang="ts" setup>
import { Button, Card, Text } from '@repo/ui';
import Server, { type NewServer } from '../types/server.type';
import { onMounted, ref } from 'vue';
import { getMinecraftServerList } from '../api/minecraft.api';
import ServerCard from '../components/ui/ServerCard.vue';
import { AddIcon, TrashcanIcon } from '@repo/assets';
import { alertDialog, confirmDialog, formDialog } from '../core/dialog/dialog';
import { FormDialogField } from '../core/dialog/types';
import { createServer, deleteServer } from '../api/admin/servers/servers.api';

const servers = ref<Server[]>([]);

onMounted(async () => {
  servers.value = await getMinecraftServerList();
});

const createServerHandler = async () => {
  const fields: FormDialogField[] = [
    { key: 'name', placeholder: 'Название сервера' },
    { key: 'serverAddress', placeholder: 'Адрес сервера' },
    { key: 'minecraftVersion', placeholder: 'Версия майнкрафта' },
    { key: 'minecraftVersionHash', placeholder: 'Хеш версии' },
    { key: 'description', placeholder: 'Описание сервера' },
  ];

  const form = await formDialog<NewServer>(
    'Новый сервер',
    'Введите данные нового сервера:',
    fields,
    { width: 400, height: 425 }
  );

  if(!form) return;

  const isInvalid = fields.some(f => {
    const key = f.key as keyof NewServer;
    return !form[key]?.toString().trim();
  });

  if(isInvalid) {
    await alertDialog('Ошибка создания', 'Пожалуйста, заполните все поля.', { width: 300, height: 200 });
    return;
  }

  try {
    await createServer(form);
    servers.value = await getMinecraftServerList();

    await alertDialog('Сервер успешно создан', 'Вы успешно создали новый сервер.', { width: 300, height: 200 });
  } catch (err: any) {
    await alertDialog('Ошибка создания', err || 'Неизвестная ошибка при создании сервера.', { width: 300, height: 200 });
  }
}

const handleDelete = async (id: number) => {
  const confirm = await confirmDialog(
    'Удаление сервера',
    'Вы уверены, что хотите удалить этот сервер?'
  );

  if(!confirm) return;

  try {
    await deleteServer(id);
    servers.value = await getMinecraftServerList();

    await alertDialog('Сервер успешно удалён', 'Вы успешно удалили сервер.', { width: 300, height: 200 });
  } catch (err: any) {
    await alertDialog('Ошибка удаления', err || 'Неизвестная ошибка при удалении сервера.', { width: 300, height: 200 });
  }
}
</script>

<template>
  <Card class="w-full h-full overflow-hidden">
    <div class="flex flex-col min-h-0 h-full overflow-y-auto pr-2 gap-2.5">
      <ServerCard 
        v-for="s in servers"
        :id="s.id"
        :name="s.name"
        :is-online="true"
        :adress="s.serverAddress"
        :version="s.minecraftVersion"
        :version-hash="s.minecraftVersionHash"
        :mods="s.mods"
        :description="s.description"
      >
        <Button type="danger">
          <TrashcanIcon class="fill-fgPrimary" @click="handleDelete(s.id)"/>
        </Button>
      </ServerCard>

      <Card
        class="sticky bottom-0 z-10 border-t p-3 mx-auto w-fit"
        type="glass"
      >
        <div class="flex justify-center items-center gap-2.5">
          <Text size="sm" color="secondary" weight="semibold">Новый сервер</Text>
          <Button @click="createServerHandler()" class="w-8 h-8" type="accent">
            <AddIcon class="fill-fgPrimary"/>
          </Button>
        </div>
      </Card>
    </div>
  </Card>
</template>