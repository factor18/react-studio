import objectPath from 'object-path'

const parseTemplate = (template, map) =>
  template.replace(/\${([^{]+[^}])}/g, (match) =>
    objectPath.get(map, match.substr(2, match.length - 3).trim())
  )

export default parseTemplate