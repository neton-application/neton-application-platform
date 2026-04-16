<script lang="ts" setup>
import type { ChargeRecord } from '#/api/member/account-center';

import { reactive, ref, onMounted } from 'vue';

import { Card, Input, Space, Table, Tag, message, Button } from 'ant-design-vue';
import dayjs from 'dayjs';

import { fetchCharges } from '#/api/member/account-center';

const tableData = ref<ChargeRecord[]>([]);
const loading = ref(false);
const pagination = reactive({ current: 1, pageSize: 20, total: 0 });
const filters = reactive({ apiCode: '' });

const columns = [
  { title: '时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'API', dataIndex: 'apiName', key: 'apiName' },
  { title: '单价 (元)', dataIndex: 'price', key: 'price' },
  { title: '扣费 (元)', dataIndex: 'amount', key: 'amount' },
  { title: '状态', dataIndex: 'status', key: 'status' },
];

function formatDate(value?: string) {
  if (!value) return '--';
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

function formatStatus(status: number) {
  return status === 1 ? '成功' : '失败';
}

function formatFen(fen?: number | null) {
  if (fen === undefined || fen === null) return '--';
  return (fen / 100).toFixed(4);
}

function buildParams(page?: number) {
  const params: Record<string, any> = {
    pageNo: page ?? pagination.current,
    pageSize: pagination.pageSize,
  };
  if (filters.apiCode) {
    params.apiCode = filters.apiCode;
  }
  return params;
}

async function loadCharges(page?: number) {
  if (page) {
    pagination.current = page;
  }
  loading.value = true;
  try {
    const result = await fetchCharges(buildParams());
    tableData.value = result.list || [];
    pagination.total = result.total || 0;
  } catch (error) {
    console.error(error);
    message.error('加载消费记录失败');
  } finally {
    loading.value = false;
  }
}

function handleSearch() {
  loadCharges(1);
}

function handleTableChange(pag: any) {
  pagination.current = pag.current ?? 1;
  pagination.pageSize = pag.pageSize ?? 20;
  loadCharges();
}

onMounted(() => {
  loadCharges();
});
</script>

<template>
  <div class="p-4">
    <Card title="消费记录">
      <Space class="mb-3" :size="12" >
        <Input
          v-model:value="filters.apiCode"
          placeholder="API 编码"
          allow-clear
          style="width: 200px"
        />
        <Button type="primary" @click="handleSearch">查询</Button>
      </Space>
      <Table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showTotal: (total) => `共 ${total} 条`,
        }"
        row-key="traceId"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'createdAt'">
            {{ formatDate(record.createdAt) }}
          </template>
          <template v-else-if="column.key === 'apiName'">
            {{ record.apiName || record.apiCode || '--' }}
          </template>
          <template v-else-if="column.key === 'price'">
            {{ formatFen(record.price) }}
          </template>
          <template v-else-if="column.key === 'amount'">
            {{ formatFen(record.amount) }}
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="record.status === 1 ? 'green' : 'red'">
              {{ formatStatus(record.status) }}
            </Tag>
          </template>
          <template v-else>
            {{ record[column.dataIndex] ?? '--' }}
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
