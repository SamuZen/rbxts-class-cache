import { Cachable } from "./cachable";

export class ClassCache<T extends Cachable> {
	Open: T[];
	InUse: T[];
	Template: T;
	CacheParent: Instance;
	ExpansionSize: number;

	constructor(template: T, cacheParent: Instance, initialSize = 5) {
		this.Open = [];
		this.InUse = [];
		this.Template = template;
		this.CacheParent = cacheParent;
		this.ExpansionSize = 10;

		for (let i = 0; i < initialSize; i++) {
			this.Open.push(this.create());
		}
		this.Template.setParent(undefined);
	}

	public get(): T {
		let obj = this.Open.pop();

		if (obj === undefined) {
			for (let i = 0; i < this.ExpansionSize; i++) {
				this.Open.push(this.create());
			}
			obj = this.Open.pop() as T;
		}

		obj.gotten();

		this.InUse.push(obj);
		return obj;
	}

	public create(): T {
		const newCachable = this.Template.create();
		newCachable.setCache(this);
		newCachable.created();
		newCachable.hide();
		newCachable.setParent(this.CacheParent);
		return newCachable as T;
	}

	public return(obj: T): void {
		const index = this.InUse.indexOf(obj);
		if (index !== -1) {
			this.InUse.remove(index);
			this.Open.push(obj);

			obj.returned();
			obj.hide();
		} else {
			warn("CustomCache: Tried to return an object that wasn't in use");
		}
	}

	public setCacheParent(parent: Instance): void {
		this.CacheParent = parent;
		this.Open.forEach((obj) => {
			obj.setParent(parent);
		});
		this.InUse.forEach((obj) => {
			obj.setParent(parent);
		});
	}

	public expand(amount: number): void {
		for (let i = 0; i < amount; i++) {
			this.Open.push(this.create());
		}
	}

	public clear(): void {
		this.Open.forEach((obj) => {
			obj.clear();
		});
		this.InUse.forEach((obj) => {
			obj.clear();
		});
		this.Template.clear();
		this.Open = [];
		this.InUse = [];
	}
}
