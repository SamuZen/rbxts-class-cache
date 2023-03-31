import { IClassCachable } from "./cachable";

export class ClassCache {
	Open: IClassCachable[];
	InUse: IClassCachable[];
	Template: IClassCachable;
	CacheParent: Instance;
	ExpansionSize: number;

	constructor(template: IClassCachable, cacheParent: Instance, initialSize = 5) {
		this.Open = [];
		this.InUse = [];
		this.Template = template;
		this.CacheParent = cacheParent;
		this.ExpansionSize = 10;

		for (let i = 0; i < initialSize; i++) {
			this.Open.push(this.MakeNew());
		}
		this.Template.CacheSetParent(undefined);
	}

	public Get(): IClassCachable {
		let obj = this.Open.pop();

		if (obj === undefined) {
			warn("CustomCache: Open is empty, expanding by " + this.ExpansionSize + " objects");
			for (let i = 0; i < this.ExpansionSize; i++) {
				this.Open.push(this.MakeNew());
			}
			obj = this.Open.pop() as IClassCachable;
		}

		this.InUse.push(obj);
		return obj;
	}

	public MakeNew(): IClassCachable {
		const newCachable = this.Template.CacheMakeNew();
		newCachable.CacheSetCache(this);
		newCachable.CacheCreated();
		newCachable.CacheSetParent(this.CacheParent);
		return newCachable;
	}

	public Return(obj: IClassCachable): void {
		const index = this.InUse.indexOf(obj);
		if (index !== -1) {
			this.InUse.remove(index);
			this.Open.push(obj);

			obj.CacheReturned();
		} else {
			warn("CustomCache: Tried to return an object that wasn't in use");
		}
	}

	public SetCacheParent(parent: Instance): void {
		this.CacheParent = parent;
		this.Open.forEach((obj) => {
			obj.CacheSetParent(parent);
		});
		this.InUse.forEach((obj) => {
			obj.CacheSetParent(parent);
		});
	}

	public Expand(amount: number): void {
		for (let i = 0; i < amount; i++) {
			this.Open.push(this.MakeNew());
		}
	}

	public Clear(): void {
		this.Open.forEach((obj) => {
			obj.CacheClear();
		});
		this.InUse.forEach((obj) => {
			obj.CacheClear();
		});
		this.Template.CacheClear();
		this.Open = [];
		this.InUse = [];
	}
}
