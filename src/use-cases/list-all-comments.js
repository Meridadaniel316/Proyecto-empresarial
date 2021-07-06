/* export default function makeListAllComments ({ commentsDb }) {
    return async function listAllComments ({ postId } = {}) {
      const comments = await commentsDb.findAll()
      const nestedComments = nest(comments)
      return nestedComments
  
      function nest (comments) {
        if (comments.length === 0) {
          return comments
        }
        return comments.reduce((nested, comment) => {
          comment.replies = comments.filter(
            reply => reply.replyToId === comment.id
          )
          nest(comment.replies)
          if (comment.replyToId == null) {
            nested.push(comment)
          }
          return nested
        }, [])
      }
      
    }
  }
   */

  export default function makeListComments ({ commentsDb }) {
    return async function listComments ({ postId } = {}) {

      const comments = await commentsDb.findAll()
      const nestedComments = nest(comments)
      return nestedComments
  
      // If this gets slow introduce caching.
      function nest (comments) {
        if (comments.length === 0) {
          return comments
        }
        return comments.reduce((nested, comment) => {
          comment.replies = comments.filter(
            reply => reply.replyToId === comment.id
          )
          nest(comment.replies)
          if (comment.replyToId == null) {
            nested.push(comment)
          }
          return nested
        }, [])
      }
    }
  }
  