---
title: "[ˈflɛmma]"
layout: default
id: home
---

# [ˈflɛmma]

![flemma-x](/flemma/images/StudioFlemma006.jpg)

<script>
files = {{ site.data.images["animation"] | jsonify }};
var l = files.length;

console.log("files", files);
im = document.getElementsByTagName('img')[0];

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
function doAnimate() {
  shuffle(files)
  var idx = 0;
  av({i: 0},
     1500,
     {i: 10,
      onUpdate: function(v){
        var vi = Math.floor(v.i)
        if(!vi) return;
        if (vi != idx) {
          im.src = 'images/' + files[idx].file
          idx = vi
        }
      }
  })
}
ivl = setInterval(doAnimate, 3000)
</script>
