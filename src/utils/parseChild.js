import parseTemplate from './parseTemplate'

const parseChild = (child, data) =>
  (typeof child == 'string') ? parseTemplate(child, data) : child

export default parseChild
