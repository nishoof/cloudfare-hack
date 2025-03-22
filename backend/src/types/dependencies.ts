export interface DependencyDocumentation {
	title: string;
	url: string;
	explanation: string;
}

export interface Dependency {
	"Package name": string;
	"Package version": string;
	"Functionality/APIs": string;
	"which part of the repo it is used in": string;
	documentation?: DependencyDocumentation[];
}

export interface DependencyInput {
	dependencies: Dependency[];
}
