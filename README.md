# vite-plugin-cssvg #

![Static Badge](https://img.shields.io/badge/author-jxk-blue)
![Static Badge](https://img.shields.io/badge/version-1.0.0-brightyellow)
![npm](https://img.shields.io/npm/dw/%40jackjiang18/vite-plugin-cssvg)


## Vite Plugin for svg in CSS/Less/SCSS ##

transform `url(**/*.svg)` to `url('data:image/svg+xml;utf8,<svg>...</svg>')`

### eg ###

```css
1. single imported svg

// index.css before transform
.some-class{
    background: url(/src/asset/a.svg) // support alias eg. url(/@/asset/a.svg)
}
// after 
.some-class{
    background: url('data:image/svg+xml;utf8,<svg>...</svg>')
}

2. imported svg used many times

// before
#root{
    --svg-a: url(/src/asset/a.svg)
}
.a-class{
    background: var(--svg-a)
}
.b-class{
    background: var(--svg-a)
}
// after
body{
    --svg-a: url('data:image/svg+xml;utf8,<svg>...</svg>')
}
.a-class{
    background: var(--svg-a)
}
.b-class{
    background: var(--svg-a)
}
```

### params ###

#### 1. exclude?: `FilterPattern` ####

defualt: `undefined`

#### 2. include?: `FilterPattern` ####

defualt: `[/\.s?css/, /\.less/]`

#### 3. inlineLimit?: `number` ####

default: `10` (kb)

## LICENSE ##

![GitHub](https://img.shields.io/github/license/yinguobing/cnn-facial-landmark)