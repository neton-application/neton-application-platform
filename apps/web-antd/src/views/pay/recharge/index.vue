<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Card, Row, Col, Button, InputNumber, Table, message } from 'ant-design-vue';
import { requestClient } from '#/api/request';

const loading = ref(false);
const packages = ref<any[]>([]);
const rechargeAmount = ref<number>(100);
const rechargeLoading = ref(false);
const records = ref<any[]>([]);
const total = ref(0);
const pageNo = ref(1);

const columns = [
  { title: 'Amount', dataIndex: 'payPrice', key: 'payPrice' },
  { title: 'Bonus', dataIndex: 'bonusPrice', key: 'bonusPrice' },
  { title: 'Status', dataIndex: 'payStatus', key: 'payStatus' },
  { title: 'Time', dataIndex: 'createdAt', key: 'createdAt' },
];

async function loadPackages() {
  try {
    packages.value = await requestClient.get('/app/pay/wallet-recharge-package/list');
  } catch {
    // ignore
  }
}

async function loadRecords() {
  loading.value = true;
  try {
    const result = await requestClient.get('/app/pay/wallet-recharge/page', {
      params: { pageNo: pageNo.value, pageSize: 10 },
    });
    records.value = result.list || [];
    total.value = result.total || 0;
  } catch {
    message.error('Failed to load recharge records');
  } finally {
    loading.value = false;
  }
}

async function handleRecharge(pkg?: { id: number; payPrice: number; bonusPrice: number }) {
  rechargeLoading.value = true;
  try {
    if (pkg) {
      // 套餐充值：totalPrice/payPrice/bonusPrice 全部来自套餐
      await requestClient.post('/app/pay/wallet-recharge/create', {
        totalPrice: pkg.payPrice + pkg.bonusPrice,
        payPrice: pkg.payPrice,
        bonusPrice: pkg.bonusPrice,
        packageId: pkg.id,
      });
    } else {
      // 自定义金额充值：无赠送，totalPrice = payPrice
      const payPrice = rechargeAmount.value * 100;
      await requestClient.post('/app/pay/wallet-recharge/create', {
        totalPrice: payPrice,
        payPrice,
        bonusPrice: 0,
      });
    }
    message.success('Recharge order created');
    loadRecords();
  } catch {
    message.error('Failed to create recharge');
  } finally {
    rechargeLoading.value = false;
  }
}

onMounted(() => {
  loadPackages();
  loadRecords();
});
</script>

<template>
  <div class="p-4">
    <Card title="Recharge" class="mb-4">
      <div v-if="packages.length > 0" class="mb-4">
        <h4 class="mb-2">Recharge Packages</h4>
        <Row :gutter="12">
          <Col v-for="pkg in packages" :key="pkg.id" :span="6">
            <Card hoverable class="text-center" @click="handleRecharge(pkg)">
              <div class="text-lg font-bold">&yen;{{ (pkg.payPrice / 100).toFixed(0) }}</div>
              <div v-if="pkg.bonusPrice" class="text-sm text-green-500">
                +&yen;{{ (pkg.bonusPrice / 100).toFixed(0) }} bonus
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div class="flex items-center gap-3">
        <span>Custom Amount:</span>
        <InputNumber v-model:value="rechargeAmount" :min="1" :max="100000" prefix="&yen;" />
        <Button type="primary" :loading="rechargeLoading" @click="handleRecharge()">
          Recharge
        </Button>
      </div>
    </Card>
    <Card title="Recharge Records">
      <Table
        :columns="columns"
        :data-source="records"
        :loading="loading"
        :pagination="{ current: pageNo, pageSize: 10, total }"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'payPrice'">
            &yen;{{ (record.payPrice / 100).toFixed(2) }}
          </template>
          <template v-if="column.key === 'bonusPrice'">
            {{ record.bonusPrice ? `+¥${(record.bonusPrice / 100).toFixed(2)}` : '-' }}
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
