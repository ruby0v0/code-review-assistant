import { Router } from 'express';
// import { ChatOpenAI } from '@langchain/openai';
import { ChatDeepSeek } from '@langchain/deepseek';
import { PromptTemplate } from '@langchain/core/prompts';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import githubService from '../services/github.service.js';

const router = Router();

// const llm = new ChatOpenAI({
// 	model: 'gpt-4.1',
// 	apiKey: process.env.OPENAI_API_KEY,
// 	temperature: 0.1,
// });

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

const llm = new ChatDeepSeek({
	apiKey: process.env.DEEPSEEK_API_KEY,
	// model: 'deepseek-reasoner',
	model: 'deepseek-chat',
	temperature: 0.1,
	streaming: true,
});

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

// 单文件审查
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
			return res.status(400).json({
				success: false,
				data: null,
				message: '无法获取代码内容',
			});
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
			message: '操作成功',
		});
	} catch (error) {
		console.error('代码审查失败：', error);
		res.status(500).json({
			success: false,
			data: null,
			message: error.message || '代码审查失败',
		});
	}
});

// 批量文件审查
router.post('/batch', async (req, res) => {
	try {
		const { owner, repo, filepaths, branch = 'main' } = req.body;

		if (!owner || !repo) {
			return res.status(400).json({
				success: false,
				data: null,
				message: '参数缺失',
			});
		}

		const reviews = [];

		if (filepaths && Array.isArray(filepaths)) {
			for (const filepath of filepaths) {
				try {
					const fileContent = await githubService.getFileContent(
						owner,
						repo,
						filepath,
						branch
					);

					const review = await reviewChain.invoke({
						filename: filepath.split('/').pop(),
						filepath,
						code: fileContent,
						language: githubService.getFileType(filepath),
					});

					reviews.push({
						filepath,
						review,
					});
				} catch (error) {
					reviews.push({
						filepath,
						error: error.message || '获取文件内容失败',
					});
				}
			}
		} else {
			const files = await githubService.getRepositoryFiles(owner, repo, branch);
			const topFiles = files.slice(0, 5);

			for (const file of topFiles) {
				try {
					const content = await githubService.getFileContent(
						owner,
						repo,
						file.path,
						branch
					);

					const review = await reviewChain.invoke({
						filename: file.path.split('/').pop(),
						filepath: file.path,
						code: content,
						language: githubService.getFileType(file.path),
					});

					reviews.push({
						filepath: file.path,
						review,
					});
				} catch (error) {
					reviews.push({
						filepath: file.path,
						error: error.message,
					});
				}
			}
		}

		res.json({
			success: true,
			data: {
				repository: `${owner}/${repo}`,
				total: reviews.length,
				reviews,
				timestamp: new Date().toISOString(),
			},
			message: '操作成功',
		});
	} catch (error) {
		console.error('批量审查失败：', error);
		res.status(500).json({
			success: false,
			data: null,
			message: error.message || '批量审查失败',
		});
	}
});

export default router;
