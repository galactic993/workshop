/**
 * 見積画面の基本情報表示コンポーネント
 * 部署、担当者、見積書No、ステータスを表示
 */

interface QuotHeaderInfoProps {
  sectionCd: string;
  sectionName: string;
  employeeName: string;
  quotNumber: string | null;
  quotOn: string | null; // 見積日（YYYY-MM-DD形式）
  quotStatusLabel: string | null;
  prodQuotStatusLabel: string | null;
  quotResultLabel: string | null; // 見積結果
}

export default function QuotHeaderInfo({
  sectionCd,
  sectionName,
  employeeName,
  quotNumber,
  quotOn,
  quotStatusLabel,
  prodQuotStatusLabel,
  quotResultLabel,
}: QuotHeaderInfoProps) {
  // 見積日をYYYY/MM/DD形式に変換
  const formattedQuotOn = quotOn ? quotOn.replace(/-/g, '/') : '-';

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {/* 1行目: 部署 / 担当者 */}
        <div className="flex items-center">
          <span className="w-36 shrink-0 text-sm font-medium text-gray-700">【部署】</span>
          <span className="text-sm text-gray-900">
            {sectionCd} {sectionName}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-36 shrink-0 text-sm font-medium text-gray-700">【担当者】</span>
          <span className="text-sm text-gray-900">{employeeName}</span>
        </div>

        {/* 2行目: 見積書No / 見積日 */}
        <div className="flex items-center">
          <span className="w-36 shrink-0 text-sm font-medium text-gray-700">【見積書No】</span>
          <span className="text-sm text-gray-900">{quotNumber ?? '-'}</span>
        </div>
        <div className="flex items-center">
          <span className="w-36 shrink-0 text-sm font-medium text-gray-700">【見積日】</span>
          <span className="text-sm text-gray-900">{formattedQuotOn}</span>
        </div>

        {/* 3行目: 見積ステータス / 制作見積ステータス */}
        <div className="flex items-center">
          <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
            【見積ステータス】
          </span>
          <span className="text-sm text-gray-900">{quotStatusLabel ?? '-'}</span>
        </div>
        <div className="flex items-center">
          <span className="w-36 shrink-0 text-sm font-medium text-gray-700">
            【制作見積ステータス】
          </span>
          <span className="text-sm text-gray-900">{prodQuotStatusLabel ?? '-'}</span>
        </div>

        {/* 4行目: 見積結果 */}
        <div className="flex items-center">
          <span className="w-36 shrink-0 text-sm font-medium text-gray-700">【見積結果】</span>
          <span className="text-sm text-gray-900">{quotResultLabel ?? '-'}</span>
        </div>
        <div></div>
      </div>
      {/* 区切り線 */}
      <div className="mt-6 border-t border-gray-200" />
    </div>
  );
}
