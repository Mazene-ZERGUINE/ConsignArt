export const TransferRequestStatusEnum = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export type TransferRequestStatus =
  (typeof TransferRequestStatusEnum)[keyof typeof TransferRequestStatusEnum];
