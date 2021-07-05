export default function buildMakeSource ({ isValidIp }) {
  return function makeSource ({ ip, browser, referrer } = {}) {
    if (!ip) {
      throw new Error('La fuente del comentario debe tener una IP.')
    }
    if (!isValidIp(ip)) {
      throw new RangeError('La fuente del comentario debe contener una IP valida.')
    }
    return Object.freeze({
      getIp: () => ip,
      getBrowser: () => browser,
      getReferrer: () => referrer
    })
  }
}
