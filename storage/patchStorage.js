/**
 * 
 * @param {Storage} storage 需要被编码的Storage实例
 * @param {Boolean} decode 默认编码，true的话，反编码
 * @example
 * patchStorage(sessionStorage) 表示将所有sessionStorage都编码存储
 * patchStorage(sessionStorage, true) 表示将所有的sessionStorage反编码存储
 */
export function patchStorage (storage, decode = false) {
  let identity = 'bd4xyekxmsd',
  if (storage instanceof Storage) {
    const setItem = Storage.prototype.setItem
    const getItem = Storage.prototype.getItem
    if (decode) {
      storage.setItem = setItem
      storage.getItem = function(key) {
        let v = getItem.call(this, key)
        if (v.indexOf(identity) === 0) {
          v = v.slice(identity.length)
          v = v && decodeURIComponent(atob(v))
          storage.setItem(key, v)
        }
        return v
      }
    } else {
      storage.setItem = function(k, v) {
        v = identity + btoa(encodeURIComponent(v && v.toString()))
        setItem.call(this, k, v)
      }
      storage.getItem = function(key){
        let v = getItem.call(this, key)
        if (v.indexOf(identity) === 0) {
          v = v.slice(identity.length)
          v = v && decodeURIComponent(atob(v))
        } else {
          storage.setItem(key, v)
        }
        return v
      }
    }
  }
}