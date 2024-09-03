import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Text "mo:base/Text";

actor {
  public type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  stable var posts: [Post] = [];
  stable var nextId: Nat = 0;

  public func createPost(title: Text, body: Text, author: Text): async Nat {
    let post: Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    post.id
  };

  public query func getPosts(): async [Post] {
    Array.reverse(posts)
  };
}
