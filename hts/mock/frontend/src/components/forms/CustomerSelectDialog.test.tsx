import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CustomerSelectDialog, { CustomerSearchResponse } from './CustomerSelectDialog';

// モック検索関数
const createMockSearchFn = (response: CustomerSearchResponse) => {
  return vi.fn().mockResolvedValue(response);
};

const mockCustomers = [
  { customer_id: 1, customer_cd: '001', customer_name: '得意先A' },
  { customer_id: 2, customer_cd: '002', customer_name: '得意先B' },
  { customer_id: 3, customer_cd: '003', customer_name: '得意先C' },
];

describe('CustomerSelectDialog', () => {
  describe('表示/非表示', () => {
    it('isOpen=false の場合は何も表示しない', () => {
      const { container } = render(
        <CustomerSelectDialog
          isOpen={false}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('isOpen=true の場合はダイアログを表示する', () => {
      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
        />
      );
      expect(screen.getByText('得意先選択')).toBeInTheDocument();
    });

    it('カスタムタイトルを表示できる', () => {
      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
          title="商品選択"
        />
      );
      expect(screen.getByText('商品選択')).toBeInTheDocument();
    });
  });

  describe('フィールドラベル', () => {
    it('デフォルトのラベルが表示される', () => {
      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
        />
      );
      expect(screen.getByText('得意先コード')).toBeInTheDocument();
      expect(screen.getByText('得意先名')).toBeInTheDocument();
    });

    it('カスタムラベルを表示できる', () => {
      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
          fieldLabels={{ code: '商品コード', name: '商品名' }}
        />
      );
      expect(screen.getByText('商品コード')).toBeInTheDocument();
      expect(screen.getByText('商品名')).toBeInTheDocument();
    });
  });

  describe('バリデーション', () => {
    it('得意先コードに半角数字以外を入力して検索するとエラー', async () => {
      const user = userEvent.setup();
      const searchFn = createMockSearchFn({ success: true, customers: [] });
      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={searchFn}
        />
      );

      const codeInput = screen.getByLabelText('得意先コード');
      await user.type(codeInput, 'abc');

      // 検索ボタンをクリックしてバリデーションを発動
      const searchButton = screen.getByRole('button', { name: '検索' });
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('半角数字で入力してください')).toBeInTheDocument();
      });

      // バリデーションエラー時は検索関数が呼ばれない
      expect(searchFn).not.toHaveBeenCalled();
    });

    it('得意先コードに5桁超入力すると警告', async () => {
      const user = userEvent.setup();
      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
        />
      );

      const codeInput = screen.getByLabelText('得意先コード');
      // maxLength=5 で制限されているため、5桁までしか入力できない
      await user.type(codeInput, '123456');
      expect(codeInput).toHaveValue('12345');
    });
  });

  describe('検索機能', () => {
    it('検索ボタンクリックで searchFn が呼ばれる', async () => {
      const user = userEvent.setup();
      const searchFn = createMockSearchFn({ success: true, customers: mockCustomers });

      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={searchFn}
        />
      );

      const searchButton = screen.getByRole('button', { name: '検索' });
      await user.click(searchButton);

      expect(searchFn).toHaveBeenCalledTimes(1);
    });

    it('検索結果が表示される', async () => {
      const user = userEvent.setup();
      const searchFn = createMockSearchFn({ success: true, customers: mockCustomers });

      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={searchFn}
        />
      );

      const searchButton = screen.getByRole('button', { name: '検索' });
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('001')).toBeInTheDocument();
        expect(screen.getByText('得意先A')).toBeInTheDocument();
        expect(screen.getByText('002')).toBeInTheDocument();
        expect(screen.getByText('得意先B')).toBeInTheDocument();
      });
    });

    it('検索結果が0件の場合「該当する得意先がありません」を表示', async () => {
      const user = userEvent.setup();
      const searchFn = createMockSearchFn({ success: true, customers: [] });

      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={searchFn}
        />
      );

      const searchButton = screen.getByRole('button', { name: '検索' });
      await user.click(searchButton);

      await waitFor(() => {
        expect(screen.getByText('該当する得意先がありません')).toBeInTheDocument();
      });
    });

    it('検索失敗時に onError が呼ばれる', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();
      const searchFn = createMockSearchFn({
        success: false,
        customers: [],
        message: 'エラーが発生しました',
      });

      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={searchFn}
          onError={onError}
        />
      );

      const searchButton = screen.getByRole('button', { name: '検索' });
      await user.click(searchButton);

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith('エラーが発生しました');
      });
    });
  });

  describe('選択機能', () => {
    it('ラジオボタンで得意先を選択できる', async () => {
      const user = userEvent.setup();
      const searchFn = createMockSearchFn({ success: true, customers: mockCustomers });

      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={searchFn}
        />
      );

      // 検索実行
      await user.click(screen.getByRole('button', { name: '検索' }));

      await waitFor(() => {
        expect(screen.getByText('001')).toBeInTheDocument();
      });

      // ラジオボタンをクリック
      const radios = screen.getAllByRole('radio');
      await user.click(radios[0]);

      expect(radios[0]).toBeChecked();
    });

    it('選択ボタンは得意先未選択時に disabled', () => {
      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
        />
      );

      const selectButton = screen.getByRole('button', { name: '選択' });
      expect(selectButton).toBeDisabled();
    });

    it('選択確定で onSelect が呼ばれダイアログが閉じる', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const onClose = vi.fn();
      const searchFn = createMockSearchFn({ success: true, customers: mockCustomers });

      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={onClose}
          onSelect={onSelect}
          searchFn={searchFn}
        />
      );

      // 検索実行
      await user.click(screen.getByRole('button', { name: '検索' }));

      await waitFor(() => {
        expect(screen.getByText('001')).toBeInTheDocument();
      });

      // 選択
      const radios = screen.getAllByRole('radio');
      await user.click(radios[0]);

      // 選択ボタンクリック
      const selectButton = screen.getByRole('button', { name: '選択' });
      await user.click(selectButton);

      expect(onSelect).toHaveBeenCalledWith(mockCustomers[0]);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('キャンセル・閉じる', () => {
    it('キャンセルボタンで onClose が呼ばれる', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={onClose}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
        />
      );

      const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
      await user.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('オーバーレイクリックで onClose が呼ばれる', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();

      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={onClose}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
        />
      );

      // オーバーレイ（背景）をクリック
      const overlay = document.querySelector('.bg-black.bg-opacity-50');
      if (overlay) {
        await user.click(overlay);
        expect(onClose).toHaveBeenCalled();
      }
    });
  });

  describe('codeMaxLength', () => {
    it('デフォルトで5文字まで入力可能', () => {
      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
        />
      );

      const codeInput = screen.getByLabelText('得意先コード');
      expect(codeInput).toHaveAttribute('maxLength', '5');
    });

    it('カスタムの最大文字数を設定できる', () => {
      render(
        <CustomerSelectDialog
          isOpen={true}
          onClose={() => {}}
          onSelect={() => {}}
          searchFn={createMockSearchFn({ success: true, customers: [] })}
          codeMaxLength={10}
        />
      );

      const codeInput = screen.getByLabelText('得意先コード');
      expect(codeInput).toHaveAttribute('maxLength', '10');
    });
  });
});
