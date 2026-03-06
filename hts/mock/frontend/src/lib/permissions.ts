/**
 * 権限判定ユーティリティ
 */

/**
 * 指定された権限プレフィックスに対するアクセス権があるかを判定
 * @param accessType ユーザーのアクセス区分
 * @param permissions ユーザーの権限識別子配列
 * @param permissionPrefix 判定する権限プレフィックス
 * @returns アクセス可能な場合true
 */
export function hasPermission(
  accessType: string | null,
  permissions: string[],
  permissionPrefix: string
): boolean {
  // アクセス区分が「00（すべて）」の場合は常にアクセス可能
  if (accessType === '00') {
    return true;
  }

  // 権限識別子がワイルドカードの場合（末尾が「.」）
  if (permissionPrefix.endsWith('.')) {
    // ユーザーの権限の中に、このプレフィックスで始まるものがあるか確認
    return permissions.some((p) => p.startsWith(permissionPrefix));
  }

  // 権限識別子が完全一致の場合
  return permissions.includes(permissionPrefix);
}

/**
 * 売上管理セクション（/sales）へのアクセス権があるかを判定
 * アクセス区分 00 または sales.* を持っているユーザーがアクセス可能
 */
export function canAccessSales(accessType: string | null, permissions: string[]): boolean {
  return hasPermission(accessType, permissions, 'sales.');
}

/**
 * 部署別得意先メンテナンス（/sales/orders/customer）へのアクセス権があるかを判定
 * アクセス区分 00 または sales.orders.customer を持っているユーザーがアクセス可能
 */
export function canAccessSectionCustomer(
  accessType: string | null,
  permissions: string[]
): boolean {
  return hasPermission(accessType, permissions, 'sales.orders.customer');
}

/**
 * 見積ページ（/sales/quotes）へのアクセス権があるかを判定
 * アクセス区分 00 または sales.quotes.* のいずれかを持っているユーザーがアクセス可能
 */
export function canAccessQuots(accessType: string | null, permissions: string[]): boolean {
  return hasPermission(accessType, permissions, 'sales.quotes.');
}

/**
 * 見積承認権限があるかを判定
 * アクセス区分 00（すべて）または 20（所長）の場合に承認可能
 */
export function canApproveQuots(accessType: string | null): boolean {
  return accessType === '00' || accessType === '20';
}

/**
 * 受注週報（部署別）ページ（/sales/orders/section-report）へのアクセス権があるかを判定
 * アクセス区分 00 または sales.orders.section-report を持っているユーザーがアクセス可能
 */
export function canAccessSectionReport(accessType: string | null, permissions: string[]): boolean {
  return hasPermission(accessType, permissions, 'sales.orders.section-report');
}

/**
 * 受注週報（得意先別）ページ（/sales/orders/customer-report）へのアクセス権があるかを判定
 * アクセス区分 00 または sales.orders.customer-report を持っているユーザーがアクセス可能
 */
export function canAccessCustomerReport(accessType: string | null, permissions: string[]): boolean {
  return hasPermission(accessType, permissions, 'sales.orders.customer-report');
}

/**
 * 受注情報取込ページ（/sales/orders/import）へのアクセス権があるかを判定
 * アクセス区分 00 または sales.orders.import を持っているユーザーがアクセス可能
 */
export function canAccessOrderImport(accessType: string | null, permissions: string[]): boolean {
  return hasPermission(accessType, permissions, 'sales.orders.import');
}
