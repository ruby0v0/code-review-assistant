import { Router } from 'express';
import githubService from '../services/github.service.js';

const router = Router();

router.get('/info', async (req, res) => {
	try {
		const { owner, repo } = await req.body;

		if (!owner || !repo) {
			return res.status(400).json({
				success: false,
				error: '缺少必要参数: owner 或 repo',
			});
		}

		const info = await githubService.getRepositoryInfo(owner, repo);

		res.json({
			success: true,
			data: info,
		});
	} catch (error) {
		console.error('获取仓库信息失败:', error);
		return res.status(500).json({
			success: false,
			error: error.message || '获取仓库信息失败',
		});
	}
});

export default router;
