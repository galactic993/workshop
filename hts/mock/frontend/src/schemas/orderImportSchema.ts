import { z } from 'zod';

/**
 * バリデーション定数
 */
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_FILE_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const ACCEPTED_EXTENSION = '.xlsx';

/**
 * バリデーションエラーメッセージ
 */
const VALIDATION_MESSAGES = {
  FILE: {
    REQUIRED: '取込データを選択してください',
    INVALID_TYPE: 'Excel形式（.xlsx）のファイルを選択してください',
    TOO_LARGE: 'ファイルサイズは1MB以下にしてください',
  },
} as const;

/**
 * 受注情報取込フォームのスキーマ
 */
export const orderImportSchema = z.object({
  file: z
    .custom<FileList>()
    .refine((files) => files && files.length === 1, {
      message: VALIDATION_MESSAGES.FILE.REQUIRED,
    })
    .refine(
      (files) => {
        if (!files || files.length === 0) return true; // 必須チェックは上で行う
        const file = files[0];
        // MIMEタイプまたは拡張子でチェック
        return (
          file.type === ACCEPTED_FILE_TYPE || file.name.toLowerCase().endsWith(ACCEPTED_EXTENSION)
        );
      },
      {
        message: VALIDATION_MESSAGES.FILE.INVALID_TYPE,
      }
    )
    .refine(
      (files) => {
        if (!files || files.length === 0) return true; // 必須チェックは上で行う
        return files[0].size <= MAX_FILE_SIZE;
      },
      {
        message: VALIDATION_MESSAGES.FILE.TOO_LARGE,
      }
    ),
});

/**
 * 受注情報取込フォームの型（Zodから型推論）
 */
export type OrderImportFormData = z.infer<typeof orderImportSchema>;
