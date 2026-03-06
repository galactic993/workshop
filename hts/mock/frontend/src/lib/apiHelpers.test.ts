import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import api from './api';
import { apiGet, apiPost, apiPut, apiDownload } from './apiHelpers';

// apiモジュールをモック
vi.mock('./api', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./api')>();
  return {
    ...actual,
    default: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
    },
  };
});

describe('apiHelpers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('apiGet', () => {
    it('正常なレスポンスを返す', async () => {
      const mockData = { success: true, items: [1, 2, 3] };
      vi.mocked(api.get).mockResolvedValue({ data: mockData });

      const result = await apiGet<{ items: number[] }>('/test');

      expect(api.get).toHaveBeenCalledWith('/test', { params: undefined });
      expect(result).toEqual(mockData);
    });

    it('パラメータを正しく渡す', async () => {
      const mockData = { success: true };
      vi.mocked(api.get).mockResolvedValue({ data: mockData });

      await apiGet('/test', { page: 1, search: 'query' });

      expect(api.get).toHaveBeenCalledWith('/test', {
        params: { page: 1, search: 'query' },
      });
    });

    it('nullおよびundefinedのパラメータを除去する', async () => {
      const mockData = { success: true };
      vi.mocked(api.get).mockResolvedValue({ data: mockData });

      await apiGet('/test', { page: 1, filter: null, sort: undefined });

      expect(api.get).toHaveBeenCalledWith('/test', {
        params: { page: 1 },
      });
    });

    it('空文字列のパラメータを除去する', async () => {
      const mockData = { success: true };
      vi.mocked(api.get).mockResolvedValue({ data: mockData });

      await apiGet('/test', { page: 1, search: '' });

      expect(api.get).toHaveBeenCalledWith('/test', {
        params: { page: 1 },
      });
    });
  });

  describe('apiPost', () => {
    it('正常なレスポンスを返す', async () => {
      const mockData = { success: true, id: 1 };
      vi.mocked(api.post).mockResolvedValue({ data: mockData });

      const result = await apiPost<{ id: number }>('/test', { name: 'test' });

      expect(api.post).toHaveBeenCalledWith('/test', { name: 'test' });
      expect(result).toEqual(mockData);
    });

    it('データなしでPOSTできる', async () => {
      const mockData = { success: true };
      vi.mocked(api.post).mockResolvedValue({ data: mockData });

      await apiPost('/test');

      expect(api.post).toHaveBeenCalledWith('/test', undefined);
    });
  });

  describe('apiPut', () => {
    it('正常なレスポンスを返す', async () => {
      const mockData = { success: true };
      vi.mocked(api.put).mockResolvedValue({ data: mockData });

      const result = await apiPut('/test/1', { name: 'updated' });

      expect(api.put).toHaveBeenCalledWith('/test/1', { name: 'updated' });
      expect(result).toEqual(mockData);
    });
  });

  describe('apiDownload', () => {
    let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
    let appendChildSpy: ReturnType<typeof vi.spyOn>;
    let removeChildSpy: ReturnType<typeof vi.spyOn>;
    let mockLink: { href: string; download: string; click: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      createObjectURLSpy = vi.spyOn(window.URL, 'createObjectURL').mockReturnValue('blob:test-url');
      revokeObjectURLSpy = vi.spyOn(window.URL, 'revokeObjectURL').mockImplementation(() => {});
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

      mockLink = { href: '', download: '', click: vi.fn() };
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink as unknown as HTMLAnchorElement);
    });

    afterEach(() => {
      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
      appendChildSpy.mockRestore();
      removeChildSpy.mockRestore();
    });

    it('正常にファイルをダウンロードできる', async () => {
      const mockBlob = new Blob(['test content'], { type: 'application/octet-stream' });
      vi.mocked(api.post).mockResolvedValue({
        data: mockBlob,
        headers: {
          'content-disposition': 'attachment; filename="test.xlsx"',
        },
      });

      const result = await apiDownload('/test/download', { id: 1 });

      expect(api.post).toHaveBeenCalledWith('/test/download', { id: 1 }, { responseType: 'blob' });
      expect(result).toEqual({ success: true });
      expect(mockLink.download).toBe('test.xlsx');
      expect(mockLink.click).toHaveBeenCalled();
    });

    it('Content-Dispositionヘッダーがない場合はデフォルトファイル名を使用', async () => {
      const mockBlob = new Blob(['test content'], { type: 'application/octet-stream' });
      vi.mocked(api.post).mockResolvedValue({
        data: mockBlob,
        headers: {},
      });

      const result = await apiDownload('/test/download', undefined, 'custom.xlsx');

      expect(result).toEqual({ success: true });
      expect(mockLink.download).toBe('custom.xlsx');
    });

    it('エラー時はエラーメッセージを返す', async () => {
      // Blobのtext()メソッドをモック
      const mockBlob = {
        text: vi.fn().mockResolvedValue(JSON.stringify({ message: 'ダウンロードエラー' })),
      };
      Object.setPrototypeOf(mockBlob, Blob.prototype);

      vi.mocked(api.post).mockRejectedValue({
        response: {
          data: mockBlob,
          status: 400,
        },
      });

      const result = await apiDownload('/test/download');

      expect(result.success).toBe(false);
      expect(result.message).toBe('ダウンロードエラー');
    });

    it('データなしでダウンロードリクエストできる', async () => {
      const mockBlob = new Blob(['test content'], { type: 'application/octet-stream' });
      vi.mocked(api.post).mockResolvedValue({
        data: mockBlob,
        headers: {},
      });

      await apiDownload('/test/download');

      expect(api.post).toHaveBeenCalledWith('/test/download', {}, { responseType: 'blob' });
    });
  });
});
