const load = (_map) => {
  const map = _map ?? {
    'fg': { prop_name: 'color', transform: false },
    'bg': { prop_name: 'background-color', transform: false },
    
    'd': { 
      prop_name: 'display', 
      transform: (s) => {
        switch(s) { 
          case 'inbl': return 'inline-block';
          case 'infl': return 'inline-flex';
          case 'bl': return 'block';
          case 'fl': return 'flex';
          case 'in': return 'inline';
          case 'tb': return 'table';
          default: return s;
        }
      }
    },
    'w': { prop_name: 'width', transform: false },
    'h': { prop_name: 'height', transform: false },
    'mw': { prop_name: 'min-width', transform: false },
    'mh': { prop_name: 'min-height', transform: false },

    't': { prop_name: 'top', transform: false },
    'pos': { 
      prop_name: 'position', transform: (s) => {
        switch(s) {
          case 'r': return 'relative';
          case 'f': return 'fixed';
          case 'a': return 'absolute';
          case 's': return 'sticky';
          case 'static': return 'static';
          default: return s;
        }
      }
    },

    'jc': {
      prop_name: 'justify-content',
      transform: (s) => {
        switch(s) {
          case 'fs': return 'flex-start';
          case 'fe': return 'flex-end';
          case 'c': return 'center';
          case 'sb': return 'space-between';
          case 'sa': return 'space-around';
          case 'se': return 'space-evenly';
          default: return s;
        }
      }
    },
    'gap': { prop_name: 'gap', transform: false },

    'ai': {
      prop_name: 'align-items',
      transform: (s) => {
        switch(s) {
          case 'fs': return 'flex-start';
          case 'fe': return 'flex-end';
          case 'c': return 'center';
          case 's': return 'stretch';
          case 'bl': return 'baseline';
          case 'fbl': return 'first baseline';
          case 'lbl': return 'last baseline';
          case 'ss': return 'self-start';
          case 'se': return 'self-end';
          case 'st': return 'start';
          case 'e': return 'end';
          default: return s;
        }
      }
    },
    'as': {
      prop_name: 'align-self',
      transform: (s) => {
        switch(s) {
          case 's': return 'stretch';
          case 'c': return 'center';
          default: return s;
        }
      }
    },

    'gtc': { prop_name: 'grid-template-columns', transform: (s) => s.replaceAll(/\,/g, ' ') },
    'gtr': { prop_name: 'grid-template-rows', transform: (s) => s.replaceAll(/\,/g, ' ') },
    'ggap': { prop_name: 'grid-gap', transform: false },

    'ff': { prop_name: 'font-family', transform: (s) => s.replace(/\-/g, ' ') },
    'fw': { prop_name: 'font-weight', transform: false },
    'fs': { prop_name: 'font-size', transform: false },

    'ta': { 
      prop_name: 'text-align', 
      transform: (s) => {
        switch(s) {
          case 'c': return 'center';
          case 'l': return 'left';
          case 'r': return 'right';
          case 'j': return 'justify';
          default: return s;
        }
      }
    },
    'tt': {
      prop_name: 'text-transform',
      transform: (s) => {
        switch(s) {
          case 'u': case 'uc': return 'uppercase';
          case 'l': case 'lc': return 'lowercase';
          case 'c': case 'cap': return 'capitalize';
        }
      }
    },
    'td': { prop_name: 'text-decoration', transform: false },

    'p': { prop_name: 'padding', transform: (s) => s.replace(/\,/g, ' ') },
    'pt': { prop_name: 'padding-top', transform: false },
    'pb': { prop_name: 'padding-bottom', transform: false },
    'pl': { prop_name: 'padding-left', transform: false },
    'pr': { prop_name: 'padding-right', transform: false },
    'px': { prop_name: 'padding', transform: (s) => `0 ${s}` },
    'py': { prop_name: 'padding', transform: (s) => `${s} 0` },

    'm': { prop_name: 'margin', transform: (s) => s.replace(/\,/g, ' ') },
    'mt': { prop_name: 'margin-top', transform: false },
    'mb': { prop_name: 'margin-bottom', transform: false },
    'ml': { prop_name: 'margin-left', transform: false },
    'mr': { prop_name: 'margin-right', transform: false },
    'mx': { prop_name: 'margin', transform: (s) => `0 ${s}` },
    'my': { prop_name: 'margin', transform: (s) => `${s} 0` },

    'ts': { prop_name: 'transition', transform: (s) => s
      .replaceAll('l', 'linear').replaceAll('e', 'ease')
      .replaceAll('ei', 'ease-in').replaceAll('eio', 'ease-in-out')
    }
  };

  let styleelement = document.createElement('style'); document.head.append(styleelement);
  // Separate the prefix (h:p, mx, etc.) and the parameter (value)
  const extract_value = (s) => [s.slice(0, s.indexOf('>')), s.slice(s.indexOf('>') + 1)];
  // Escape out special characters
  const esc = (s) => { let v = s; '!@#$%^&*()_+-=[]{}|"\';:/.,<>'.split('').forEach(c => v = v.replaceAll(c, `\\${c}`)); return v; }
  const append_style = (s) => { if(!styleelement.innerHTML.includes(s)) { styleelement.innerHTML += s; return true; } else return false; }

  const settings = {
    width_breakpoints: { sm: '480px', md: '768px', lg: '1024px', xl: '1200px' },
    pseudoelements: { hov: ':hover' }
  }

  // Style the elements. This adds code into the styleelement created above.
  const style_element = async (e) => {
    if(e.className) e.className.split(/\s+/g).forEach(c => {
      let ev = extract_value(c);
      for(let prop in map) if(ev[0].includes(prop) && ev[0].indexOf(prop) < c.indexOf('>')) {
        var param = esc(ev[1]), prop_name = map[prop].prop_name, style_value 
        = (map[prop].transform) ? map[prop].transform(ev[1]) : ev[1], set;

        let css = { 
          pseudoelement: (pe, mapped) => `.${pe}\\:${prop}\\>${param}${mapped}{${prop_name}:${style_value};}`,
          width_bp: (bp, mapped) => `@media screen and (min-width: ${mapped}){.${bp}\\@${prop}\\>${param}{${prop_name}:${style_value};}}`,
          normal: `.${prop}\\>${param}{${prop_name}:${style_value};}`
        };
        
        for(let pe in settings.pseudoelements)
          if(ev[0].startsWith(pe + ':')) set = append_style(css.pseudoelement(pe, settings.pseudoelements[pe]));
        for(let bp in settings.width_breakpoints)
          if(ev[0].startsWith(bp + '@')) set = append_style(css.width_bp(bp, settings.width_breakpoints[bp]));
        if(!set) append_style(css.normal);
      }
    }); 
  };

  document.querySelectorAll('*').forEach(style_element); document.body.style.opacity = '1';
  new MutationObserver((m) => m.forEach(v => v.addedNodes.forEach(style_element))).observe(document.body, { attributes: true, childList: true, subtree: true });
}