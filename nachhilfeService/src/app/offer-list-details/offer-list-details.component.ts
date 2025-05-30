import {Component, OnInit, signal} from '@angular/core';
import {OfferStoreService} from '../shared/offer-store.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Offer} from '../shared/offer';
import {DatePipe} from '@angular/common';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-offer-list-details',
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './offer-list-details.component.html',
  styles: ``
})
export class OfferListDetailsComponent implements OnInit {

  offer = signal<Offer|undefined>(undefined);
  constructor(private os:OfferStoreService, private route:ActivatedRoute, private toastr:ToastrService, private router:Router) {
    // this.os = inject(OfferStoreService);
    // this.route = inject(ActivatedRoute);
  }

  ngOnInit() {
    const params = this.route.snapshot.params;
    this.os.getSingle(params['id']).subscribe(
      (o:Offer) => this.offer.set(o));

  }

  removeOffer(id: string) {
      if(this.offer()){
        if(confirm('Soll das Angebot wirklich gelöscht werden?')) {
          this.os.deleteSingleOffer(this.offer()!.id).subscribe(
            () => {
              this.toastr.success('Das Angebot wurde gelöscht');
              this.router.navigate(['angebote']);
              //alert('Das Angebot wurde gelöscht');
            }, () => {
              this.toastr.error('Das Angebot konnte nicht gelöscht werden');
              //alert('Das Angebot konnte nicht gelöscht werden');
            }
          );
        }
      }
  }

  updatOffer(id: string) {

  }


}
