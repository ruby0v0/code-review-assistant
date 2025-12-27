import { Router } from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import githubService from '../services/github.service.js';

const router = Router();

const llm = new ChatOpenAI({
	model: 'gpt-4.1',
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.1,
});

// const codeReviewTemplate = `
// 请审查以下{language}代码：

// 文件: {filename}
// 代码:
// \`\`\`{language}
// {code}
// \`\`\`

// 请从以下方面分析：
// 1. 代码质量（1-10分）
// 2. 发现的潜在问题
// 3. 具体改进建议
// 4. 安全性和性能考虑

// 请用中文回复，格式清晰。
// `

const codeReviewTemplate = `
请对以下代码进行详细的审查，请从以下几个方面进行分析：

**文件信息：**
- 文件名：{filename}
- 文件路径：{filepath}

**代码内容：**
{code}

**审查要求：**
1. **代码质量**：代码结构、可读性、可维护性
2. **最佳实践**：是否符合行业最佳实践
3. **潜在问题**：bug、安全漏洞、性能问题
4. **改进建议**：具体的改进代码示例
5. **复杂度分析**：时间/空间复杂度

请以以下格式返回：
## 代码审查报告

### 1. 代码质量评分（1-10分）
分数：[由AI生成]
理由：[由AI生成]

### 2. 发现的问题
- 问题1：[类型] 描述
- 问题2：[类型] 描述

### 3. 具体建议
- 建议1：[文件名:行号] 具体建议
- 建议2：[文件名:行号] 具体建议

### 4. 改进示例
\`\`\`{language}
// 改进后的代码
\`\`\`
`;

const prompt = PromptTemplate.fromTemplate(codeReviewTemplate);

// 审查链
const reviewChain = RunnableSequence.from([
	prompt,
	llm,
	new StringOutputParser(),
]);

router.get('/', (req, res) => {
	res.send('Hello World!');
});

router.post('/single', async (req, res) => {
	try {
		const { owner, repo, filepath, branch = 'main', code } = req.body;

		let fileContent = code;

		if (!code && owner && repo && filepath) {
			fileContent = await githubService.getFileContent(
				owner,
				repo,
				filepath,
				branch
			);
		}

		if (!fileContent) {
			return res
				.status(400)
				.json({ success: false, error: '无法获取代码内容' });
		}

		const reviewResult = await reviewChain.invoke({
			filename: filepath.split('/').pop(),
			filepath,
			code: fileContent,
			language: githubService.getFileType(filepath),
		});

		res.json({
			success: true,
			data: {
				filepath,
				content: fileContent,
				review: reviewResult,
				timestamp: new Date().toISOString(),
			},
		});
	} catch (reason) {
		console.error('代码审查失败：', reason);
		res.status(500).json({ error: '代码审查失败', details: reason.message });
	}
});

export default router;
