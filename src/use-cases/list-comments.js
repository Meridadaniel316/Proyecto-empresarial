export default function makeListComments ({ commentsDb }) {
  return async function listComments ({ postId } = {}) {

    if (!postId) {
      
      const comments = await commentsDb.findAll()
      const nestedComments = nest(comments)
      return {
        message: 'Debe ingresar una id valida. Se procede a mostrar todos los comentarios.',
        nestedComments
      }
    }else{
      const comments = await commentsDb.findByPostId({
        postId,
        omitReplies: false
      })
      const nestedComments = nest(comments)
      return nestedComments
    }

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
