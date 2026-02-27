# Promptfoo Assertions 完整指标指南

本文档整理了promptfoo项目中支持的所有assertion（断言）指标类型，特别关注agent调用过程的评估指标。

---

## 目录

1. [基础断言类型（68种）](#基础断言类型)
2. [Agent调用过程专属指标](#agent调用过程专属指标)
3. [特殊断言类型](#特殊断言类型)
4. [使用说明](#使用说明)

---

## 基础断言类型

### 1. 内容匹配类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `contains` | 包含特定文本 | src/assertions/contains.ts |
| `contains-all` | 包含所有指定文本 | src/assertions/contains.ts |
| `contains-any` | 包含任意指定文本 | src/assertions/contains.ts |
| `icontains` | 不区分大小写包含 | src/assertions/contains.ts |
| `icontains-all` | 不区分大小写包含所有 | src/assertions/contains.ts |
| `icontains-any` | 不区分大小写包含任意 | src/assertions/contains.ts |
| `equals` | 完全相等 | src/assertions/equals.ts |
| `starts-with` | 以指定文本开头 | src/assertions/startsWith.ts |
| `regex` | 正则表达式匹配 | src/assertions/regex.ts |

### 2. 格式验证类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `is-json` | JSON格式验证 | src/assertions/json.ts |
| `contains-json` | 包含JSON内容 | src/assertions/json.ts |
| `is-html` | HTML格式验证 | src/assertions/html.ts |
| `contains-html` | 包含HTML内容 | src/assertions/html.ts |
| `is-xml` | XML格式验证 | src/assertions/xml.ts |
| `contains-xml` | 包含XML内容 | src/assertions/xml.ts |
| `is-sql` | SQL格式验证 | src/assertions/sql.ts |
| `contains-sql` | 包含SQL内容 | src/assertions/sql.ts |

### 3. 相似度评估类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `similar` | 语义相似度（默认方法） | src/assertions/similar.ts |
| `similar:cosine` | 余弦相似度 | src/assertions/similar.ts |
| `similar:dot` | 点积相似度 | src/assertions/similar.ts |
| `similar:euclidean` | 欧几里得距离 | src/assertions/similar.ts |
| `levenshtein` | 编辑距离 | src/assertions/levenshtein.ts |

### 4. LLM评分类（模型驱动）

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `llm-rubric` | 自定义LLM评分标准 | src/assertions/llmRubric.ts |
| `model-graded-closedqa` | 封闭式问答评分 | src/assertions/modelGradedClosedQa.ts |
| `model-graded-factuality` | 事实性评分 | src/assertions/factuality.ts |
| `factuality` | 事实性检查 | src/assertions/factuality.ts |
| `answer-relevance` | 答案相关性 | src/assertions/answerRelevance.ts |
| `context-relevance` | 上下文相关性 | src/assertions/contextRelevance.ts |
| `context-faithfulness` | 上下文忠实度 | src/assertions/contextFaithfulness.ts |
| `context-recall` | 上下文召回率 | src/assertions/contextRecall.ts |
| `conversation-relevance` | 对话相关性 | src/external/assertions/deepeval |
| `search-rubric` | 搜索评分标准 | src/assertions/searchRubric.ts |
| `g-eval` | G-Eval评估方法 | src/assertions/geval.ts |

**说明**：这些指标使用LLM进行评分，定义在 `MODEL_GRADED_ASSERTION_TYPES` 集合中（src/assertions/index.ts:104）

### 5. NLP评估指标类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `bleu` | BLEU机器翻译评分 | src/assertions/bleu.ts |
| `gleu` | GLEU评分 | src/assertions/gleu.ts |
| `rouge-n` | ROUGE评分 | src/assertions/rouge.ts |
| `meteor` | METEOR评分（需要natural包） | src/assertions/meteor.ts |
| `perplexity` | 困惑度 | src/assertions/perplexity.ts |
| `perplexity-score` | 困惑度分数 | src/assertions/perplexity.ts |

### 6. 性能指标类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `latency` | 响应延迟 | src/assertions/latency.ts |
| `cost` | API调用成本 | src/assertions/cost.ts |
| `trace-span-duration` | 追踪跨度持续时间 ⭐ | src/assertions/traceSpanDuration.ts |
| `trace-span-count` | 追踪跨度数量 ⭐ | src/assertions/traceSpanCount.ts |
| `trace-error-spans` | 错误跨度检查 ⭐ | src/assertions/traceErrorSpans.ts |

⭐ 标记的指标特别适用于Agent调用过程评估

### 7. 工具调用验证类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `is-valid-function-call` | 函数调用有效性 | src/assertions/functionToolCall.ts |
| `is-valid-openai-function-call` | OpenAI函数调用验证 | src/assertions/functionToolCall.ts |
| `is-valid-openai-tools-call` | OpenAI工具调用验证 | src/assertions/openai.ts |
| `tool-call-f1` | 工具调用F1分数 ⭐ | src/assertions/toolCallF1.ts |

⭐ 标记的指标特别适用于Agent调用过程评估

### 8. 文本特征类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `word-count` | 字数统计 | src/assertions/wordCount.ts |
| `finish-reason` | 完成原因检查 | src/assertions/finishReason.ts |
| `is-refusal` | 拒绝回复检测 | src/assertions/refusal.ts |

### 9. 安全与合规类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `moderation` | 内容审核 | src/assertions/moderation.ts |
| `guardrails` | 安全护栏 | src/assertions/guardrails.ts |
| `promptfoo:redteam:*` | 红队测试系列 | src/assertions/redteam.ts |

### 10. 自定义脚本类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `javascript` | JavaScript自定义评估 | src/assertions/javascript.ts |
| `python` | Python自定义评估 | src/assertions/python.ts |
| `ruby` | Ruby自定义评估 | src/assertions/ruby.ts |
| `webhook` | 通过Webhook评估 | src/assertions/webhook.ts |

### 11. 高级评估类

| 指标类型 | 说明 | 位置 |
|---------|------|------|
| `classifier` | 分类器评估 | src/assertions/classifier.ts |
| `pi` | PI评分器 | src/assertions/pi.ts |

---

## Agent调用过程专属指标

promptfoo提供了基于OpenTelemetry的trace系统，专门用于追踪和评估agent调用过程。

### 核心指标详解

#### 1. `trace-span-duration` - Span持续时间监控

**用途**：监控agent调用链中特定操作的执行时间

**配置示例**：
```yaml
assert:
  - type: trace-span-duration
    value:
      pattern: "llm.*"     # 匹配span名称模式，支持通配符
      max: 1000            # 最大允许持续时间（毫秒）
      percentile: 95       # 可选：检查第95百分位数而非所有span
```

**功能特性**：
- ✅ 支持glob模式匹配过滤特定span
- ✅ 可以检查所有span或特定百分位数（如P95、P99）
- ✅ 自动识别最慢的span并报告Top 3
- ✅ 适用于识别性能瓶颈

**实现位置**：`src/assertions/traceSpanDuration.ts`

---

#### 2. `trace-span-count` - Span数量统计

**用途**：验证agent调用链中特定操作的调用次数

**配置示例**：
```yaml
assert:
  - type: trace-span-count
    value:
      pattern: "tool.*"    # 匹配工具调用
      min: 1               # 最少调用次数
      max: 5               # 最多调用次数
```

**功能特性**：
- ✅ 验证agent是否正确调用了预期数量的工具
- ✅ 检测过度调用（资源浪费）
- ✅ 检测调用不足（功能缺失）
- ✅ 支持模式匹配，可统计特定类型的操作
- ✅ 自动列出匹配的span名称用于调试

**实现位置**：`src/assertions/traceSpanCount.ts`

---

#### 3. `trace-error-spans` - 错误Span检测

**用途**：检测agent调用链中的错误和异常

**配置示例**：
```yaml
assert:
  - type: trace-error-spans
    value:
      max_count: 0           # 最大允许错误数
      max_percentage: 5.0    # 或最大错误百分比（二选一）
      pattern: "*"           # 匹配模式，默认所有span
```

**错误检测机制**：
自动检测以下类型的错误：

1. **HTTP状态码**：statusCode ≥ 400
2. **错误属性**：attributes中包含
   - `error: true`
   - `exception: true`
   - `failed: true`
   - `failure: true`
3. **HTTP属性**：`http.status_code >= 400`
4. **OpenTelemetry标准**：
   - `otel.status_code = 'ERROR'`
   - `status.code = 'ERROR'`
5. **状态消息**：statusMessage包含关键词
   - error、failed、failure、exception、timeout、abort

**实现位置**：`src/assertions/traceErrorSpans.ts`

---

#### 4. `tool-call-f1` - 工具调用F1分数

**用途**：评估agent是否正确调用了预期的工具集合

**配置示例**：
```yaml
assert:
  - type: tool-call-f1
    value: ["get_weather", "send_email", "search_db"]
    threshold: 0.8  # F1分数阈值，默认1.0
```

**评分算法**：
基于信息检索经典的F1 Score（van Rijsbergen, 1979）：

- **Precision（精确率）** = |actual ∩ expected| / |actual|
  - "调用的工具中，有多少是正确的？"

- **Recall（召回率）** = |actual ∩ expected| / |expected|
  - "期望的工具中，有多少被调用了？"

- **F1 Score** = 2 × (precision × recall) / (precision + recall)

**支持的格式**：
```typescript
// OpenAI格式
{ tool_calls: [{ function: { name: "get_weather" } }] }

// Anthropic格式
{ type: 'tool_use', name: 'get_weather' }
[{ type: 'tool_use', name: 'get_weather' }]

// Google/Vertex格式
{ functionCall: { name: 'get_weather' } }
{ toolCall: { functionCalls: [{ name: 'get_weather' }] } }

// 简单格式
[{ name: 'get_weather' }]

// 字符串混合格式（支持JSON嵌入）
"Let me check the weather.\n\n{\"type\":\"tool_use\",\"name\":\"get_weather\"}"
```

**实现位置**：`src/assertions/toolCallF1.ts`

---

### Trace数据结构

所有trace相关的指标都依赖于OpenTelemetry的trace数据结构：

```typescript
interface TraceSpan {
  spanId: string;                    // Span唯一标识
  parentSpanId?: string;             // 父Span ID（用于构建调用树）
  name: string;                      // Span名称（用于模式匹配）
  startTime: number;                 // 开始时间戳
  endTime?: number;                  // 结束时间戳
  statusCode?: number;               // HTTP状态码
  statusMessage?: string;            // 状态消息
  attributes?: Record<string, any>;  // 自定义属性
}

interface TraceData {
  traceId: string;                   // Trace唯一标识
  evaluationId: string;              // 评估ID
  testCaseId: string;                // 测试用例ID
  metadata?: Record<string, any>;    // 元数据
  spans: TraceSpan[];                // 所有span的列表
}
```

**访问方式**：
在assertion的context中通过 `assertionValueContext.trace` 访问

---

### Agent评估场景

这些指标特别适合以下agent评估场景：

| 评估维度 | 推荐指标 | 示例场景 |
|---------|---------|---------|
| **效率评估** | `trace-span-duration` | 监控LLM调用、工具调用、数据库查询的耗时 |
| **可靠性评估** | `trace-error-spans` | 检测调用链中的HTTP错误、超时、异常 |
| **行为正确性** | `tool-call-f1` | 验证agent是否调用了正确的工具组合 |
| **资源使用** | `trace-span-count` | 防止agent过度调用API或工具 |
| **端到端性能** | `latency` + `cost` | 监控整体响应时间和费用 |
| **工具使用准确性** | `is-valid-function-call` | 验证工具调用参数是否符合schema |

---

### 完整示例

```yaml
# promptfooconfig.yaml
prompts:
  - "You are a travel planning assistant. Help plan a weekend trip to {{destination}}."

providers:
  - openai:gpt-4

tests:
  - vars:
      destination: "Paris"
    assert:
      # 检查工具调用正确性
      - type: tool-call-f1
        value: ["search_flights", "search_hotels", "get_weather"]
        threshold: 0.8

      # 检查整体延迟
      - type: latency
        threshold: 5000  # 5秒内完成

      # 检查LLM调用耗时
      - type: trace-span-duration
        value:
          pattern: "llm.*"
          max: 3000
          percentile: 95

      # 检查工具调用次数
      - type: trace-span-count
        value:
          pattern: "tool.*"
          min: 2
          max: 10

      # 确保无错误
      - type: trace-error-spans
        value:
          max_count: 0

      # 检查答案质量
      - type: llm-rubric
        value: "Response includes flight, hotel, and weather information"
```

---

## 特殊断言类型

| 类型 | 说明 | 位置 |
|-----|------|------|
| `select-best` | 选择最佳输出（比较所有变体） | src/types/index.ts:579 |
| `human` | 人工评分（通过Web UI） | src/types/index.ts:579 |
| `max-score` | 选择最高分输出 | src/types/index.ts:579 |
| `assert-set` | 断言集合（组合多个断言） | src/types/index.ts:596 |

---

## 使用说明

### 1. 反向断言

所有基础断言类型都支持 `not-` 前缀，用于反向验证：

```yaml
assert:
  - type: not-contains
    value: "error"

  - type: not-equals
    value: "I don't know"

  - type: not-is-json
```

**实现**：通过 `isAssertionInverse()` 函数检测（src/assertions/index.ts:236）

### 2. 权重系统

每个断言可以设置权重，影响最终评分：

```yaml
assert:
  - type: contains
    value: "hello"
    weight: 2  # 权重为2，默认为1

  - type: latency
    threshold: 1000
    weight: 1
```

### 3. 阈值控制

支持threshold阈值设置：

```yaml
assert:
  - type: similar
    value: "expected output"
    threshold: 0.8  # 相似度至少0.8

  - type: latency
    threshold: 2000  # 最多2秒
```

### 4. 指标标记

可以通过metric字段标记为命名指标：

```yaml
assert:
  - type: latency
    metric: "response_time"  # 标记为response_time指标

  - type: cost
    metric: "api_cost_usd"
```

### 5. 模板渲染

支持Nunjucks模板语法：

```yaml
tests:
  - vars:
      expected_name: "John"
    assert:
      - type: contains
        value: "Hello {{expected_name}}"  # 渲染为 "Hello John"
```

### 6. 脚本扩展

支持file://引用外部脚本：

```yaml
assert:
  - type: javascript
    value: file://./custom-validator.js:validateResponse

  - type: python
    value: file://./checker.py:check_output
```

### 7. 并发控制

断言最大并发数为3（可通过环境变量配置）：

```bash
export PROMPTFOO_ASSERTIONS_MAX_CONCURRENCY=5
```

**配置位置**：src/assertions/index.ts:102

---

## 参考资料

- **主入口文件**：`src/assertions/index.ts`
- **类型定义**：`src/types/index.ts` (BaseAssertionTypesSchema: 508-568行)
- **断言处理器映射**：`ASSERTION_HANDLERS` 对象（src/assertions/index.ts:116）
- **模型评分断言集合**：`MODEL_GRADED_ASSERTION_TYPES`（src/assertions/index.ts:104）
- **Trace类型定义**：`src/types/tracing.ts`

---

## 版本信息

本文档基于promptfoo项目代码分析生成，涵盖所有68种基础断言类型及其变体。

**关键统计**：
- 基础断言类型：68种
- 特殊断言类型：4种（select-best、human、max-score、assert-set）
- Agent专属指标：4种（trace-span-*, tool-call-f1）
- 支持反向断言：所有基础类型 + not-前缀
- 总断言文件数：51个TypeScript文件（src/assertions/目录）

---

生成时间：2026-02-27