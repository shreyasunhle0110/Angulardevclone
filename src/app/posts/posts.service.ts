import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: any}>(
        'http://192.168.158.128:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map((post) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe(transpostData => {
        console.log(transpostData);
        this.posts = transpostData;
        //console.log(this.posts);
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string }>('http://192.168.158.128:3000/api/posts', post)
      .subscribe(responseData => {
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: any) {
    this.http.delete("http://192.168.158.128:3000/api/posts/" + postId)
    .subscribe(() => {
      const postupdates = this.posts.filter(post => post.id !== postId);
        this.posts = postupdates;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
