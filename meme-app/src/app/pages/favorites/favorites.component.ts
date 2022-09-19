import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable, startWith, Subject, switchMap } from 'rxjs';
import { FavMeme } from 'src/app/models/meme';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  private readonly update$ = new Subject<void>();
  private db$!: Observable<IDBDatabase>;
  public memes$!: Observable<FavMeme[]>;


  constructor(private update: SwUpdate) { }

  ngOnInit(): void {
    this.init();
    this.updatingMemes();
    this.checkUpdate();
  }

  public  deleteMeme(memeId: any) {
  this.db$
    .pipe(
      switchMap(
        (db) =>
          new Observable((observer) => {
            let transaction = db.transaction("memes", "readwrite");
            transaction.objectStore("memes").delete(memeId);
            transaction.oncomplete = () => {
              transaction = null as any;
              this.update$.next();
              observer.complete();
            };
            return () => transaction?.abort();
          })
      )
    )
    .subscribe();
  }

  private updatingMemes(): void {
    this.memes$ = this.update$.pipe(
      startWith(undefined),
      switchMap(() =>
        this.db$.pipe(
          switchMap(
            (db) =>
              new Observable<FavMeme[]>((observer) => {
                let transaction = db.transaction("memes");
                const request = transaction.objectStore("memes").getAll();
                transaction.oncomplete = () => {
                  transaction = null as any;
                  observer.next(request.result as FavMeme[]);
                  observer.complete();
                };
              })
          )
        )
      )
    );
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

  private checkUpdate(){
    this.update.checkForUpdate().then(data =>{
      if(data){
        alert("new version available");
        window.location.reload();
      }
    })
  }
}
