import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  canAccessSales,
  canAccessSectionCustomer,
  canAccessQuots,
} from './permissions';

describe('hasPermission', () => {
  it('アクセス区分00は常にtrue', () => {
    expect(hasPermission('00', [], 'sales.')).toBe(true);
    expect(hasPermission('00', [], 'any.permission')).toBe(true);
  });

  it('プレフィックス（ワイルドカード）で判定できる', () => {
    const permissions = ['sales.orders.customer', 'sales.quotes.create'];

    expect(hasPermission('40', permissions, 'sales.')).toBe(true);
    expect(hasPermission('40', permissions, 'sales.orders.')).toBe(true);
    expect(hasPermission('40', permissions, 'production.')).toBe(false);
  });

  it('完全一致で判定できる', () => {
    const permissions = ['sales.orders.customer', 'sales.quotes.create'];

    expect(hasPermission('40', permissions, 'sales.orders.customer')).toBe(true);
    expect(hasPermission('40', permissions, 'sales.quotes.create')).toBe(true);
    expect(hasPermission('40', permissions, 'sales.orders.list')).toBe(false);
  });

  it('権限がない場合はfalse', () => {
    expect(hasPermission('40', [], 'sales.')).toBe(false);
    expect(hasPermission('40', [], 'sales.orders.customer')).toBe(false);
  });

  it('accessTypeがnullの場合は権限ベースで判定', () => {
    expect(hasPermission(null, ['sales.orders.customer'], 'sales.')).toBe(true);
    expect(hasPermission(null, [], 'sales.')).toBe(false);
  });
});

describe('canAccessSales', () => {
  it('アクセス区分00はアクセス可能', () => {
    expect(canAccessSales('00', [])).toBe(true);
  });

  it('sales.*権限があればアクセス可能', () => {
    expect(canAccessSales('40', ['sales.orders.customer'])).toBe(true);
    expect(canAccessSales('40', ['sales.quotes.create'])).toBe(true);
  });

  it('sales権限がなければアクセス不可', () => {
    expect(canAccessSales('40', [])).toBe(false);
    expect(canAccessSales('40', ['production.orders'])).toBe(false);
  });
});

describe('canAccessSectionCustomer', () => {
  it('アクセス区分00はアクセス可能', () => {
    expect(canAccessSectionCustomer('00', [])).toBe(true);
  });

  it('sales.orders.customer権限があればアクセス可能', () => {
    expect(canAccessSectionCustomer('40', ['sales.orders.customer'])).toBe(true);
  });

  it('異なる権限ではアクセス不可', () => {
    expect(canAccessSectionCustomer('40', ['sales.quotes.create'])).toBe(false);
    expect(canAccessSectionCustomer('40', ['sales.orders.list'])).toBe(false);
  });
});

describe('canAccessQuots', () => {
  it('アクセス区分00はアクセス可能', () => {
    expect(canAccessQuots('00', [])).toBe(true);
  });

  it('sales.quotes.*権限があればアクセス可能', () => {
    expect(canAccessQuots('40', ['sales.quotes.create'])).toBe(true);
    expect(canAccessQuots('40', ['sales.quotes.approve'])).toBe(true);
    expect(canAccessQuots('40', ['sales.quotes.issue'])).toBe(true);
  });

  it('異なる権限ではアクセス不可', () => {
    expect(canAccessQuots('40', ['sales.orders.customer'])).toBe(false);
    expect(canAccessQuots('40', ['editorial.prod-quote.create'])).toBe(false);
  });
});
