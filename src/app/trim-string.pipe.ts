import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'trimString'
})
export class TrimStringPipe implements PipeTransform {

  transform(str: string, maxLength: any): any {
    console.log(str);
    if (str.length > maxLength) {
      let tempTrimmedString = str.substring(0, maxLength) + '...';
      return tempTrimmedString;
    }
    else {
      return str;
    }
  }

}
