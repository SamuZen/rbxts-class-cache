import { IClassCache } from "./class-cache-types";

export abstract class IClassCachable {
	cache: IClassCache | undefined;
	CF_FAR_AWAY: CFrame = new CFrame(0, 10e8, 0);

	abstract CacheCreated(): void;
	abstract CacheSetParent(parent: Instance | undefined): void;
	abstract CacheMakeNew(): IClassCachable;
	abstract CacheReturned(): void;
	abstract CacheClear(): void;
	CacheSetCache(cache: IClassCache): void {
		this.cache = cache;
	}
}
