import { useState, Dispatch, SetStateAction } from 'react';

/**
 * 見積詳細ページのダイアログ状態管理
 * 各種ダイアログの開閉状態とローディング状態を一元管理
 */

// 作成関連
interface CreateDialogs {
  createConfirmDialogOpen: boolean;
  setCreateConfirmDialogOpen: Dispatch<SetStateAction<boolean>>;
  createLoading: boolean;
  setCreateLoading: Dispatch<SetStateAction<boolean>>;
  createSuccessDialogOpen: boolean;
  setCreateSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
  createdQuotId: number | null;
  setCreatedQuotId: Dispatch<SetStateAction<number | null>>;
}

// 制作見積依頼関連
interface ProdRequestDialogs {
  prodRequestConfirmDialogOpen: boolean;
  setProdRequestConfirmDialogOpen: Dispatch<SetStateAction<boolean>>;
  prodRequestModalOpen: boolean;
  setProdRequestModalOpen: Dispatch<SetStateAction<boolean>>;
  prodRequestExecDialogOpen: boolean;
  setProdRequestExecDialogOpen: Dispatch<SetStateAction<boolean>>;
  prodRequestExecLoading: boolean;
  setProdRequestExecLoading: Dispatch<SetStateAction<boolean>>;
  prodRequestSuccessDialogOpen: boolean;
  setProdRequestSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// 承認関連
interface ApproveDialogs {
  approveDialogOpen: boolean;
  setApproveDialogOpen: Dispatch<SetStateAction<boolean>>;
  cancelApproveDialogOpen: boolean;
  setCancelApproveDialogOpen: Dispatch<SetStateAction<boolean>>;
  approveLoading: boolean;
  setApproveLoading: Dispatch<SetStateAction<boolean>>;
  approveSuccessDialogOpen: boolean;
  setApproveSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
  cancelApproveSuccessDialogOpen: boolean;
  setCancelApproveSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// 発行関連
interface IssueDialogs {
  issueDialogOpen: boolean;
  setIssueDialogOpen: Dispatch<SetStateAction<boolean>>;
  issueLoading: boolean;
  setIssueLoading: Dispatch<SetStateAction<boolean>>;
  reissueDialogOpen: boolean;
  setReissueDialogOpen: Dispatch<SetStateAction<boolean>>;
  reissueLoading: boolean;
  setReissueLoading: Dispatch<SetStateAction<boolean>>;
  issueSuccessDialogOpen: boolean;
  setIssueSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
  reissueSuccessDialogOpen: boolean;
  setReissueSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// 登録取消関連
interface CancelRegisterDialogs {
  cancelRegisterDialogOpen: boolean;
  setCancelRegisterDialogOpen: Dispatch<SetStateAction<boolean>>;
  cancelRegisterLoading: boolean;
  setCancelRegisterLoading: Dispatch<SetStateAction<boolean>>;
  cancelRegisterSuccessDialogOpen: boolean;
  setCancelRegisterSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// 差戻し関連
interface RejectDialogs {
  rejectDialogOpen: boolean;
  setRejectDialogOpen: Dispatch<SetStateAction<boolean>>;
  rejectLoading: boolean;
  setRejectLoading: Dispatch<SetStateAction<boolean>>;
  rejectSuccessDialogOpen: boolean;
  setRejectSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// 見積登録関連
interface ProductionRegisterDialogs {
  productionRegisterDialogOpen: boolean;
  setProductionRegisterDialogOpen: Dispatch<SetStateAction<boolean>>;
  productionRegisterLoading: boolean;
  setProductionRegisterLoading: Dispatch<SetStateAction<boolean>>;
  productionRegisterSuccessDialogOpen: boolean;
  setProductionRegisterSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// 見積更新関連
interface QuotUpdateDialogs {
  quotUpdateDialogOpen: boolean;
  setQuotUpdateDialogOpen: Dispatch<SetStateAction<boolean>>;
  quotUpdateLoading: boolean;
  setQuotUpdateLoading: Dispatch<SetStateAction<boolean>>;
  quotUpdateSuccessDialogOpen: boolean;
  setQuotUpdateSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// ステータス00更新関連
interface Status00UpdateDialogs {
  status00UpdateDialogOpen: boolean;
  setStatus00UpdateDialogOpen: Dispatch<SetStateAction<boolean>>;
  status00UpdateLoading: boolean;
  setStatus00UpdateLoading: Dispatch<SetStateAction<boolean>>;
  status00UpdateSuccessDialogOpen: boolean;
  setStatus00UpdateSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// ステータス00登録関連
interface Status00RegisterDialogs {
  status00RegisterDialogOpen: boolean;
  setStatus00RegisterDialogOpen: Dispatch<SetStateAction<boolean>>;
  status00RegisterLoading: boolean;
  setStatus00RegisterLoading: Dispatch<SetStateAction<boolean>>;
  status00RegisterSuccessDialogOpen: boolean;
  setStatus00RegisterSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// ステータス60更新関連
interface Status60UpdateDialogs {
  status60UpdateDialogOpen: boolean;
  setStatus60UpdateDialogOpen: Dispatch<SetStateAction<boolean>>;
  status60UpdateLoading: boolean;
  setStatus60UpdateLoading: Dispatch<SetStateAction<boolean>>;
  status60UpdateSuccessDialogOpen: boolean;
  setStatus60UpdateSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// 削除関連
interface DeleteDialogs {
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: Dispatch<SetStateAction<boolean>>;
  deleteLoading: boolean;
  setDeleteLoading: Dispatch<SetStateAction<boolean>>;
  deleteSuccessDialogOpen: boolean;
  setDeleteSuccessDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// その他
interface OtherDialogs {
  backConfirmDialogOpen: boolean;
  setBackConfirmDialogOpen: Dispatch<SetStateAction<boolean>>;
}

// すべてのダイアログを統合した型
export type UseQuotDetailDialogsReturn = CreateDialogs &
  ProdRequestDialogs &
  ApproveDialogs &
  IssueDialogs &
  CancelRegisterDialogs &
  RejectDialogs &
  ProductionRegisterDialogs &
  QuotUpdateDialogs &
  Status00UpdateDialogs &
  Status00RegisterDialogs &
  Status60UpdateDialogs &
  DeleteDialogs &
  OtherDialogs;

/**
 * 見積詳細ページのダイアログ状態管理フック
 */
export function useQuotDetailDialogs(): UseQuotDetailDialogsReturn {
  // 作成関連
  const [createConfirmDialogOpen, setCreateConfirmDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccessDialogOpen, setCreateSuccessDialogOpen] = useState(false);
  const [createdQuotId, setCreatedQuotId] = useState<number | null>(null);

  // 制作見積依頼関連
  const [prodRequestConfirmDialogOpen, setProdRequestConfirmDialogOpen] = useState(false);
  const [prodRequestModalOpen, setProdRequestModalOpen] = useState(false);
  const [prodRequestExecDialogOpen, setProdRequestExecDialogOpen] = useState(false);
  const [prodRequestExecLoading, setProdRequestExecLoading] = useState(false);
  const [prodRequestSuccessDialogOpen, setProdRequestSuccessDialogOpen] = useState(false);

  // 承認関連
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [cancelApproveDialogOpen, setCancelApproveDialogOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [approveSuccessDialogOpen, setApproveSuccessDialogOpen] = useState(false);
  const [cancelApproveSuccessDialogOpen, setCancelApproveSuccessDialogOpen] = useState(false);

  // 発行関連
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [issueLoading, setIssueLoading] = useState(false);
  const [reissueDialogOpen, setReissueDialogOpen] = useState(false);
  const [reissueLoading, setReissueLoading] = useState(false);
  const [issueSuccessDialogOpen, setIssueSuccessDialogOpen] = useState(false);
  const [reissueSuccessDialogOpen, setReissueSuccessDialogOpen] = useState(false);

  // 登録取消関連
  const [cancelRegisterDialogOpen, setCancelRegisterDialogOpen] = useState(false);
  const [cancelRegisterLoading, setCancelRegisterLoading] = useState(false);
  const [cancelRegisterSuccessDialogOpen, setCancelRegisterSuccessDialogOpen] = useState(false);

  // 差戻し関連
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectSuccessDialogOpen, setRejectSuccessDialogOpen] = useState(false);

  // 見積登録関連
  const [productionRegisterDialogOpen, setProductionRegisterDialogOpen] = useState(false);
  const [productionRegisterLoading, setProductionRegisterLoading] = useState(false);
  const [productionRegisterSuccessDialogOpen, setProductionRegisterSuccessDialogOpen] =
    useState(false);

  // 見積更新関連
  const [quotUpdateDialogOpen, setQuotUpdateDialogOpen] = useState(false);
  const [quotUpdateLoading, setQuotUpdateLoading] = useState(false);
  const [quotUpdateSuccessDialogOpen, setQuotUpdateSuccessDialogOpen] = useState(false);

  // ステータス00更新関連
  const [status00UpdateDialogOpen, setStatus00UpdateDialogOpen] = useState(false);
  const [status00UpdateLoading, setStatus00UpdateLoading] = useState(false);
  const [status00UpdateSuccessDialogOpen, setStatus00UpdateSuccessDialogOpen] = useState(false);

  // ステータス00登録関連
  const [status00RegisterDialogOpen, setStatus00RegisterDialogOpen] = useState(false);
  const [status00RegisterLoading, setStatus00RegisterLoading] = useState(false);
  const [status00RegisterSuccessDialogOpen, setStatus00RegisterSuccessDialogOpen] = useState(false);

  // ステータス60更新関連
  const [status60UpdateDialogOpen, setStatus60UpdateDialogOpen] = useState(false);
  const [status60UpdateLoading, setStatus60UpdateLoading] = useState(false);
  const [status60UpdateSuccessDialogOpen, setStatus60UpdateSuccessDialogOpen] = useState(false);

  // 削除関連
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);

  // その他
  const [backConfirmDialogOpen, setBackConfirmDialogOpen] = useState(false);

  return {
    // 作成関連
    createConfirmDialogOpen,
    setCreateConfirmDialogOpen,
    createLoading,
    setCreateLoading,
    createSuccessDialogOpen,
    setCreateSuccessDialogOpen,
    createdQuotId,
    setCreatedQuotId,

    // 制作見積依頼関連
    prodRequestConfirmDialogOpen,
    setProdRequestConfirmDialogOpen,
    prodRequestModalOpen,
    setProdRequestModalOpen,
    prodRequestExecDialogOpen,
    setProdRequestExecDialogOpen,
    prodRequestExecLoading,
    setProdRequestExecLoading,
    prodRequestSuccessDialogOpen,
    setProdRequestSuccessDialogOpen,

    // 承認関連
    approveDialogOpen,
    setApproveDialogOpen,
    cancelApproveDialogOpen,
    setCancelApproveDialogOpen,
    approveLoading,
    setApproveLoading,
    approveSuccessDialogOpen,
    setApproveSuccessDialogOpen,
    cancelApproveSuccessDialogOpen,
    setCancelApproveSuccessDialogOpen,

    // 発行関連
    issueDialogOpen,
    setIssueDialogOpen,
    issueLoading,
    setIssueLoading,
    reissueDialogOpen,
    setReissueDialogOpen,
    reissueLoading,
    setReissueLoading,
    issueSuccessDialogOpen,
    setIssueSuccessDialogOpen,
    reissueSuccessDialogOpen,
    setReissueSuccessDialogOpen,

    // 登録取消関連
    cancelRegisterDialogOpen,
    setCancelRegisterDialogOpen,
    cancelRegisterLoading,
    setCancelRegisterLoading,
    cancelRegisterSuccessDialogOpen,
    setCancelRegisterSuccessDialogOpen,

    // 差戻し関連
    rejectDialogOpen,
    setRejectDialogOpen,
    rejectLoading,
    setRejectLoading,
    rejectSuccessDialogOpen,
    setRejectSuccessDialogOpen,

    // 見積登録関連
    productionRegisterDialogOpen,
    setProductionRegisterDialogOpen,
    productionRegisterLoading,
    setProductionRegisterLoading,
    productionRegisterSuccessDialogOpen,
    setProductionRegisterSuccessDialogOpen,

    // 見積更新関連
    quotUpdateDialogOpen,
    setQuotUpdateDialogOpen,
    quotUpdateLoading,
    setQuotUpdateLoading,
    quotUpdateSuccessDialogOpen,
    setQuotUpdateSuccessDialogOpen,

    // ステータス00更新関連
    status00UpdateDialogOpen,
    setStatus00UpdateDialogOpen,
    status00UpdateLoading,
    setStatus00UpdateLoading,
    status00UpdateSuccessDialogOpen,
    setStatus00UpdateSuccessDialogOpen,

    // ステータス00登録関連
    status00RegisterDialogOpen,
    setStatus00RegisterDialogOpen,
    status00RegisterLoading,
    setStatus00RegisterLoading,
    status00RegisterSuccessDialogOpen,
    setStatus00RegisterSuccessDialogOpen,

    // ステータス60更新関連
    status60UpdateDialogOpen,
    setStatus60UpdateDialogOpen,
    status60UpdateLoading,
    setStatus60UpdateLoading,
    status60UpdateSuccessDialogOpen,
    setStatus60UpdateSuccessDialogOpen,

    // 削除関連
    deleteDialogOpen,
    setDeleteDialogOpen,
    deleteLoading,
    setDeleteLoading,
    deleteSuccessDialogOpen,
    setDeleteSuccessDialogOpen,

    // その他
    backConfirmDialogOpen,
    setBackConfirmDialogOpen,
  };
}
