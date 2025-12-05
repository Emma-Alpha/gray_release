import {
  CopyOutlined,
  CustomerServiceOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import * as Sentry from '@sentry/react';
import {
  Button,
  Card,
  Collapse,
  Divider,
  Modal,
  Result,
  Space,
  Tag,
  Typography,
  message,
} from 'antd';
import React, { Component, type ErrorInfo, type ReactNode } from 'react';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  showErrorDetail: boolean;
  errorTimestamp?: Date;
}

const HELP_CENTER_URL =
  process.env.HELP_CENTER_URL || 'https://im-support.gz4399.com/';

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      showErrorDetail: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      showErrorDetail: false,
      errorTimestamp: new Date(),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);

    // 保存错误信息到状态中
    this.setState({
      errorInfo,
      errorTimestamp: new Date(),
    });

    // 发送错误到 Sentry
    Sentry.withScope(scope => {
      scope.setTag('errorBoundary', true);
      scope.setContext('errorInfo', {
        componentStack: errorInfo.componentStack,
      });
      Sentry.captureException(error);
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleShowSupport = () => {
    try {
      const supportWindow = window.open(
        HELP_CENTER_URL,
        'customerSupport',
        'width=1000,height=700,scrollbars=yes,resizable=yes,status=yes,location=yes,toolbar=no,menubar=no',
      );

      if (!supportWindow) {
        message.warning('请允许浏览器弹出窗口，或手动访问客服页面');
        setTimeout(() => {
          const userConfirm = window.confirm(
            '弹窗被阻止，是否在当前页面打开客服支持？',
          );
          if (userConfirm) {
            window.location.href = HELP_CENTER_URL;
          }
        }, 1000);
      } else {
        supportWindow.focus();
        message.success('客服支持页面已在新窗口打开');
      }
    } catch (error) {
      console.error('打开客服窗口失败:', error);
      message.error(`打开客服页面失败，请手动访问 ${HELP_CENTER_URL}`);
    }
  };

  private handleShowErrorDetail = () => {
    this.setState({ showErrorDetail: true });
  };

  private handleCloseErrorDetail = () => {
    this.setState({ showErrorDetail: false });
  };

  private copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(`${type}已复制到剪贴板`);
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.success(`${type}已复制到剪贴板`);
      } catch (fallbackErr) {
        message.error('复制失败，请手动选择文本复制');
      }
      document.body.removeChild(textArea);
    }
  };

  private copyAllErrorInfo = () => {
    const { error, errorInfo, errorTimestamp } = this.state;
    const browserInfo = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: errorTimestamp?.toISOString(),
    };

    const errorDetails = [
      '===== 错误详情报告 =====',
      `时间: ${errorTimestamp?.toLocaleString()}`,
      `页面: ${window.location.href}`,
      `浏览器: ${navigator.userAgent}`,
      '',
      '===== 错误信息 =====',
      error ? `${error.name}: ${error.message}` : '无错误信息',
      '',
      '===== 错误堆栈 =====',
      error?.stack || '无堆栈信息',
      '',
      '===== 组件堆栈 =====',
      errorInfo?.componentStack || '无组件堆栈信息',
      '',
    ].join('\n');

    this.copyToClipboard(errorDetails, '完整错误报告');
  };

  private getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';

    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari')) browser = 'Safari';
    else if (ua.includes('Edge')) browser = 'Edge';

    return {
      browser,
      platform: navigator.platform,
      language: navigator.language,
    };
  };

  public render() {
    if (this.state.hasError) {
      const reg = /Loading.*chunk.*failed\./;
      const isLoadingError = reg.test((this.state.error as any).message);
      // 如果是加载错误，则重新加载页面 （自我感觉是下策，但不知道有没有更好的办法）
      if (isLoadingError) {
        window.location.reload();
        return;
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <>
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Result
              status="500"
              title="应用出现错误"
              subTitle="抱歉，应用遇到了一个错误。您可以尝试重新加载页面，或联系客服获得帮助。"
              extra={
                <Space wrap>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={this.handleReload}
                  >
                    重新加载页面
                  </Button>
                  <Button
                    type="default"
                    icon={<CustomerServiceOutlined />}
                    onClick={this.handleShowSupport}
                  >
                    联系客服
                  </Button>
                  <Button
                    type="default"
                    icon={<ExclamationCircleOutlined />}
                    onClick={this.handleShowErrorDetail}
                  >
                    查看详情
                  </Button>
                </Space>
              }
            />
          </div>

          {/* 错误详情 Modal */}
          <Modal
            title={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>🐛 错误详情报告</span>
                <Button
                  type="primary"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={this.copyAllErrorInfo}
                >
                  复制全部
                </Button>
              </div>
            }
            open={this.state.showErrorDetail}
            onCancel={this.handleCloseErrorDetail}
            footer={[
              <Button
                key="copy"
                icon={<CopyOutlined />}
                onClick={this.copyAllErrorInfo}
              >
                复制全部信息
              </Button>,
              <Button
                key="close"
                type="primary"
                onClick={this.handleCloseErrorDetail}
              >
                关闭
              </Button>,
            ]}
            width={900}
            style={{ top: 20 }}
          >
            <div style={{ maxHeight: '70vh', overflow: 'auto' }}>
              <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="large"
              >
                {/* 基本信息卡片 */}
                <Card size="small" title="📋 基本信息">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                    >
                      <Tag color="blue">
                        时间: {this.state.errorTimestamp?.toLocaleString()}
                      </Tag>
                      <Tag color="green">
                        浏览器: {this.getBrowserInfo().browser}
                      </Tag>
                      <Tag color="orange">
                        平台: {this.getBrowserInfo().platform}
                      </Tag>
                    </div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      页面: {window.location.href}
                    </Text>
                  </Space>
                </Card>

                {/* 错误信息折叠面板 */}
                <Collapse defaultActiveKey={['1']} size="small">
                  {this.state.error && (
                    <Panel
                      header={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>🚨 错误信息</span>
                          <Button
                            size="small"
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={e => {
                              e.stopPropagation();
                              this.copyToClipboard(
                                `${this.state.error?.name}: ${this.state.error?.message}`,
                                '错误信息',
                              );
                            }}
                          />
                        </div>
                      }
                      key="1"
                    >
                      <Card
                        size="small"
                        style={{
                          backgroundColor: '#fff2f0',
                          border: '1px solid #ffccc7',
                        }}
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <div>
                            <Tag color="red">{this.state.error.name}</Tag>
                            <Text strong style={{ color: '#ff4d4f' }}>
                              {this.state.error.message}
                            </Text>
                          </div>
                        </Space>
                      </Card>
                    </Panel>
                  )}

                  {this.state.error?.stack && (
                    <Panel
                      header={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>📚 错误堆栈</span>
                          <Button
                            size="small"
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={e => {
                              e.stopPropagation();
                              this.copyToClipboard(
                                this.state.error?.stack || '',
                                '错误堆栈',
                              );
                            }}
                          />
                        </div>
                      }
                      key="2"
                    >
                      <Paragraph
                        code
                        style={{
                          backgroundColor: '#f9f0ff',
                          padding: '12px',
                          border: '1px solid #d3adf7',
                          borderRadius: '6px',
                          whiteSpace: 'pre-wrap',
                          fontSize: '12px',
                          fontFamily:
                            'Monaco, Consolas, "Courier New", monospace',
                          maxHeight: '300px',
                          overflow: 'auto',
                        }}
                      >
                        {this.state.error.stack}
                      </Paragraph>
                    </Panel>
                  )}

                  {this.state.errorInfo?.componentStack && (
                    <Panel
                      header={
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>🧩 组件堆栈</span>
                          <Button
                            size="small"
                            type="text"
                            icon={<CopyOutlined />}
                            onClick={e => {
                              e.stopPropagation();
                              this.copyToClipboard(
                                this.state.errorInfo?.componentStack || '',
                                '组件堆栈',
                              );
                            }}
                          />
                        </div>
                      }
                      key="3"
                    >
                      <Paragraph
                        code
                        style={{
                          backgroundColor: '#e6f7ff',
                          padding: '12px',
                          border: '1px solid #91d5ff',
                          borderRadius: '6px',
                          whiteSpace: 'pre-wrap',
                          fontSize: '12px',
                          fontFamily:
                            'Monaco, Consolas, "Courier New", monospace',
                          maxHeight: '300px',
                          overflow: 'auto',
                        }}
                      >
                        {this.state.errorInfo.componentStack}
                      </Paragraph>
                    </Panel>
                  )}
                </Collapse>

                <Divider />

                {/* 操作提示 */}
                <Card
                  size="small"
                  style={{
                    backgroundColor: '#fffbe6',
                    border: '1px solid #ffe58f',
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Text
                        type="warning"
                        strong
                        style={{ marginRight: '8px' }}
                      >
                        💡 使用提示:
                      </Text>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      <li>
                        <Text type="secondary">
                          点击每个面板右上角的复制按钮可单独复制该部分内容
                        </Text>
                      </li>
                      <li>
                        <Text type="secondary">
                          点击"复制全部"按钮可复制完整的错误报告
                        </Text>
                      </li>
                      <li>
                        <Text type="secondary">
                          将错误信息发送给开发人员以便快速定位问题
                        </Text>
                      </li>
                      <li>
                        <Text type="secondary">
                          如需进一步帮助，请点击"联系客服"按钮
                        </Text>
                      </li>
                    </ul>
                  </Space>
                </Card>
              </Space>
            </div>
          </Modal>
        </>
      );
    }

    return this.props.children;
  }
}

// 直接导出自定义的 ErrorBoundary，不要使用 Sentry.withErrorBoundary
export default ErrorBoundary;
