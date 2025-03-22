export interface FileInfo {
	name: string;
	path: string;
	type: string;
	download_url?: string;
}

export interface Dependency {
	name: string;
	version: string;
	description: string;
}

export interface RepoAnalysis {
	summary: string;
	dependencies: Dependency[];
}
