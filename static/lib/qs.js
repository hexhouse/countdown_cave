export default location.search
  .substr(1)
  .split('&')
  .filter(v => v)
  .map(c => c.split('=').map(decodeURIComponent))
  .reduce((params, [k, v]) => (params[k] = v, params), {});

