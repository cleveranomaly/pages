const load = (_map) => {
  let styleelement = document.createElement('style'); document.head.append(styleelement);
  // Separate the prefix (h:p, mx, etc.) and the parameter (value)
  const esc = (s) => { let v = s; '!@#$%^&*()_+-=[]{}|"\';:/.,<>'.split('').forEach(c => v = v.replaceAll(c, `\\${c}`)); return v; }
  const append_style = (s) => { if(!styleelement.innerHTML.includes(s)) { styleelement.innerHTML += s; return true; } else return false; }

  const tf_to_space = (s) => s.replaceAll(/\,/g, ' ');
  const ff_tf_to_space = (s) => s.replaceAll(/\-/g, ' ');

  const map_prop = new Map([
    ['ta', { 
      css_name: 'text-align', transform: (s) => {
        switch(s) {
          case 'c': return 'center'; case 'j': return 'justify';
          case 'l': return 'left'; case 'r': return 'right';
          default: return s;
        }
      } 
    }],
    ['p', { css_name: 'padding', transform: tf_to_space }],
    ['m', { css_name: 'margin', transform: tf_to_space }],
    ['bg', { css_name: 'background-color' }],
    ['fg', { css_name: 'color' }],
    ['d', { 
      css_name: 'display', transform: (s) => { 
        switch(s) {
          case 'in': return 'inline'; case 'tb': return 'table';
          case 'bl': return 'block'; case 'inbl': return 'inline-block';
          case 'fl': return 'flex'; case 'infl': return 'inline-flex';
          case 'gr': return 'grid'; case 'ingr': return 'inline-grid';
          default: return s;
        } 
      }
    }],
    ['jc', { 
      css_name: 'justify-content', transform: (s) => {
        switch(s) {
          case 's': return 'start'; case 'e': return 'e';
          case 'fs': return 'flex-start'; case 'fe': return 'flex-end';
          case 'c': return 'center'; case 'l': return 'left'; case 'r': return 'right';
          case 'sa': return 'space-around'; case 'sb': return 'space-between'; case 'se': return 'space-evenly';
          case 'st': return 'stretch'; case 'n': return 'normal'; default: return s;
        }
      }
    }],
    ['ff', { css_name: 'font-family', transform: ff_tf_to_space }],
    ['fs', { css_name: 'font-size' }],
    ['fw', { css_name: 'font-weight' }],
    ['ggap', { css_name: 'grid-gap' }],
    ['w', { css_name: 'width' }],
    ['h', { css_name: 'height' }],
    ['px', { css_name: ['padding-left', 'padding-right'] }],
    ['py', { css_name: ['padding-top', 'padding-bottom'] }],
    ['ts', { css_name: 'transition', transform: tf_to_space }],
    ['t', { css_name: 'top' }],
    ['pos', { 
      css_name: 'position', transform: (s) => {
        switch (s) {
          case 's': return 'sticky'; case 'a': return 'absolute';
          case 'r': return 'relative'; case 'f': return 'fixed'; 
          default: return s;
        }
      }
    }]
  ]);

  // Style the elements. This adds code into the styleelement created above.
  const style_element = async (e) => {
    if(e.className) e.className.split(/\s+/g).forEach(c => {
      let prop = c.slice(0, c.indexOf('>')), style_value = c.slice(c.indexOf('>') + 1), param = esc(style_value), 
        got_prop = map_prop.get(prop), computed_css;

      if(got_prop) {
        style_value = (got_prop.transform) ? got_prop.transform(style_value, e) : style_value;
        if(got_prop.css_name instanceof Array) { computed_css = `.${prop}\\>${param}{`; 
          got_prop.css_name.forEach(s => computed_css += `${s}:${style_value};`); computed_css += '}';
        } else computed_css = `.${prop}\\>${param}{${got_prop.css_name}:${style_value}}`;

        append_style(computed_css);
      }
    }); 
  };

  document.querySelectorAll('*').forEach(style_element); document.body.style.opacity = '1';
  new MutationObserver((m) => m.forEach(v => v.addedNodes.forEach(style_element))).observe(document.body, { attributes: true, childList: true, subtree: true });
}