import makeComment from '../comment'
export default function makeEditComment ({ commentsDb, handleModeration }) {
  return async function editComment ({ id, ...changes } = {}) {
    if (!id) {
      throw new Error('Debe ingresar una id valida.')
    }
    if (!changes.text) {
      throw new Error('Debe ingresar un texto valido.')
    }
    const existing = await commentsDb.findById({ id })

    if (!existing) {
      throw new RangeError('Comentario no encontrado.')
    }
    const comment = makeComment({ ...existing, ...changes, modifiedOn: null })
    if (comment.getHash() === existing.hash) {
      return existing
    }
    const moderated = await handleModeration({ comment })
    const updated = await commentsDb.update({
      id: moderated.getId(),
      published: moderated.isPublished(),
      modifiedOn: moderated.getModifiedOn(),
      text: moderated.getText(),
      hash: moderated.getHash()
    })
    return { ...existing, ...updated }
  }
}
