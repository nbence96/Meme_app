import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { Meme } from '../models/meme';

@Injectable({
  providedIn: 'root'
})
export class MemeService {
  public readonly memeList$: Observable<Meme>;

  constructor() {
    this.memeList$ = from(fetch("https://api.imgflip.com/get_memes")).pipe(switchMap((res) => res.clone().json()));
   }
}
