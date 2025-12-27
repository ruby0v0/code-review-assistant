import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

let octokitIns = null;

/**
 * 获取Octokit实例，用于与GitHub API进行交互
 * 该函数实现单例模式，确保只创建一个Octokit实例
 *
 * @returns {Octokit} 返回Octokit实例，用于GitHub API操作
 */
function getOctokit() {
	if (!octokitIns) {
		octokitIns = new Octokit({
			auth: process.env.GITHUB_TOKEN,
			userAgent: 'CodeReviewAssistant v1.0',
			timeZone: 'Asia/Shanghai',
			request: {
				timeout: 1_0000,
			},
		});
	}
	return octokitIns;
}

export { getOctokit };
