import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public addItem<T>(key: string, item: T) {
    let storageItems = [];
    const storageString = sessionStorage.getItem(key);
    if (storageString) {
      storageItems = JSON.parse(storageString);
      storageItems.push(item);
      sessionStorage.setItem(key, JSON.stringify(storageItems));
    } else {
      storageItems.push(item);
      sessionStorage.setItem(key, JSON.stringify(storageItems));
    }
  }
  public editItem<T extends { id?: number; object?: string }>(key: string, item: T) {
    let storageItems = [];
    const storageString = sessionStorage.getItem(key);
    if (storageString) {
      storageItems = JSON.parse(storageString);
      const index = storageItems.findIndex(
        (val: T) => val.id === item.id || val.object === item.object,
      );
      if (index) storageItems[index] = item;
      sessionStorage.setItem(key, JSON.stringify(storageItems));
    }
  }
  public removeItem<T extends { id?: number; object?: string }>(key: string, id: number | string) {
    let storageItems = [];
    const storageString = sessionStorage.getItem(key);
    if (storageString) {
      storageItems = JSON.parse(storageString);
      const index = storageItems.findIndex((val: T) => {
        if (typeof id === 'string') return val.object === id;
        return val.id === id;
      });
      if (index) storageItems.splice(index, 1);
      sessionStorage.setItem(key, JSON.stringify(storageItems));
    }
  }
}
