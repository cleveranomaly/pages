window.onload = async () => {
  let html_style = document.createElement('style'); document.head.append(html_style);

  const process_unicode = (s) => {
    let v = s || '', chars = '~!@#$%^&*(){}[]<>=+|,./?:;'.split('');
    chars.forEach(c => v = v.replaceAll(c, `\\${c}`));
    return v; 
  }

  const append_style = (s) => { if(!html_style.innerHTML.includes(s)) html_style.innerHTML += s + '}'; }

  const map = {
    pseudoelement: new Map([['hov', ':hover']]),
    property: new Map([
      ['bg', 'background-color'], ['fg', 'color'], 
      ['ta', 'text-align'], ['td', 'text-decoration'],
      ['ff', 'font-family'], ['fs', 'font-size'], ['fw', 'font-weight'],
      ['d', 'display'],
      ['ggap', 'grid-gap'],
      ['jc', 'justify-content'],
      ['w', 'width'], ['h', 'height'],
      ['ts', 'transition'],
      ['p', 'padding'], ['m', 'margin']
    ]),
    value: new Map([
      ['text-align', new Map([['l', 'left'], ['r', 'right'], ['c', 'center'], ['j', 'justify']])],
      ['justify-content', new Map([
          ['l', 'left'], ['r', 'right'], ['c', 'center']
        ])
      ],
      ['display', new Map([
          ['in', 'inline'], 
          ['bl', 'block'], ['inbl', 'inline-block'],
          ['fl', 'flex'], ['infl', 'inline-flex'],
          ['gr', 'grid'], ['ingr', 'inline-grid']
        ])
      ]
    ])
  }

  const parse = (s) => {
    let splitted = s.split(/(?<=[\@\<\>\:\^])/g), table = { 
      breakpoint: false, pseudoelement: false, subelement: false, property: false, value: false, classname: process_unicode(s) 
    };

    splitted.forEach((s, i) => {
      if((i + 1) != splitted.length) {
        // if(s.endsWith('@')) table.breakpoint = s.slice(0, -1);
        if(s.endsWith(':')) table.pseudoelement = map.pseudoelement.get(s.slice(0, -1)) ?? '';
        else if(s.endsWith('>')) table.property = map.property.get(s.slice(0, -1)) ?? s.slice(0, -1);
        else if(s.endsWith('^')) table.subelement = s.slice(0, -1).split(/\,/g);
      } else table.value = (map.value.get(table.property)) ? ((map.value.get(table.property)).get(s) || s) : s;
    });

    return table;
  }

  const style_element = (e) => {
    e.className.split(/\s+/g).filter(s => s !== '').forEach(cn => {
      let parsed = parse(cn), css = `.${parsed.classname}`;
      
      parsed.subelement ? parsed.subelement.forEach((s, i) => { if(i + 1 != parsed.subelement.length) css += ` ${s} ~`; else css += ` ${s}`; }) : '';
      
      css += `${parsed.pseudoelement ? parsed.pseudoelement : ''}{`;

      if(parsed.property instanceof Array) parsed.property.forEach(s =>
        css += `${s}:${parsed.value.replaceAll(/\_/g, ' ')}${cn.startsWith('!') ? '!important' : ''};`
      ); else css += `${parsed.property}:${parsed.value.replaceAll(/\_/g, ' ')}${cn.startsWith('!') ? '!important' : ''};`;

      append_style(css);
    });
  }

  document.querySelectorAll('*').forEach(style_element);
  new MutationObserver((m) => m.forEach(style_element)).observe(document.body, { attributes: true, childList: true, childList: true });
}