import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable, startWith, Subject, switchMap } from 'rxjs';
import { Meme, FavMeme } from 'src/app/models/meme';
import { MemeService } from 'src/app/services/meme.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  public readonly memes$!: Observable<Meme>;

  private readonly update$ = new Subject<void>();
  private db$!: Observable<IDBDatabase>;

  constructor(private readonly memeService: MemeService,private update: SwUpdate) {
    this.memes$ = this.memeService.memeList$;
   }

  ngOnInit(): void {
    this.init();
  }

  public async addToFavorites(meme: FavMeme): Promise<void> {
    this.db$
      .pipe(
        switchMap(
          (db) =>
            new Observable((observer) => {
              let transaction = db.transaction("memes", "readwrite");
              transaction.objectStore("memes").add(meme);
              transaction.oncomplete = () => {
                
                this.update$.next();
                observer.complete();
              };
              return () => transaction?.abort();
            })
        )
      )
      .subscribe();
  }

  private init(): void {
    this.db$ = new Observable<IDBDatabase>((observer) => {
      const openRequest = indexedDB.open("memesDB");
      openRequest.onupgradeneeded = () => this.createDb(openRequest.result);
      openRequest.onsuccess = () => {
        observer.next(openRequest.result);
        observer.complete();
      };
    });
  }

  private createDb(db: IDBDatabase): void {
    db.createObjectStore("memes", { keyPath: "id" });
    console.log("create", db);
  }

}
