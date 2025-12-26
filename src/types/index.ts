/**
 * Feedback message type for user notifications
 */
export type FeedbackType = {
  type: "error" | "success" | "info";
  message: string;
};
