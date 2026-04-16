import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export type RangeType = '1d' | '7d' | '30d' | 'custom';

export interface AccountSummary {
  balance: number;
  todayCalls: number;
  todayChargeAmount: number;
  lastCall?: {
    apiCode: string;
    apiName: string;
    requestTime: string | null;
    resultCode: number;   // 0=成功
  } | null;
}

export interface AccountCredential {
  clientId: string;
  clientSecret: string;
  clientIdMasked: string;
  clientSecretMasked: string;
}

export interface AccountApiItem {
  apiCode: string;
  apiName: string;
  description?: string;
  price: number;
  customPrice?: number | null;
  status: number;
}

export interface AccountTrendVO {
  statDate: string;
  callCount: number;
  totalCharge: number;
}

export interface TrendQuery {
  range: RangeType;
  startTime?: string;
  endTime?: string;
}

/** 消费记录 —— 与后端 ChargeRecordVO 对齐 */
export interface ChargeRecord {
  id: number;
  apiCode: string | null;
  apiName: string | null;
  price: number;       // 单价（分）
  amount: number;      // 实际扣除（分）
  status: number;      // 1=成功
  createdAt: string | null;
}

export interface ChargeQuery extends PageParam {
  apiCode?: string;
}

/** 请求日志 —— 与后端 PlatformLogVO 对齐 */
export interface LogRecord {
  id: number;
  apiCode: string | null;
  apiName: string | null;
  requestUrl: string | null;
  duration: number;    // 耗时 ms
  resultCode: number;  // 0=成功
  userIp: string | null;
  createdAt: string | null;
}

/** 日志详情（包含请求/响应体） */
export interface LogDetail {
  id: number;
  apiCode: string | null;
  apiName: string | null;
  requestUrl: string | null;
  requestParams: string | null;
  responseBody: string | null;
  userIp: string | null;
  duration: number;
  resultCode: number;
  createdAt: string | null;
}

export interface LogQuery extends PageParam {
  apiCode?: string;
  status?: 'SUCCESS' | 'FAIL';
}

export function fetchAccountSummary() {
  return requestClient.get<AccountSummary>('/member/account/summary');
}

export function fetchAccountCredential() {
  return requestClient.get<AccountCredential>('/member/account/credentials');
}

export function fetchAccountApis() {
  return requestClient.get<AccountApiItem[]>('/member/account/apis');
}

export function fetchTrend(params: TrendQuery) {
  return requestClient.get<AccountTrendVO[]>('/member/account/trend', { params });
}

export function fetchCharges(params: ChargeQuery) {
  return requestClient.get<PageResult<ChargeRecord>>('/member/account/charges', { params });
}

export function fetchLogs(params: LogQuery) {
  return requestClient.get<PageResult<LogRecord>>('/member/account/logs', { params });
}

export function fetchLogDetail(id: number) {
  return requestClient.get<LogDetail>(`/member/account/logs/${id}`);
}

export function fetchRecentCharges(overrides?: Partial<ChargeQuery>) {
  return fetchCharges({ pageNo: 1, pageSize: 5, ...overrides });
}

export function fetchRecentLogs(overrides?: Partial<LogQuery>) {
  return fetchLogs({ pageNo: 1, pageSize: 5, ...overrides });
}
