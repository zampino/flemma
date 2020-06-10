// Main app
function animateValues(values, duration, options) {
  // Linear interpolation
  const lerp = (source, target, amount) => source + amount * (target - source)

  // Validation methods
  const checkNum = n => typeof n === 'number' ? n : null
  const checkFunc = f => typeof f === 'function' ? f : _ => _

  // Ensure methods.
  const onComplete = checkFunc(options.onComplete)
  const onUpdate = checkFunc(options.onUpdate)
  const ease = checkFunc(options.ease)

  // Animation start time
  const start = Date.now()

  // Create a map <key: [from, to]>
  const animationMap = Object.keys(values).reduce((map, key) => {
    const _from = checkNum(values[key])
    const _to = checkNum(options[key])
    if (_from !== null && _to !== null) map[key] = [_from, _to]
    return map
  }, {})

  // List of animating values
  const keys = Object.keys(animationMap)

  // Create & run animation function
  const animation = () => {
    const now = Date.now()
    let t = duration > 0 ? (now - start) / duration : 1

    // Update all values using 't'
    keys.forEach(key => {
      // If both 'from' and 'to' are numbers: animate!
      const [_from, _to] = animationMap[key]
      const progress = ease(t, _from, _to, duration)
      // Update value
      values[key] = lerp(_from, _to, progress)
    })

    // If complete..
    if (t >= 1) {
      // Final update for all keys
      keys.forEach(key => (values[key] = options[key]))
      onUpdate(values)
      onComplete(values)
    } else {
      // Run update callback and loop until finished
      onUpdate(values)
      requestAnimationFrame(animation)
    }
  }
  animation()
}
av = animateValues;
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let show = (imgs, i) => {
  // if (i > 0) { imgs[i - 1].style.display = 'none'; }
  hideAll(imgs)
  imgs[i].style.display = 'block';
}

let hideAll = (imgs) => {
  imgs.forEach((img, i) => {
    img.style.display = "none"
  });
}

function app(e, imgs) {
  // let doAnimate = function(){
  //   shuffle(imgs)
  //   var idx = 0;
  //   av({i: 0},
  //      1500,
  //      {i: imgs.length - 1,
  //       onUpdate: function(v, t){
  //         var vi = Math.floor(v.i)
  //         if(!vi) return;
  //         if (vi != idx) {
  //           imgs[vi].style.display = 'block';
  //           console.log("show", vi, t)
  //           if (vi > 0) { imgs[vi - 1].style.display = 'none'; }
  //           idx = vi
  //         }
  //       }
  //   })
  // }

  let doAnimate = () => {
    let last = performance.now()
    // hideAll(imgs)
    let n = imgs.length
    let i = 0
    let delta = 200
    console.log("starting - images ", n)
    let frameFn = (t, prev) => {
      if (i < imgs.length) {
        if (t - prev > delta) {
          console.log("show:", i)
          show(imgs, i)
          i = i + 1
          last = performance.now()
        }
        return true
      } else {
        if (t - prev > 10 * delta) {
          console.log("End now - shuffle")
          shuffle(imgs)
          return false
        } else {
          return true
        }
      }
    }
    let f = function g(t) {
      if (frameFn(t, last)) {
        requestAnimationFrame(g)
      } else {
        doAnimate()
      }
    }
    f()
  }
  console.log("boot app", e)
  // ivl = setInterval(doAnimate, 10000)
  doAnimate()
}
// show each frame for Δ
// now - last > Δ
