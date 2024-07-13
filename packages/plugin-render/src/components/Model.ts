import { Component } from 'gecs';

export class Model extends Component {
  public static readonly type = 'model';
  public path!: string;
}
