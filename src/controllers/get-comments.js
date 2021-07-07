import { Observable } from "rxjs"
export default function makeGetComments ({ listComments }) {
  return async function getComments (httpRequest) {
    const headers = {
      'Content-Type': 'application/json'
    }
    try {
      const postComments = await listComments({
        postId: httpRequest.query.postId
      })

      const getCommentsEvent$ = new Observable(subs => {
        subs.next(postComments);
        subs.complete();

      })
  
      getCommentsEvent$.subscribe(x => {
        console.log(x);
      });
      return {
        headers,
        statusCode: 200,
        body: postComments
      }
    } catch (e) {
      // TODO: Error logging
      console.log(e)
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message
        }
      }
    }
  }
}
