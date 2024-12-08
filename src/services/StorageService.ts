export class StorageService{
    static async set<T>(key: string, value: T): Promise<void> {
        return chrome.storage.local.set({ [key]: value });
    }

    static async get<T>(key: string): Promise<T | undefined> {
        const result = await chrome.storage.local.get([key]);
        return result[key];
    }

    static async remove(key: string): Promise<void> {
        return chrome.storage.local.remove(key);
    }

    static async clear(): Promise<void> {
        return chrome.storage.local.clear();
    }

    static async getAll(): Promise<{ [key: string]: any }> {
        return chrome.storage.local.get(null);
    }
}