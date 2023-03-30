import { Injectable } from '@angular/core';
import { Stems } from 'src/app/models/stems.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  getUniqueValues(data: Stems[], property: string) {
    const brandSet = new Set(data.map(stem => stem[property as keyof typeof stem]))
    const uniqArray: (string | number | null)[] = [...brandSet];
    let sortedUniqArray: (string | number | null)[] = uniqArray;

    // Checking if either the first or second is of type "string" or "number" in case the first item is null
    if (uniqArray.includes(null)) {
      uniqArray.splice(uniqArray.indexOf(null), 1);
    }

    if (typeof uniqArray[0] === "string") {

      sortedUniqArray = uniqArray.sort();
      return sortedUniqArray;
    }

    if (typeof uniqArray[0] === "number") {

      sortedUniqArray = uniqArray.sort((a, b) => (a as number) - (b as number));
      return sortedUniqArray;
    }

    return sortedUniqArray;
  }
}
