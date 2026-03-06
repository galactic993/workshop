import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination', () => {
  describe('表示/非表示', () => {
    it('totalPages <= 1 の場合は何も表示しない', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('totalPages = 0 の場合は何も表示しない', () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={0} onPageChange={() => {}} />
      );
      expect(container.firstChild).toBeNull();
    });

    it('totalPages > 1 の場合はページネーションを表示する', () => {
      render(<Pagination currentPage={1} totalPages={2} onPageChange={() => {}} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('少ないページ数の場合', () => {
    it('totalPages が maxVisiblePages + 2 以下なら全ページを表示', () => {
      render(
        <Pagination currentPage={1} totalPages={7} onPageChange={() => {}} maxVisiblePages={5} />
      );
      // 1,2,3,4,5,6,7 全て表示される
      for (let i = 1; i <= 7; i++) {
        expect(screen.getByText(String(i))).toBeInTheDocument();
      }
      // 省略記号は表示されない
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    });
  });

  describe('多いページ数の場合', () => {
    it('先頭付近（page 1-3）では末尾に省略記号が表示される', () => {
      render(<Pagination currentPage={1} totalPages={10} onPageChange={() => {}} />);
      // 1,2,3,4,...,10 の形式
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('末尾付近では先頭に省略記号が表示される', () => {
      render(<Pagination currentPage={10} totalPages={10} onPageChange={() => {}} />);
      // 1,...,7,8,9,10 の形式
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('...')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('中間ページでは両側に省略記号が表示される', () => {
      render(<Pagination currentPage={5} totalPages={10} onPageChange={() => {}} />);
      // 1,...,4,5,6,...,10 の形式
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getAllByText('...')).toHaveLength(2);
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  describe('前へボタン', () => {
    it('page 1 では無効化されている', () => {
      render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
      const prevButton = screen.getByRole('button', { name: '<' });
      expect(prevButton).toBeDisabled();
    });

    it('page 2 以降では有効', () => {
      render(<Pagination currentPage={2} totalPages={5} onPageChange={() => {}} />);
      const prevButton = screen.getByRole('button', { name: '<' });
      expect(prevButton).not.toBeDisabled();
    });

    it('クリックで onPageChange(currentPage - 1) が呼ばれる', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

      const prevButton = screen.getByRole('button', { name: '<' });
      await user.click(prevButton);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });
  });

  describe('次へボタン', () => {
    it('最終ページでは無効化されている', () => {
      render(<Pagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
      const nextButton = screen.getByRole('button', { name: '>' });
      expect(nextButton).toBeDisabled();
    });

    it('最終ページ以外では有効', () => {
      render(<Pagination currentPage={4} totalPages={5} onPageChange={() => {}} />);
      const nextButton = screen.getByRole('button', { name: '>' });
      expect(nextButton).not.toBeDisabled();
    });

    it('クリックで onPageChange(currentPage + 1) が呼ばれる', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

      const nextButton = screen.getByRole('button', { name: '>' });
      await user.click(nextButton);

      expect(onPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe('ページ番号クリック', () => {
    it('クリックで onPageChange がそのページ番号で呼ばれる', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

      await user.click(screen.getByRole('button', { name: '3' }));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('現在のページ番号もクリック可能', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<Pagination currentPage={3} totalPages={5} onPageChange={onPageChange} />);

      await user.click(screen.getByRole('button', { name: '3' }));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });
  });

  describe('現在のページのスタイル', () => {
    it('現在のページには青いスタイルが適用される', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
      const currentButton = screen.getByRole('button', { name: '3' });
      expect(currentButton).toHaveClass('bg-blue-500');
      expect(currentButton).toHaveClass('text-white');
    });

    it('他のページには白いスタイルが適用される', () => {
      render(<Pagination currentPage={3} totalPages={5} onPageChange={() => {}} />);
      const otherButton = screen.getByRole('button', { name: '1' });
      expect(otherButton).toHaveClass('bg-white');
      expect(otherButton).toHaveClass('text-gray-700');
    });
  });
});
