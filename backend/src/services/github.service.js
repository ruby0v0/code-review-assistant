import { getOctokit } from '../config/github.js';

class GithubService {
	constructor() {
		this.octokit = getOctokit();
	}

	/**
	 * 获取单个文件内容
	 */
	async getFileContent(owner, repo, filepath, ref = 'main') {
		try {
			const { data } = await this.octokit.rest.repos.getContent({
				owner,
				repo,
				path: filepath,
				ref,
			});

			if (data.content) {
				return Buffer.from(data.content, 'base64').toString('utf-8');
			}

			return '';
		} catch (error) {
			console.error(
				`获取文件失败: ${owner}/${repo}/${filepath}`,
				error.message
			);
			throw new Error(`无法获取文件: ${error.message}`);
		}
	}

	/**
	 * 获取仓库文件列表
	 */
	async getRepositoryFiles(owner, repo, ref = 'main') {
		try {
			const { data } = await this.octokit.rest.git.getTree({
				owner,
				repo,
				tree_sha: ref,
				recursive: 'true',
			});

			return data.tree
				.filter((item) => item.type === 'blob')
				.filter((item) => /\.(js|jsx|ts|tsx|html|css|json)$/.test(item.path))
				.map(({ path, sha, size }) => ({
					path,
					sha,
					size,
					type: this.getFileType(path),
				}));
		} catch (error) {
			console.error(`获取仓库文件列表失败: ${owner}/${repo}`, error.message);
			throw new Error(`无法获取仓库文件列表: ${error.message}`);
		}
	}

	/**
	 * 获取仓库信息
	 */
	async getRepositoryInfo(owner, repo) {
		try {
			const { data } = await this.octokit.rest.repos.get({
				owner,
				repo,
			});

			return {
				name: data.name,
				fullName: data.full_name,
				description: data.description,
				language: data.language,
				stars: data.stargazers_count,
				forks: data.forks_count,
				defaultBranch: data.default_branch,
				updateAt: data.updated_at,
			};
		} catch (error) {
			console.error(`获取仓库信息失败: ${owner}/${repo}`, error.message);
			throw new Error(`无法获取仓库信息: ${error.message}`);
		}
	}

	/**
	 * 根据文件路径获取文件类型
	 *
	 * @param {string} filepath - 文件路径
	 * @returns {string} 返回文件类型，如果类型未在映射中定义则默认返回'javascript'
	 */
	getFileType(filepath) {
		const extension = filepath.split('.').pop().toLowerCase();
		const typeMap = {
			js: 'javascript',
			jsx: 'javascript',
			ts: 'typescript',
			tsx: 'typescript',
			html: 'html',
			css: 'css',
			json: 'json',
		};
		return typeMap[extension] || 'javascript';
	}
}

export default new GithubService();
