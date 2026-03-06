'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface TableRecord {
  [key: string]: unknown;
}

interface RecordsResponse {
  table: string;
  columns: string[];
  records: TableRecord[];
  count: number;
}

/**
 * テーブル論理名のマッピング
 */
const tableNameMap: Record<string, string> = {
  section_cds: '部署コードマスタ',
  employees: '社員マスタ',
  employee_section_cd: '社員別部署コード',
  departments: '組織マスタ',
  department_employee: '所属組織',
  department_section_cd: '組織別部署コード',
  visible_departments: '参照可能組織',
  permissions: '権限マスタ',
  roles: '役割マスタ',
  permission_role: '権限割当',
  employee_role: '役割割当',
  industries: '業種マスタ',
  customer_groups: '得意先グループマスタ',
  companies: '会社団体マスタ',
  customers: '得意先マスタ',
  customer_section_cd: '部署別得意先',
  quots: '見積',
  prod_quots: '制作見積',
  prod_quot_requests: '制作見積依頼',
  operations: '作業部門マスタ',
  proces_cds: '加工品内容コードマスタ',
  prod_quot_details: '制作見積詳細',
  prod_quot_operations: '作業部門別制作見積',
  prod_quot_return_log: '制作見積差戻管理',
  quot_operations: '作業部門別見積',
};

/**
 * デバッグページ
 * テーブルを選択して全レコードを表示
 */
export default function DebugPage() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [columns, setColumns] = useState<string[]>([]);
  const [records, setRecords] = useState<TableRecord[]>([]);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // テーブル一覧を取得
  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await api.get<{ tables: string[] }>('/api/debug/tables');
        setTables(response.data.tables);
      } catch (err) {
        setError('テーブル一覧の取得に失敗しました');
        console.error(err);
      }
    };
    fetchTables();
  }, []);

  // テーブル選択時にレコードを取得
  useEffect(() => {
    if (!selectedTable) {
      setColumns([]);
      setRecords([]);
      setRecordCount(0);
      return;
    }

    const fetchRecords = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<RecordsResponse>('/api/debug/records', {
          params: { table: selectedTable },
        });
        setColumns(response.data.columns);
        setRecords(response.data.records);
        setRecordCount(response.data.count);
      } catch (err) {
        setError('レコードの取得に失敗しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [selectedTable]);

  // 値を表示用に整形
  const formatValue = (value: unknown): string => {
    if (value === null) return 'NULL';
    if (value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  // テーブル表示名を取得
  const getTableDisplayName = (tableName: string): string => {
    const logicalName = tableNameMap[tableName];
    return logicalName ? `${logicalName} (${tableName})` : tableName;
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      {/* テーブル選択 */}
      <div className="mb-4">
        <select
          id="table-select"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          className="block w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">-- テーブルを選択 --</option>
          {tables.map((table) => (
            <option key={table} value={table}>
              {getTableDisplayName(table)}
            </option>
          ))}
        </select>
      </div>

      {/* エラー表示 */}
      {error && <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">{error}</div>}

      {/* ローディング */}
      {loading && <div className="mb-4 text-gray-600">読み込み中...</div>}

      {/* レコード数 */}
      {selectedTable && !loading && (
        <div className="mb-4 text-sm text-gray-600">
          テーブル: <span className="font-semibold">{getTableDisplayName(selectedTable)}</span> |
          レコード数: <span className="font-semibold">{recordCount}</span>件
        </div>
      )}

      {/* テーブル表示 */}
      {selectedTable && !loading && records.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column} className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                      {formatValue(record[column])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* レコードなし */}
      {selectedTable && !loading && records.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          レコードがありません
        </div>
      )}
    </main>
  );
}
