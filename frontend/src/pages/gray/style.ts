import { createStyles } from "antd-style";

export const useGrayStyles = createStyles(({ css, token, prefixCls }) => ({
  // 灰度管理布局
  layout: css`
    min-height: 100vh;
    background: #f5f7fa;
    background-image: radial-gradient(
        ellipse at 10% 20%,
        rgba(102, 126, 234, 0.08) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 90% 80%,
        rgba(118, 75, 162, 0.06) 0%,
        transparent 50%
      ),
      radial-gradient(
        ellipse at 50% 50%,
        rgba(76, 201, 240, 0.04) 0%,
        transparent 70%
      );
  `,

  // Header 样式
  header: css`
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  `,

  // 页面容器
  page: css`
    /* Card 样式 */
    .${prefixCls}-card {
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.06) !important;
      border-radius: 16px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .${prefixCls}-card-head {
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
      color: #1f2937 !important;
    }

    .${prefixCls}-card-head-title {
      color: #1f2937 !important;
    }

    .${prefixCls}-card-body {
      color: #374151;
    }

    /* 表格样式 */
    .${prefixCls}-table {
      background: transparent !important;
    }

    .${prefixCls}-table-thead > tr > th {
      background: #fafafa !important;
      color: #6b7280 !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
      font-weight: 600;
    }

    .${prefixCls}-table-tbody > tr > td {
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
      color: #374151 !important;
    }

    .${prefixCls}-table-tbody > tr:hover > td {
      background: #fafafa !important;
    }

    .${prefixCls}-table-tbody > tr.${prefixCls}-table-row:hover > td {
      background: rgba(102, 126, 234, 0.06) !important;
    }

    /* 弹窗样式 */
    .${prefixCls}-modal-content {
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }

    .${prefixCls}-modal-header {
      background: transparent !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
    }

    .${prefixCls}-modal-title {
      color: #1f2937 !important;
    }

    .${prefixCls}-modal-close-x {
      color: #6b7280 !important;
    }

    /* 表单样式 */
    .${prefixCls}-form-item-label > label {
      color: #374151 !important;
    }

    .${prefixCls}-input,
      .${prefixCls}-input-affix-wrapper,
      .${prefixCls}-select-selector,
      .${prefixCls}-input-number,
      .${prefixCls}-picker {
      background: #ffffff !important;
      border-color: #d1d5db !important;
      color: #374151 !important;
    }

    .${prefixCls}-input::placeholder,
      .${prefixCls}-select-selection-placeholder {
      color: #9ca3af !important;
    }

    .${prefixCls}-select-dropdown {
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .${prefixCls}-select-item {
      color: #374151 !important;
    }

    .${prefixCls}-select-item-option-active,
      .${prefixCls}-select-item-option-selected {
      background: rgba(102, 126, 234, 0.1) !important;
    }

    /* 按钮样式 */
    .${prefixCls}-btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none !important;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
    }

    .${prefixCls}-btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
    }

    .${prefixCls}-btn-default {
      background: #ffffff !important;
      border-color: #d1d5db !important;
      color: #374151 !important;
    }

    .${prefixCls}-btn-default:hover {
      border-color: #667eea !important;
      color: #667eea !important;
    }

    /* 开关样式 */
    .${prefixCls}-switch-checked {
      background: #10b981 !important;
    }

    /* 标签样式 */
    .${prefixCls}-tag {
      border: none !important;
      font-weight: 500;
    }

    /* 空状态样式 */
    .${prefixCls}-empty-description {
      color: #9ca3af !important;
    }

    /* 分页样式 */
    .${prefixCls}-pagination-item {
      background: #ffffff !important;
      border-color: #d1d5db !important;
    }

    .${prefixCls}-pagination-item a {
      color: #374151 !important;
    }

    .${prefixCls}-pagination-item-active {
      background: #667eea !important;
      border-color: #667eea !important;
    }

    .${prefixCls}-pagination-item-active a {
      color: #ffffff !important;
    }

    /* 统计样式 */
    .${prefixCls}-statistic-title {
      color: #6b7280 !important;
    }

    .${prefixCls}-statistic-content {
      color: #1f2937 !important;
    }

    /* 抽屉样式 */
    .${prefixCls}-drawer-content {
      background: #ffffff !important;
    }

    .${prefixCls}-drawer-header {
      background: transparent !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
    }

    .${prefixCls}-drawer-title {
      color: #1f2937 !important;
    }

    .${prefixCls}-drawer-close {
      color: #6b7280 !important;
    }

    /* 列表样式 */
    .${prefixCls}-list-item {
      border-bottom: 1px solid rgba(0, 0, 0, 0.06) !important;
    }

    .${prefixCls}-list-item-meta-title {
      color: #1f2937 !important;
    }

    .${prefixCls}-list-item-meta-description {
      color: #6b7280 !important;
    }

    /* 分割线样式 */
    .${prefixCls}-divider {
      border-color: rgba(0, 0, 0, 0.06) !important;
    }

    .${prefixCls}-divider-inner-text {
      color: #6b7280 !important;
    }
  `,

  // 标题渐变
  titleGradient: css`
    font-size: 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    letter-spacing: 1px;
  `,
}));
