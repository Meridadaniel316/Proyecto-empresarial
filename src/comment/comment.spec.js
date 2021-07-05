import makeFakeComment from '../../__test__/fixtures/comment'
import makeComment from './'
describe('comment', () => {
  it('Debe tener un autor', () => {
    const comment = makeFakeComment({ author: null })
    expect(() => makeComment(comment)).toThrow('El comentario debe tener un autor.')
  })

  it('Debe tener un PostId valido', () => {
    const comment = makeFakeComment({ postId: null })
    expect(() => makeComment(comment)).toThrow('El comentario debe tener un PostId.')
  })
  it('Debe tener un texto valido', () => {
    const comment = makeFakeComment({ text: null })
    expect(() => makeComment(comment)).toThrow('El comentario debe incluir al menos un caracter.')
  })
  it('Puede ser en respuesta a otro comentario', () => {
    const comment = makeFakeComment({ replyToId: 'invalid' })
    expect(() => makeComment(comment)).toThrow('Si se suministra. El comentario debe tener un replyToId valido')
    const notInReply = makeFakeComment({ replyToId: undefined })
    expect(() => makeComment(notInReply)).not.toThrow()
  })
  it('Puede tener una id', () => {
    const comment = makeFakeComment({ id: 'invalid' })
    expect(() => makeComment(comment)).toThrow('El comentario debe tener una Id valida')
    const noId = makeFakeComment({ id: undefined })
    expect(() => makeComment(noId)).not.toThrow()
  })
  it('Puede crear una id', () => {
    const noId = makeFakeComment({ id: undefined })
    const comment = makeComment(noId)
    expect(comment.getId()).toBeDefined()
  })
  it('Puede ser publicado', () => {
    const unpublished = makeFakeComment({ published: false })
    const comment = makeComment(unpublished)
    expect(comment.isPublished()).toBe(false)
    comment.publish()
    expect(comment.isPublished()).toBe(true)
  })
  it('puede ser despublicado', () => {
    const unpublished = makeFakeComment({ published: true })
    const comment = makeComment(unpublished)
    expect(comment.isPublished()).toBe(true)
    comment.unPublish()
    expect(comment.isPublished()).toBe(false)
  })
  it('is createdOn now in UTC', () => {
    const noCreationDate = makeFakeComment({ createdOn: undefined })
    expect(noCreationDate.createdOn).not.toBeDefined()
    const d = makeComment(noCreationDate).getCreatedOn()
    expect(d).toBeDefined()
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT')
  })
  it('is modifiedOn now in UTC', () => {
    const noModifiedOnDate = makeFakeComment({ modifiedOn: undefined })
    expect(noModifiedOnDate.modifiedOn).not.toBeDefined()
    const d = makeComment(noModifiedOnDate).getCreatedOn()
    expect(d).toBeDefined()
    expect(new Date(d).toUTCString().substring(26)).toBe('GMT')
  })
  it('a', () => {
    const sane = makeComment({
      ...makeFakeComment({ text: '<p>This is fine</p>' })
    })
    const insane = makeComment({
      ...makeFakeComment({
        text: '<script>This is not so fine</script><p>but this is ok</p>'
      })
    })
    const totallyInsane = makeFakeComment({
      text: '<script>All your base are belong to us!</script>'
    })

    expect(sane.getText()).toBe('<p>This is fine</p>')
    expect(insane.getText()).toBe('<p>but this is ok</p>')
    expect(() => makeComment(totallyInsane)).toThrow(
      'El comentario no contiene texto utilizable.'
    )
  })
  it('se puede marcar como eliminado', () => {
    const fake = makeFakeComment()
    const c = makeComment(fake)
    c.markDeleted()
    expect(c.isDeleted()).toBe(true)
    expect(c.getText()).toBe('.xX Este comentario ha sido eliminado Xx.')
    expect(c.getAuthor()).toBe('deleted')
  })
  it('includes a hash', () => {
    const fakeComment = {
      author: 'Bruce Wayne',
      text: "I'm batman.",
      postId: 'cjt65art5350vy000hm1rp3s9',
      published: true,
      source: { ip: '127.0.0.1' }
    }
    // md5 from: http://www.miraclesalad.com/webtools/md5.php
    expect(makeComment(fakeComment).getHash()).toBe(
      '7bb94f070d9305976b5381b7d3e8ad8a'
    )
  })
  it('debe tener una fuente', () => {
    const noSource = makeFakeComment({ source: undefined })
    expect(() => makeComment(noSource)).toThrow('El comentario debe tener una fuente.')
  })
  it('debe tener una IP de origen', () => {
    const noIp = makeFakeComment({ source: { ip: undefined } })
    expect(() => makeComment(noIp)).toThrow(
      'La fuente del comentario debe tener una IP.'
    )
  })
  it('puede tener un navegador de origen', () => {
    const withBrowser = makeFakeComment()
    expect(
      makeComment(withBrowser)
        .getSource()
        .getBrowser()
    ).toBe(withBrowser.source.browser)
  })
  it('puede tener una fuente de referencia', () => {
    const withRef = makeFakeComment()
    expect(
      makeComment(withRef)
        .getSource()
        .getReferrer()
    ).toBe(withRef.source.referrer)
  })
})
