(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.TWEEN = factory());
}(this, (function () { 'use strict';

	/**
	 * Tween.js - Licensed under the MIT license
	 * https://github.com/tweenjs/tween.js
	 * ----------------------------------------------
	 *
	 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
	 * Thank you all, you're awesome!
	 */


	var _Group = function () {
		this._tweens             = [];
        this._onCompleteCallback = null;
        this._started            = false;
        this._completed          = false;
	};

	_Group.prototype = {
        onComplete: function (callback)
        {
			this._onCompleteCallback = callback;
			return this;
        },

        isCompleted : function()
        {
            return this._completed;
        },

        getAll: function ()
        {
            return this._tweens;
		},

        removeAll: function ()
        {
			this._tweens = [];
		},

        add: function (tween)
        {
            this._tweens.push(tween);

            this._started   = true;
            this._completed = false;
		},

        remove: function (tween)
        {
            const pred = (t)=>{
                return t.getId() == tween.getId();
            };

            Array_RemoveIf(this._tweens, pred);
            if(this._tweensAddedDuringUpdate) {
				Array_RemoveIf(this._tweensAddedDuringUpdate, pred);
			}
		},

        update: function ()
        {
            if(this._completed) {
                return;
            }

            let any_tween_is_playing = false;
            for (let i = 0; i < this._tweens.length; ++i) {
                const tween = this._tweens[i];
                if(tween._isPlaying) {
                    tween._isPlaying = tween.update();
                    any_tween_is_playing = true;
                }
            }

            if(!any_tween_is_playing) {
                if(this._started) {
                    this._completed = true;
                    this._started   = false;
                    this.removeAll();

                    if(this._onCompleteCallback != null) {
                        // debugger;
                        this._onCompleteCallback();
                    }
                }

                return false;
			}

            return true;
        }
	};

	var TWEEN = new _Group();

	TWEEN.Group = _Group;
	TWEEN._nextId = 0;
	TWEEN.nextId = function () {
		return TWEEN._nextId++;
	};


	// Include a performance.now polyfill.
	// In node.js, use process.hrtime.
	if (typeof (self) === 'undefined' && typeof (process) !== 'undefined' && process.hrtime) {
		TWEEN.now = function () {
			var time = process.hrtime();

			// Convert [seconds, nanoseconds] to milliseconds.
			return time[0] * 1000 + time[1] / 1000000;
		};
	}
	// In a browser, use self.performance.now if it is available.
	else if (typeof (self) !== 'undefined' &&
	         self.performance !== undefined &&
			 self.performance.now !== undefined) {
		// This must be bound, because directly assigning this function
		// leads to an invocation exception in Chrome.
		TWEEN.now = self.performance.now.bind(self.performance);
	}
	// Use Date.now if it is available.
	else if (Date.now !== undefined) {
		TWEEN.now = Date.now;
	}
	// Otherwise, use 'new Date().getTime()'.
	else {
		TWEEN.now = function () {
			return new Date().getTime();
		};
	}


    TWEEN.Tween = function (object, group)
    {
        this._object            = object;
        this._ratio				= 0;
		this._valuesStart       = {};
		this._valuesEnd         = {};

        this._delayTime = 0;
        this._elapsed   = 0;
        this._delayToStart = 0;
		this._duration  = 1000;

        this._repeat          = 0;
		this._repeatDelayTime = undefined;
		this._yoyo            = false;

        this._isPaused = false;
        this._isPlaying = false;
        this._reversed  = false;


		this._easingFunction        = TWEEN.Easing.Linear.None;
		this._interpolationFunction = TWEEN.Interpolation.Linear;

        this._chainedTweens = [];

		this._onStartCallbackFired = false;
        this._onStartCallback      = null;
		this._onUpdateCallback     = null;
		this._onRepeatCallback     = null;
		this._onCompleteCallback   = null;
        this._onStopCallback       = null;

		this._group = group || TWEEN;
		this._id                 = TWEEN.nextId();
	};

	TWEEN.Tween.prototype = {
        getValue : function() {
            return this._object;
        },

		getRatio : function() {
        	return this._ratio
		},

		getId: function () {
			return this._id;
		},

		isPlaying: function () {
			return this._isPlaying;
		},

		isPaused: function () {
			return this._isPaused;
		},

        from: function(properties) {
            this._object     = properties;
            this._valuesStart = Object.create(properties);
            return this;
        },

		to: function (properties, duration) {

			this._valuesEnd = Object.create(properties);

			if (duration !== undefined) {
				this._duration = duration;
			}

			return this;
		},

		duration: function duration(d) {
			this._duration = d;
			return this;
		},

		start: function (time) {

			this._group.add(this);

			this._isPlaying = true;
			this._isPaused  = false;
            this._reversed  = false;
			this._onStartCallbackFired = false;

            if(Utils_IsNullOrUndefined(time)) {
                time = 0;
            }

            this._elapsed      = 0;
            this._delayToStart = (time + this._delayTime);

            // console.log("start - delayToStart:", this._delayToStart);
			for (var property in this._valuesEnd) {

				// Check if an Array was provided as property value
				if (this._valuesEnd[property] instanceof Array) {

					if (this._valuesEnd[property].length === 0) {
						continue;
					}

					// Create a local copy of the Array with the start value at the front
					this._valuesEnd[property] = [this._object[property]].concat(this._valuesEnd[property]);

				}

				// If `to()` specifies a property that doesn't exist in the source object,
				// we should not set that property in the object
				if (this._object[property] === undefined) {
					continue;
				}

				// Save the starting value, but only once.
				if (typeof(this._valuesStart[property]) === 'undefined') {
					this._valuesStart[property] = this._object[property];
				}

				if ((this._valuesStart[property] instanceof Array) === false) {
					this._valuesStart[property] *= 1.0; // Ensures we're using numbers, not strings
				}
			}

			return this;

        },

        update: function ()
        {
            this._delayToStart -= _Tween_Delta_Time * 1000;
            if(this._delayToStart > 0) {
                return true;
            }

            var property;
            var value;

			if (this._onStartCallbackFired === false) {
				if (this._onStartCallback !== null) {
					this._onStartCallback(this._object);
				}
				this._onStartCallbackFired = true;
			}

            this._elapsed += _Tween_Delta_Time * 1000;
            this._ratio = (this._elapsed / this._duration);
            let ratio_value = this._ratio;
            if(this._reversed) {
                ratio_value = 1 - this._ratio;
            }

			value = this._easingFunction(ratio_value);

            // console.log("update - value:", value);
			for (property in this._valuesEnd) {

				// Don't update properties that do not exist in the source object
				if (this._valuesStart[property] === undefined) {
					continue;
				}

				var start = this._valuesStart[property];
                var end   = this._valuesEnd  [property];

				if (end instanceof Array) {

					this._object[property] = this._interpolationFunction(end, value);

				} else {

					// Parses relative end values with start as base (e.g.: +10, -3)
					if (typeof (end) === 'string') {

						if (end.charAt(0) === '+' || end.charAt(0) === '-') {
							end = start + parseFloat(end);
						} else {
							end = parseFloat(end);
						}
					}

					// Protect against non numeric properties.
					if (typeof (end) === 'number') {
						this._object[property] = start + (end - start) * value;
					}

				}

			}

			if (this._onUpdateCallback !== null) {
				this._onUpdateCallback(this._object);
			}

			if (this._ratio >= 1) {
				if (this._repeat > 0) {
                    this._elapsed = 0;

					if (isFinite(this._repeat)) {
						this._repeat--;
					}

					if (this._yoyo) {
						this._reversed = !this._reversed;
					}

					if (this._repeatDelayTime !== undefined) {
						this._delayToStart = this._repeatDelayTime;
					} else {
                        this._delayToStart = this._delayTime;
					}

					if (this._onRepeatCallback !== null) {
                        // console.log("this._onRepeatCallback");
						this._onRepeatCallback(this._object);
					}

					return true;

				} else {
					if (this._onCompleteCallback !== null) {
                        // console.log("this._onCompleteCallback");
						this._onCompleteCallback(this._object);
					}

					for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
						// Make the chained tweens start exactly at the time they should,
						// even if the `update()` method was called way past the duration of the tween
						this._chainedTweens[i].start(this._duration);
					}

					return false;
				}

			}

			return true;
		},

		stop: function () {
			if (!this._isPlaying) {
				return this;
			}

			this._group.remove(this);

			this._isPlaying = false;
			this._isPaused = false;

			if (this._onStopCallback !== null) {
				this._onStopCallback(this._object);
			}

			this.stopChainedTweens();
			return this;
		},

		end: function () {
			this.update(Infinity);
			return this;
		},

		stopChainedTweens: function () {
			for (var i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
				this._chainedTweens[i].stop();
			}
		},

		group: function (group) {
			this._group = group;
			return this;
		},

        delay: function (amount)
        {
			this._delayTime = amount;
			return this;
		},

        repeat: function (times)
        {
			this._repeat = times;
			return this;
		},

		repeatDelay: function (amount) {
			this._repeatDelayTime = amount;
			return this;
		},

		yoyo: function (yoyo) {
			this._yoyo = yoyo;
			return this;
		},

		easing: function (easingFunction) {
			this._easingFunction = easingFunction;
			return this;
		},

		interpolation: function (interpolationFunction) {
			this._interpolationFunction = interpolationFunction;
			return this;
		},

		chain: function () {
            this._chainedTweens = arguments;
			return this;
		},

		onStart: function (callback) {
			this._onStartCallback = callback;
			return this;
		},

		onUpdate: function (callback) {
			this._onUpdateCallback = callback;
			return this;
		},

		onRepeat: function onRepeat(callback) {
			this._onRepeatCallback = callback;
			return this;
		},

		onComplete: function (callback) {
			this._onCompleteCallback = callback;
			return this;
		},

		onStop: function (callback) {
			this._onStopCallback = callback;
			return this;
		},


	};


	TWEEN.Easing = {

		Linear: {

			None: function (k) {

				return k;

			}

		},

		Quadratic: {

			In: function (k) {

				return k * k;

			},

			Out: function (k) {

				return k * (2 - k);

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return 0.5 * k * k;
				}

				return - 0.5 * (--k * (k - 2) - 1);

			}

		},

		Cubic: {

			In: function (k) {

				return k * k * k;

			},

			Out: function (k) {

				return --k * k * k + 1;

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return 0.5 * k * k * k;
				}

				return 0.5 * ((k -= 2) * k * k + 2);

			}

		},

		Quartic: {

			In: function (k) {

				return k * k * k * k;

			},

			Out: function (k) {

				return 1 - (--k * k * k * k);

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return 0.5 * k * k * k * k;
				}

				return - 0.5 * ((k -= 2) * k * k * k - 2);

			}

		},

		Quintic: {

			In: function (k) {

				return k * k * k * k * k;

			},

			Out: function (k) {

				return --k * k * k * k * k + 1;

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return 0.5 * k * k * k * k * k;
				}

				return 0.5 * ((k -= 2) * k * k * k * k + 2);

			}

		},

		Sinusoidal: {

			In: function (k) {

				return 1 - Math.cos(k * Math.PI / 2);

			},

			Out: function (k) {

				return Math.sin(k * Math.PI / 2);

			},

			InOut: function (k) {

				return 0.5 * (1 - Math.cos(Math.PI * k));

			}

		},

		Exponential: {

			In: function (k) {

				return k === 0 ? 0 : Math.pow(1024, k - 1);

			},

			Out: function (k) {

				return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);

			},

			InOut: function (k) {

				if (k === 0) {
					return 0;
				}

				if (k === 1) {
					return 1;
				}

				if ((k *= 2) < 1) {
					return 0.5 * Math.pow(1024, k - 1);
				}

				return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);

			}

		},

		Circular: {

			In: function (k) {

				return 1 - Math.sqrt(1 - k * k);

			},

			Out: function (k) {

				return Math.sqrt(1 - (--k * k));

			},

			InOut: function (k) {

				if ((k *= 2) < 1) {
					return - 0.5 * (Math.sqrt(1 - k * k) - 1);
				}

				return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);

			}

		},

		Elastic: {

			In: function (k) {

				if (k === 0) {
					return 0;
				}

				if (k === 1) {
					return 1;
				}

				return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);

			},

			Out: function (k) {

				if (k === 0) {
					return 0;
				}

				if (k === 1) {
					return 1;
				}

				return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;

			},

			InOut: function (k) {

				if (k === 0) {
					return 0;
				}

				if (k === 1) {
					return 1;
				}

				k *= 2;

				if (k < 1) {
					return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
				}

				return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;

			}

		},

		Back: {

			In: function (k) {

				var s = 1.70158;

				return k * k * ((s + 1) * k - s);

			},

			Out: function (k) {

				var s = 1.70158;

				return --k * k * ((s + 1) * k + s) + 1;

			},

			InOut: function (k) {

				var s = 1.70158 * 1.525;

				if ((k *= 2) < 1) {
					return 0.5 * (k * k * ((s + 1) * k - s));
				}

				return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);

			}

		},

		Bounce: {

			In: function (k) {

				return 1 - TWEEN.Easing.Bounce.Out(1 - k);

			},

			Out: function (k) {

				if (k < (1 / 2.75)) {
					return 7.5625 * k * k;
				} else if (k < (2 / 2.75)) {
					return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
				} else if (k < (2.5 / 2.75)) {
					return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
				} else {
					return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
				}

			},

			InOut: function (k) {

				if (k < 0.5) {
					return TWEEN.Easing.Bounce.In(k * 2) * 0.5;
				}

				return TWEEN.Easing.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;

			}

		}

	};

	TWEEN.Interpolation = {

		Linear: function (v, k) {

			var m = v.length - 1;
			var f = m * k;
			var i = Math.floor(f);
			var fn = TWEEN.Interpolation.Utils.Linear;

			if (k < 0) {
				return fn(v[0], v[1], f);
			}

			if (k > 1) {
				return fn(v[m], v[m - 1], m - f);
			}

			return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);

		},

		Bezier: function (v, k) {

			var b = 0;
			var n = v.length - 1;
			var pw = Math.pow;
			var bn = TWEEN.Interpolation.Utils.Bernstein;

			for (var i = 0; i <= n; i++) {
				b += pw(1 - k, n - i) * pw(k, i) * v[i] * bn(n, i);
			}

			return b;

		},

		CatmullRom: function (v, k) {

			var m = v.length - 1;
			var f = m * k;
			var i = Math.floor(f);
			var fn = TWEEN.Interpolation.Utils.CatmullRom;

			if (v[0] === v[m]) {

				if (k < 0) {
					i = Math.floor(f = m * (1 + k));
				}

				return fn(v[(i - 1 + m) % m], v[i], v[(i + 1) % m], v[(i + 2) % m], f - i);

			} else {

				if (k < 0) {
					return v[0] - (fn(v[0], v[0], v[1], v[1], -f) - v[0]);
				}

				if (k > 1) {
					return v[m] - (fn(v[m], v[m], v[m - 1], v[m - 1], f - m) - v[m]);
				}

				return fn(v[i ? i - 1 : 0], v[i], v[m < i + 1 ? m : i + 1], v[m < i + 2 ? m : i + 2], f - i);

			}

		},

		Utils: {

			Linear: function (p0, p1, t) {

				return (p1 - p0) * t + p0;

			},

			Bernstein: function (n, i) {

				var fc = TWEEN.Interpolation.Utils.Factorial;

				return fc(n) / fc(i) / fc(n - i);

			},

			Factorial: (function () {

				var a = [1];

				return function (n) {

					var s = 1;

					if (a[n]) {
						return a[n];
					}

					for (var i = n; i > 1; i--) {
						s *= i;
					}

					a[n] = s;
					return s;

				};

			})(),

			CatmullRom: function (p0, p1, p2, p3, t) {

				var v0 = (p2 - p0) * 0.5;
				var v1 = (p3 - p1) * 0.5;
				var t2 = t * t;
				var t3 = t * t2;

				return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (- 3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;

			}

		}

	};

	return TWEEN;

})));
