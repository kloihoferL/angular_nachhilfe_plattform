import {Subcourse} from './subcourse';

export class Course {
  //subcourses: any;
  //subcourses: any;

  constructor(public id:string, public name:string, public subcourses:Subcourse[] = []) {


  }
}
