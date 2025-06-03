export class BookingPayload{
  constructor(
    public giver_id: string,
    public receiver_id: string,
    public offer_id: string,
    public slot_id: string,

  ) {}
}
