export const TransferRequestStatusEnum = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export type TransferRequestStatus =
  (typeof TransferRequestStatusEnum)[keyof typeof TransferRequestStatusEnum];

export const TransferRequestActionType = {
  APPROVE: 'approve',
  REJECT: 'reject',
} as const;

export type TransferRequestActionType =
  (typeof TransferRequestActionType)[keyof typeof TransferRequestActionType];
