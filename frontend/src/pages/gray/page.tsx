import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Switch,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Statistic,
  Tooltip,
  Drawer,
  List,
  Empty,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  TeamOutlined,
  ThunderboltOutlined,
  ReloadOutlined,
  EyeOutlined,
  CopyOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  useGrayStore,
  // MATCH_TYPE_OPTIONS,
  // type GrayRule,
  // type Whitelist,
  // type CreateRulePayload,
} from "@store/gray";
import type {
  GrayRule,
  Whitelist,
  CreateRulePayload,
} from "@store/gray/slices/admin/initialState";

import { MATCH_TYPE_OPTIONS, VALUE_TYPE_OPTIONS } from "./config";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function GrayPage() {
  const [
    rules,
    currentRule,
    whitelist,
    loadRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRule,
    setCurrentRule,
    loadWhitelist,
    batchAddWhitelist,
    deleteWhitelist,
    toggleWhitelist,
  ] = useGrayStore((state) => [
    state.rules,
    state.currentRule,
    state.whitelist,
    state.loadRules,
    state.createRule,
    state.updateRule,
    state.deleteRule,
    state.toggleRule,
    state.setCurrentRule,
    state.loadWhitelist,
    state.batchAddWhitelist,
    state.deleteWhitelist,
    state.toggleWhitelist,
  ]);

  console.log(rules);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<GrayRule | null>(null);
  const [form] = Form.useForm();

  // 白名单抽屉
  const [whitelistDrawerOpen, setWhitelistDrawerOpen] = useState(false);
  const [batchInput, setBatchInput] = useState("");

  // 初始化加载规则列表
  useEffect(() => {
    loadRules();
  }, [loadRules]);

  // 打开创建/编辑弹窗
  const openModal = (rule?: GrayRule) => {
    setEditingRule(rule || null);
    if (rule) {
      form.setFieldsValue({
        ...rule,
        match_values: rule.match_values?.join("\n") || "",
      });
    } else {
      form.resetFields();
    }
    setModalOpen(true);
  };

  // 保存规则
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload: CreateRulePayload = {
        ...values,
        match_values: values.match_values
          ? values.match_values
              .split("\n")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : [],
      };

      if (editingRule) {
        await updateRule(editingRule.id, payload);
        message.success("规则更新成功");
      } else {
        await createRule(payload);
        message.success("规则创建成功");
      }

      setModalOpen(false);
    } catch {
      message.error("保存失败");
    }
  };

  // 删除规则
  const handleDelete = async (id: number) => {
    try {
      await deleteRule(id);
      message.success("删除成功");
    } catch {
      message.error("删除失败");
    }
  };

  // 切换规则状态
  const handleToggle = async (id: number) => {
    try {
      await toggleRule(id);
    } catch {
      message.error("状态切换失败");
    }
  };

  // 打开白名单抽屉
  const openWhitelistDrawer = (rule: GrayRule) => {
    setCurrentRule(rule);
    loadWhitelist(rule.id);
    setWhitelistDrawerOpen(true);
  };

  // 批量添加白名单
  const handleBatchAdd = async () => {
    if (!currentRule || !batchInput.trim()) return;

    const values = batchInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (values.length === 0) return;

    try {
      const result = await batchAddWhitelist(currentRule.id, values, "user_id");
      message.success(
        `添加成功: ${result.added} 条, 跳过: ${result.skipped} 条`
      );
      setBatchInput("");
    } catch {
      message.error("批量添加失败");
    }
  };

  // 删除白名单条目
  const handleDeleteWhitelist = async (id: number) => {
    try {
      await deleteWhitelist(id);
      message.success("删除成功");
    } catch {
      message.error("删除失败");
    }
  };

  // 切换白名单状态
  const handleToggleWhitelist = async (id: number) => {
    try {
      await toggleWhitelist(id);
    } catch {
      message.error("状态切换失败");
    }
  };

  // 表格列定义
  const columns: ColumnsType<GrayRule> = [
    {
      title: "优先级",
      dataIndex: "priority",
      width: 80,
      render: (p: number) => (
        <Tag
          color={p >= 10 ? "red" : p >= 5 ? "orange" : "default"}
          style={{ fontWeight: 600 }}
        >
          {p}
        </Tag>
      ),
    },
    {
      title: "规则名称",
      dataIndex: "name",
      render: (name: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          {record.description && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.description}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: "匹配类型",
      dataIndex: "match_type",
      width: 120,
      render: (type: string) => {
        const opt = MATCH_TYPE_OPTIONS.find((o) => o.value === type);
        return <Tag color={opt?.color || "default"}>{opt?.label || type}</Tag>;
      },
    },
    {
      title: "目标版本",
      dataIndex: "target_version",
      width: 100,
      render: (v: string) => (
        <Tag color="green" icon={<ThunderboltOutlined />}>
          {v}
        </Tag>
      ),
    },
    {
      title: "白名单数量",
      key: "whitelist_count",
      width: 120,
      render: (_, record) => (
        <Button
          type="link"
          icon={<TeamOutlined />}
          onClick={() => openWhitelistDrawer(record)}
          style={{ padding: 0 }}
        >
          {record.match_values?.length || 0} 条
        </Button>
      ),
    },
    {
      title: "状态",
      dataIndex: "is_enabled",
      width: 80,
      render: (enabled: boolean, record) => (
        <Switch
          checked={enabled}
          onChange={() => handleToggle(record.id)}
          checkedChildren="启用"
          unCheckedChildren="禁用"
        />
      ),
    },
    {
      title: "更新时间",
      dataIndex: "updated_at",
      width: 160,
      render: (t: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {dayjs(t).format("YYYY-MM-DD HH:mm")}
        </Text>
      ),
    },
    {
      title: "操作",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="查看白名单">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => openWhitelistDrawer(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => openModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定删除此规则?"
            description="删除后将同时删除关联的白名单"
            onConfirm={() => handleDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="删除">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 统计数据
  const stats = {
    total: rules.length,
    enabled: rules.filter((r) => r.is_enabled).length,
    whitelist: rules.reduce((sum, r) => sum + (r.match_values?.length || 0), 0),
  };

  return (
    <div className="gray-page">
      {/* 统计卡片 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="规则总数"
              value={stats.total}
              prefix={<UserOutlined className="text-indigo-500" />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="已启用"
              value={stats.enabled}
              prefix={<CheckCircleOutlined className="text-green-500" />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="白名单条目"
              value={stats.whitelist}
              prefix={<TeamOutlined className="text-cyan-500" />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 规则表格 */}
      <Card
        title={
          <Space>
            <ThunderboltOutlined className="text-indigo-500" />
            <span>灰度规则</span>
          </Space>
        }
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={loadRules}>
              刷新
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => openModal()}
            >
              新建规则
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={rules}
          rowKey="id"
          // loading={rulesLoading}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: (
              <Empty
                description="暂无规则"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => openModal()}
                >
                  创建第一条规则
                </Button>
              </Empty>
            ),
          }}
        />
      </Card>

      {/* 创建/编辑弹窗 */}
      <Modal
        title={editingRule ? "编辑规则" : "新建规则"}
        open={modalOpen}
        onOk={handleSave}
        onCancel={() => setModalOpen(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            is_enabled: true,
            priority: 0,
            match_type: "whitelist",
            target_version: "gray",
          }}
        >
          <Form.Item
            name="name"
            label="规则名称"
            rules={[{ required: true, message: "请输入规则名称" }]}
          >
            <Input placeholder="例如: 内测用户灰度" />
          </Form.Item>

          <Form.Item name="description" label="规则描述">
            <Input placeholder="可选，描述规则用途" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="priority" label="优先级">
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: "100%" }}
                  placeholder="数字越大优先级越高"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="match_type" label="匹配类型">
                <Select options={[...MATCH_TYPE_OPTIONS]} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) => prev.match_type !== cur.match_type}
          >
            {({ getFieldValue }) =>
              ["header", "cookie"].includes(getFieldValue("match_type")) && (
                <Form.Item name="match_key" label="匹配键名">
                  <Input placeholder="例如: X-User-Type 或 cookie名" />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item
            name="match_values"
            label="白名单值（每行一个）"
            tooltip="可以填写用户ID、IP地址等，每行一个"
          >
            <TextArea
              rows={4}
              placeholder={`user123\nuser456\n192.168.1.100`}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="target_version" label="目标版本">
                <Input placeholder="例如: gray, canary, beta" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="target_upstream" label="目标上游地址">
                <Input placeholder="例如: http://gray.example.com" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="is_enabled" valuePropName="checked" label="启用状态">
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 白名单抽屉 */}
      <Drawer
        title={
          <Space>
            <TeamOutlined className="text-cyan-500" />
            <span>{currentRule?.name} - 白名单管理</span>
          </Space>
        }
        open={whitelistDrawerOpen}
        onClose={() => {
          setWhitelistDrawerOpen(false);
          setBatchInput("");
        }}
        width={500}
      >
        {/* 批量添加区域 */}
        <Card size="small" title="批量添加" style={{ marginBottom: 16 }}>
          <TextArea
            value={batchInput}
            onChange={(e) => setBatchInput(e.target.value)}
            rows={4}
            placeholder={`每行一个值，例如:\nuser001\nuser002\n192.168.1.1`}
            style={{ marginBottom: 12 }}
          />
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleBatchAdd}
              disabled={!batchInput.trim()}
            >
              批量添加
            </Button>
            <Button
              icon={<CopyOutlined />}
              onClick={() => {
                const values = whitelist.map((w) => w.value).join("\n");
                navigator.clipboard.writeText(values);
                message.success("已复制到剪贴板");
              }}
            >
              导出当前
            </Button>
          </Space>
        </Card>

        <Divider orientation="left">已有白名单 ({whitelist.length})</Divider>

        <List
          // loading={whitelistLoading}
          dataSource={whitelist}
          locale={{ emptyText: <Empty description="暂无白名单" /> }}
          renderItem={(item: Whitelist) => (
            <List.Item
              actions={[
                <Switch
                  key="toggle"
                  size="small"
                  checked={item.is_enabled}
                  onChange={() => handleToggleWhitelist(item.id)}
                />,
                <Popconfirm
                  key="delete"
                  title="确定删除?"
                  onConfirm={() => handleDeleteWhitelist(item.id)}
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <Text
                      code
                      style={{ color: item.is_enabled ? "#13c2c2" : "#999" }}
                    >
                      {item.value}
                    </Text>
                    <Tag color="default">{item.value_type}</Tag>
                  </Space>
                }
                description={
                  item.remark || (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {dayjs(item.created_at).format("YYYY-MM-DD HH:mm")}
                    </Text>
                  )
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
}
