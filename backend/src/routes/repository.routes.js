import { Router } from 'express';
import githubService from '../services/github.service.js';

const router = Router();

// 获取仓库信息
router.get('/info', async (req, res) => {
	try {
		const { owner, repo } = req.query;

		if (!owner || !repo) {
			return res.status(400).json({
				success: false,
				data: null,
				message: '参数缺失',
			});
		}

		const info = await githubService.getRepositoryInfo(owner, repo);

		res.json({
			code: 200,
			success: true,
			data: info,
			message: '操作成功',
		});
	} catch (error) {
		console.error('获取仓库信息失败:', error);
		res.status(500).json({
			success: false,
			data: null,
			message: error.message || '获取仓库信息失败',
		});
	}
});

// 获取仓库文件列表
router.get('/files', async (req, res) => {
	try {
		const { owner, repo, branch = 'main' } = req.query;

		if (!owner || !repo) {
			return res.status(400).json({
				success: false,
				data: null,
				message: '参数缺失',
			});
		}

		const files = await githubService.getRepositoryFiles(owner, repo, branch);

		const stats = files.reduce((acc, file) => {
			acc[file.type] = (acc[file.type] || 0) + 1;
			return acc;
		}, {});

		res.json({
			code: 200,
			success: true,
			data: {
				total: files.length,
				stats,
				files: files.slice(0, 50), // 仅返回前 50 个文件
			},
			message: '操作成功',
		});
	} catch (error) {
		console.error('获取仓库文件列表失败:', error);
		res.status(500).json({
			success: false,
			data: null,
			message: error.message || '获取仓库文件列表失败',
		});
	}
});

// 获取单个文件内容
router.get('/file', async (req, res) => {
	try {
		const { owner, repo, filepath, branch = 'main' } = req.query;

		if (!owner || !repo || !filepath) {
			return res.status(400).json({
				success: false,
				data: null,
				message: '参数缺失',
			});
		}

		const content = await githubService.getFileContent(
			owner,
			repo,
			filepath,
			branch
		);

		res.json({
			code: 200,
			success: true,
			data: {
				filepath,
				content,
				language: githubService.getFileType(filepath),
				size: content ? content.length : 0,
			},
			message: '操作成功',
		});
	} catch (error) {
		console.error('获取文件内容失败:', error);
		res.status(500).json({
			success: false,
			data: null,
			message: error.message || '获取文件内容失败',
		});
	}
});

export default router;
