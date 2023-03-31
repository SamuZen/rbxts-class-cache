import { IClassCachable } from "./cachable";

export interface IClassCache {
	MakeNew(): IClassCachable;
	Get(): IClassCachable;
	Return(obj: IClassCachable): void;
	SetCacheParent(parent: Instance): void;
	Expand(amount: number): void;
	Clear(): void;
}
