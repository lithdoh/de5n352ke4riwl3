import { Injectable } from '@angular/core';
import { PartInfo } from './part.model';

@Injectable({
  providedIn: 'root'
})
export class AddPartsService {
  // private partinfo: PartInfo[] = [
  //   new PartInfo('ATMOS 6K STEM', 'ST-ATMS-6K1-A1', '$79'),
  //   new PartInfo('ATMOS 7K STEM', 'ST-ATMS-7K1-A1', '$81'),
  // ]
  // constructor() { }

  // getPartInfo() {
  //   return this.partinfo.slice();
  // }

  addItemsToHome(parts: PartInfo) {

  }
}
