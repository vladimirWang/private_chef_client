// 待分页结构的泛型接口
export interface IPaginationResp<T> {
	total: number;
	list: T[];
}

export interface IResponse<T> {
	data: T;
	code: number;
	message?: string;
}

export function isIResponse(value: unknown): value is IResponse<unknown> {
	return (
		typeof value === "object" &&
		value !== null &&
		"code" in value &&
		"message" in value &&
		"data" in value
	);
}