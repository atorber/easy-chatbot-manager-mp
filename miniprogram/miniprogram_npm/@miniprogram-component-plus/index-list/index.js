module.exports =
/** *** */ (function (modules) { // webpackBootstrap
    /** *** */ 	// The module cache
    /** *** */ 	const installedModules = {}
    /** *** */
    /** *** */ 	// The require function
    /** *** */ 	function __webpack_require__(moduleId) {
      /** *** */
      /** *** */ 		// Check if module is in cache
      /** *** */ 		if (installedModules[moduleId]) {
        /** *** */ 			return installedModules[moduleId].exports
        /** *** */ 		}
      /** *** */ 		// Create a new module (and put it into the cache)
      /** *** */ 		const module = installedModules[moduleId] = {
        /** *** */ 			i: moduleId,
        /** *** */ 			l: false,
        /** *** */ 			exports: {}
        /** *** */ 		}
      /** *** */
      /** *** */ 		// Execute the module function
      /** *** */ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
      /** *** */
      /** *** */ 		// Flag the module as loaded
      /** *** */ 		module.l = true
      /** *** */
      /** *** */ 		// Return the exports of the module
      /** *** */ 		return module.exports
      /** *** */ 	}
    /** *** */
    /** *** */
    /** *** */ 	// expose the modules object (__webpack_modules__)
    /** *** */ 	__webpack_require__.m = modules
    /** *** */
    /** *** */ 	// expose the module cache
    /** *** */ 	__webpack_require__.c = installedModules
    /** *** */
    /** *** */ 	// define getter function for harmony exports
    /** *** */ 	__webpack_require__.d = function (exports, name, getter) {
      /** *** */ 		if (!__webpack_require__.o(exports, name)) {
        /** *** */ 			Object.defineProperty(exports, name, {enumerable: true, get: getter})
        /** *** */ 		}
      /** *** */ 	}
    /** *** */
    /** *** */ 	// define __esModule on exports
    /** *** */ 	__webpack_require__.r = function (exports) {
      /** *** */ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /** *** */ 			Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'})
        /** *** */ 		}
      /** *** */ 		Object.defineProperty(exports, '__esModule', {value: true})
      /** *** */ 	}
    /** *** */
    /** *** */ 	// create a fake namespace object
    /** *** */ 	// mode & 1: value is a module id, require it
    /** *** */ 	// mode & 2: merge all properties of value into the ns
    /** *** */ 	// mode & 4: return value when already ns object
    /** *** */ 	// mode & 8|1: behave like require
    /** *** */ 	__webpack_require__.t = function (value, mode) {
      /** *** */ 		if (mode & 1) value = __webpack_require__(value)
      /** *** */ 		if (mode & 8) return value
      /** *** */ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value
      /** *** */ 		const ns = Object.create(null)
      /** *** */ 		__webpack_require__.r(ns)
      /** *** */ 		Object.defineProperty(ns, 'default', {enumerable: true, value})
      /** *** */ 		if (mode & 2 && typeof value !== 'string') for (const key in value) __webpack_require__.d(ns, key, function (key) { return value[key] }.bind(null, key))
      /** *** */ 		return ns
      /** *** */ 	}
    /** *** */
    /** *** */ 	// getDefaultExport function for compatibility with non-harmony modules
    /** *** */ 	__webpack_require__.n = function (module) {
      /** *** */ 		const getter = module && module.__esModule
      /** *** */ 			? function getDefault() { return module.default }
      /** *** */ 			: function getModuleExports() { return module }
      /** *** */ 		__webpack_require__.d(getter, 'a', getter)
      /** *** */ 		return getter
      /** *** */ 	}
    /** *** */
    /** *** */ 	// Object.prototype.hasOwnProperty.call
    /** *** */ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property) }
    /** *** */
    /** *** */ 	// __webpack_public_path__
    /** *** */ 	__webpack_require__.p = ''
    /** *** */
    /** *** */
    /** *** */ 	// Load entry module and return exports
    /** *** */ 	return __webpack_require__(__webpack_require__.s = 4)
    /** *** */ }({

    /** */ 4:
    /** */ (function (module, exports, __webpack_require__) {
      const throttle = function throttle(func, wait, options) {
        let context = void 0
        let args = void 0
        let result = void 0
        let timeout = null
        let previous = 0
        if (!options) options = {}
        const later = function later() {
          previous = options.leading === false ? 0 : Date.now()
          timeout = null
          result = func.apply(context, args)
          if (!timeout) context = args = null
        }
        return function () {
          const now = Date.now()
          if (!previous && options.leading === false) previous = now
          const remaining = wait - (now - previous)
          context = this
          args = arguments
          if (remaining <= 0 || remaining > wait) {
            clearTimeout(timeout)
            timeout = null
            previous = now
            result = func.apply(context, args)
            if (!timeout) context = args = null
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining)
          }
          return result
        }
      }
      Component({
        options: {
          addGlobalClass: true,
          pureDataPattern: /^_/
        },
        properties: {
          list: {
            type: Array,
            value: [],
            observer: function observer(newVal) {
              const _this = this

              if (newVal.length === 0) return
              const data = this.data
              const alphabet = data.list.map(function (item) {
                return item.alpha
              })
              this.setData({
                alphabet,
                current: alphabet[0]
              }, function () {
                _this.computedSize()
              })
            }
          },
          vibrated: {
            type: Boolean,
            value: true
          }
        },
        data: {
          windowHeight: 612,
          current: 'A',
          intoView: '',
          touching: false,
          alphabet: [],
          _tops: [],
          _anchorItemH: 0,
          _anchorItemW: 0,
          _anchorTop: 0,
          _listUpperBound: 0
        },
        lifetimes: {
          created: function created() {},
          attached: function attached() {
            this.__scrollTo = throttle(this._scrollTo, 100, {})
            this.__onScroll = throttle(this._onScroll, 100, {})

            const _wx$getSystemInfoSync = wx.getSystemInfoSync()
            const windowHeight = _wx$getSystemInfoSync.windowHeight

            this.setData({windowHeight})
          }
        },
        methods: {
          choose: function choose(e) {
            const item = e.target.dataset.item
            this.triggerEvent('choose', {item})
          },
          scrollTo: function scrollTo(e) {
            this.__scrollTo(e)
          },
          _scrollTo: function _scrollTo(e) {
            const data = this.data
            const clientY = e.changedTouches[0].clientY
            const index = Math.floor((clientY - data._anchorTop) / data._anchorItemH)
            const current = data.alphabet[index]
            this.setData({current, intoView: current, touching: true})
            if (data.vibrated) wx.vibrateShort()
          },
          computedSize: function computedSize() {
            const data = this.data
            const query = this.createSelectorQuery()
            query.selectAll('.index_list_item').boundingClientRect(function (rects) {
              const result = rects
              data._tops = result.map(function (item) {
                return item.top
              })
            }).exec()
            query.select('.anchor-list').boundingClientRect(function (rect) {
              data._anchorItemH = rect.height / data.alphabet.length
              data._anchorItemW = rect.width
              data._anchorTop = rect.top
            }).exec()
            query.select('.page-select-index').boundingClientRect(function (rect) {
              data._listUpperBound = rect.top
            })
          },
          removeTouching: function removeTouching() {
            const _this2 = this

            setTimeout(function () {
              _this2.setData({touching: false})
            }, 150)
          },
          onScroll: function onScroll(e) {
            this.__onScroll(e)
          },
          _onScroll: function _onScroll(e) {
            const data = this.data
            const _tops = data._tops
            const alphabet = data.alphabet

            const scrollTop = e.detail.scrollTop
            let current = ''
            if (scrollTop < _tops[0]) {
              current = alphabet[0]
            } else {
              for (let i = 0, len = _tops.length; i < len - 1; i++) {
                if (scrollTop >= _tops[i] && scrollTop < _tops[i + 1]) {
                  current = alphabet[i]
                }
              }
            }
            if (!current) current = alphabet[alphabet.length - 1]
            this.setData({current})
          }
        }
      })
      /** */ })

    /** *** */ }))
