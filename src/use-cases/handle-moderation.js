export default function makeHandleModeration ({
  initiateReview
}) {
  return async function handleModeration ({ comment }) {
    const moderated = { ...comment }
    initiateReview({ id: moderated.getId(), content: moderated.getText() })
    return moderated
  }
}
