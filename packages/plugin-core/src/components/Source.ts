import { Component } from 'gecs';

export class Source extends Component {
  public static readonly type = 'src';
  public path!: string;
  public filename!: string;
  public plugin!: string;
}
