# Chordipro

It is a program for editing and viewing chordpro format songs. I have implemented a chordpro parser, that can turn chordpro format songs into a useable, easy to work with object. This I then use to render it to HTML in Electron JS.

## Chordpro Format Example

```
{title:Let it Be}
Wh[G]en I find myself in t[D]imes of trouble, Mo[Em]ther Mary c[C]omes to me
```

This is a minimal example of a song. This needs to be transformed into something legible, when playing music. The title should be styled appropriately and the chords should be placed above the word after where they occur in the song.  
```
Let it Be
  G                    D                 Em          C
When I find myself in times of trouble, Mother Mary comes to me
```


## Installation

`git clone git@github.com:YesSeri/chordipro.git`
`npm install`
`npm run`
## Running Tests

To run tests, run the following command

```bash
  cd chordpro
  npm run test
```

