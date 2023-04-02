import { ClassCache } from "./classCache";

export abstract class Cachable {
	cache: ClassCache<Cachable> | undefined;
	defaultCFrame: CFrame = new CFrame(0, 10e8, 0);

	abstract hide(): void;
	abstract setParent(parent: Instance | undefined): void;
	abstract create(): Cachable;

	created(): void {}
	returned(): void {}
	clear(): void {}
	gotten(): void {}
	setCache(cache: ClassCache<Cachable>): void {
		this.cache = cache;
	}
}
