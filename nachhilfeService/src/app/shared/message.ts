export class Message{

  constructor(
    public id:string,
    public sender_id:string,
    public receiver_id:string,
    public content: string,
  ) {}

}
