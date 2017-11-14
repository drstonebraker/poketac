# PokeTac

[--> Live Link](https://www.poketac.com) (warning: this site plays music)

## About
I wanted to learn javascript, HTML, and CSS by building not just a basic Tic-Tac-Toe, but a game with 8 different artificially intelligent opponents
of different difficulty levels.  

The result is this game wrapped in a pokemon theme, which was chosen in part for the assets freely available online, and in part due to he natural fit given the storyline of 8 'gym leaders'.

## Technologies
To learn the fundamentals, this project was built with only HTML, CSS, Javascript, and JQuery

## Features

#### Progressive Web App
PokeTac uses Progressive Web App technology to allow users to download the game as a native mobile application (on supported phones) and play any time without an internet connection.

![A demonstration of Progressive Web App features](http://res.cloudinary.com/dvcr1kq1u/image/upload/v1510638619/progressive_web_app_small_ctg5ey.gif)

#### Custom CSS animations
Animations throughout the game were written custom using css keyframes.

![A demonstration of css animations](http://res.cloudinary.com/dvcr1kq1u/image/upload/v1510636289/animation_mqt7e2.gif)

```css
@keyframes speak {
    from {
        -webkit-transform: translate3d(30px, -10px, 0px) scale(.5);
                transform: translate3d(30px, -10px, 0px) scale(.5);
        opacity: .2;
    }

    to {
        -webkit-transform: translate3d(0px, 0px, 0px) scale(1);
                transform: translate3d(0px, 0px, 0px) scale(1);
        opacity: 1;
    }
}
```

#### Fully responsive layout
Fully responsive layout fluidly accommodates all screen sizes.

![A demonstration of responsive layout](http://res.cloudinary.com/dvcr1kq1u/image/upload/v1510636290/responsive_pifxzj.gif)

#### Spritesheet
Images are loaded via a spritesheet for faster load times.

![A segment of the spritesheet](http://res.cloudinary.com/dvcr1kq1u/image/upload/v1510638794/Screen_Shot_2017-11-13_at_9.52.17_PM_g1lsfn.png)

#### Smart AI
Each of 8 different opponents were given unique skill levels by applying various algorithms depending on the opponent.

```js
function aiMove(level) {
  if (
    !([6,7].indexOf(level) != -1 && aiSmartStart()) //try smartStart on appropriate ai level
    && !([1,2,4,5,6,7].indexOf(level) != -1 && aiSmartMove(WIN)) //try win on appropriate ai level
    && !([3,4,5,6,7].indexOf(level) != -1 && aiSmartMove(BLOCK)) //try block on appropriate ai level
    && !([7].indexOf(level) != -1 && aiSmartCounter()) //unbeatable second ai move
    && !([7].indexOf(level) != -1 && aiSmartMove(SETUP, true)) //make unbeatable setup move (i.e. do a double setup if possible)
    && !([2,5,6].indexOf(level) != -1 && aiSmartMove(SETUP)) //try setup on appropriate ai level
    ) {
    aiRandomMove(); //make random move if no better move available
  }
}
```
